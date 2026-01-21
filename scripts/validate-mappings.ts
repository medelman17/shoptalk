#!/usr/bin/env tsx
/**
 * Validates contract chain mappings for consistency.
 *
 * Checks:
 * 1. All document IDs in mapping.ts exist in supplements.ts
 * 2. All document IDs in supplements.ts exist in manifest.ts
 * 3. All manifest entries have corresponding PDF files
 * 4. Reports orphaned documents (in manifest but never referenced)
 * 5. Reports phantom documents (in supplements.ts but no PDF)
 *
 * Usage: pnpm tsx scripts/validate-mappings.ts
 */

import fs from "fs";
import path from "path";

import { DOCUMENT_MANIFEST } from "../src/lib/documents/manifest";
import {
  MASTER_AGREEMENT,
  SUPPLEMENTS,
  RIDERS,
  getAllDocumentIds,
} from "../src/lib/union/supplements";

// We need to extract the mapping IDs without importing the full module
// to avoid circular dependency issues. Read the file directly.
function extractMappingIds(): {
  supplements: Set<string>;
  riders: Set<string>;
} {
  const mappingPath = path.join(process.cwd(), "src/lib/union/mapping.ts");
  const content = fs.readFileSync(mappingPath, "utf-8");

  const supplements = new Set<string>();
  const riders = new Set<string>();

  // Match supplements arrays: supplements: ["western", "local-705"]
  const supplementsMatches = content.matchAll(/supplements:\s*\[([^\]]+)\]/g);
  for (const match of supplementsMatches) {
    const ids = match[1].match(/"([^"]+)"/g);
    if (ids) {
      ids.forEach((id) => supplements.add(id.replace(/"/g, "")));
    }
  }

  // Match riders arrays: riders: ["northern-california", "local-177-drivers"]
  const ridersMatches = content.matchAll(/riders:\s*\[([^\]]+)\]/g);
  for (const match of ridersMatches) {
    const ids = match[1].match(/"([^"]+)"/g);
    if (ids) {
      ids.forEach((id) => riders.add(id.replace(/"/g, "")));
    }
  }

  return { supplements, riders };
}

function validateMappings() {
  console.log("Validating contract chain mappings...\n");

  const errors: string[] = [];
  const warnings: string[] = [];

  // Get all IDs from each source
  const manifestIds = new Set(DOCUMENT_MANIFEST.map((d) => d.id));
  const supplementIds = new Set([
    MASTER_AGREEMENT.id,
    ...Object.keys(SUPPLEMENTS),
    ...Object.keys(RIDERS),
  ]);
  const { supplements: mappingSupplements, riders: mappingRiders } =
    extractMappingIds();
  const allMappingIds = new Set([...mappingSupplements, ...mappingRiders]);

  // 1. Check all mapping IDs exist in supplements.ts
  console.log("1. Checking mapping.ts → supplements.ts...");
  let mappingErrors = 0;
  for (const id of allMappingIds) {
    if (!supplementIds.has(id)) {
      errors.push(
        `   ✗ mapping.ts references "${id}" but it's not in supplements.ts`,
      );
      mappingErrors++;
    }
  }
  if (mappingErrors === 0) {
    console.log(
      `   ✓ All ${allMappingIds.size} document IDs in mapping.ts exist in supplements.ts`,
    );
  } else {
    console.log(
      `   ✗ ${mappingErrors} IDs in mapping.ts not found in supplements.ts`,
    );
  }

  // 2. Check all supplements.ts IDs exist in manifest.ts
  console.log("\n2. Checking supplements.ts → manifest.ts...");
  let supplementErrors = 0;
  const phantomDocs: string[] = [];
  for (const id of supplementIds) {
    if (!manifestIds.has(id)) {
      phantomDocs.push(id);
      supplementErrors++;
    }
  }
  if (supplementErrors === 0) {
    console.log(
      `   ✓ All ${supplementIds.size} document definitions have matching manifest entries`,
    );
  } else {
    console.log(
      `   ⚠ ${supplementErrors} IDs in supplements.ts not found in manifest.ts (phantom docs)`,
    );
    phantomDocs.forEach((id) => {
      warnings.push(
        `   ⚠ Phantom document: "${id}" defined in supplements.ts but no manifest entry`,
      );
    });
  }

  // 3. Check all manifest entries have PDF files
  console.log("\n3. Checking manifest.ts → PDF files...");
  let pdfErrors = 0;
  for (const doc of DOCUMENT_MANIFEST) {
    const pdfPath = path.join(process.cwd(), doc.filePath);
    if (!fs.existsSync(pdfPath)) {
      errors.push(`   ✗ Missing PDF: ${doc.filePath} for document "${doc.id}"`);
      pdfErrors++;
    }
  }
  if (pdfErrors === 0) {
    console.log(
      `   ✓ All ${DOCUMENT_MANIFEST.length} manifest documents have PDF files`,
    );
  } else {
    console.log(`   ✗ ${pdfErrors} manifest documents missing PDF files`);
  }

  // 4. Check for orphaned documents (in manifest but not in supplements.ts)
  console.log("\n4. Checking for orphaned documents...");
  const orphanedDocs: string[] = [];
  for (const doc of DOCUMENT_MANIFEST) {
    if (!supplementIds.has(doc.id)) {
      orphanedDocs.push(doc.id);
    }
  }
  if (orphanedDocs.length === 0) {
    console.log(`   ✓ All manifest documents are defined in supplements.ts`);
  } else {
    console.log(
      `   ⚠ ${orphanedDocs.length} documents in manifest.ts not in supplements.ts:`,
    );
    orphanedDocs.forEach((id) => {
      warnings.push(
        `   ⚠ Orphaned document: "${id}" in manifest but not defined in supplements.ts`,
      );
    });
  }

  // 5. Check for unreferenced supplements (in supplements.ts but not used in mapping)
  console.log("\n5. Checking for unreferenced documents...");
  const unreferencedDocs: string[] = [];
  for (const id of supplementIds) {
    if (id === "master") continue; // Master is always implicitly used
    if (!allMappingIds.has(id)) {
      unreferencedDocs.push(id);
    }
  }
  if (unreferencedDocs.length === 0) {
    console.log(`   ✓ All supplements/riders are referenced in mapping.ts`);
  } else {
    console.log(
      `   ⚠ ${unreferencedDocs.length} documents defined but not referenced in any Local mapping:`,
    );
    unreferencedDocs.forEach((id) => {
      warnings.push(`   ⚠ Unreferenced: "${id}" defined but no Local uses it`);
    });
  }

  // Print summary
  console.log("\n" + "═".repeat(60));
  console.log("SUMMARY");
  console.log("═".repeat(60));

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach((e) => console.log(e));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach((w) => console.log(w));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("\n✅ All validations passed!");
    process.exit(0);
  } else if (errors.length === 0) {
    console.log(`\n✅ Validation passed with ${warnings.length} warning(s)`);
    process.exit(0);
  } else {
    console.log(`\n❌ Validation failed with ${errors.length} error(s)`);
    process.exit(1);
  }
}

validateMappings();
