import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { locals, documents, localDocuments } from "@shoptalk/db";

// Initialize database
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Sample locals data - expand this with full list
const LOCALS_DATA = [
  // Western Region
  { localNumber: 63, name: "Teamsters Local 63", region: "Western", state: "CA", city: "Covina", primarySupplementId: "western-supplement-2023" },
  { localNumber: 70, name: "Teamsters Local 70", region: "Western", state: "CA", city: "Oakland", primarySupplementId: "western-supplement-2023" },
  { localNumber: 104, name: "Teamsters Local 104", region: "Western", state: "AZ", city: "Phoenix", primarySupplementId: "western-supplement-2023" },
  { localNumber: 117, name: "Teamsters Local 117", region: "Western", state: "WA", city: "Tukwila", primarySupplementId: "western-supplement-2023" },
  { localNumber: 150, name: "Teamsters Local 150", region: "Western", state: "CA", city: "Sacramento", primarySupplementId: "western-supplement-2023" },
  { localNumber: 166, name: "Teamsters Local 166", region: "Western", state: "CA", city: "Bloomington", primarySupplementId: "western-supplement-2023" },
  { localNumber: 186, name: "Teamsters Local 186", region: "Western", state: "CA", city: "Ventura", primarySupplementId: "western-supplement-2023" },
  { localNumber: 396, name: "Teamsters Local 396", region: "Western", state: "CA", city: "Covina", primarySupplementId: "western-supplement-2023" },
  { localNumber: 542, name: "Teamsters Local 542", region: "Western", state: "CA", city: "San Diego", primarySupplementId: "western-supplement-2023" },

  // Central Region
  { localNumber: 135, name: "Teamsters Local 135", region: "Central", state: "IN", city: "Indianapolis", primarySupplementId: "central-supplement-2023" },
  { localNumber: 142, name: "Teamsters Local 142", region: "Central", state: "IN", city: "Gary", primarySupplementId: "central-supplement-2023" },
  { localNumber: 243, name: "Teamsters Local 243", region: "Central", state: "IN", city: "Indianapolis", primarySupplementId: "central-supplement-2023" },
  { localNumber: 299, name: "Teamsters Local 299", region: "Central", state: "MI", city: "Detroit", primarySupplementId: "central-supplement-2023" },
  { localNumber: 337, name: "Teamsters Local 337", region: "Central", state: "MI", city: "Detroit", primarySupplementId: "central-supplement-2023" },
  { localNumber: 407, name: "Teamsters Local 407", region: "Central", state: "OH", city: "Cleveland", primarySupplementId: "central-supplement-2023" },
  { localNumber: 413, name: "Teamsters Local 413", region: "Central", state: "OH", city: "Columbus", primarySupplementId: "central-supplement-2023" },
  { localNumber: 480, name: "Teamsters Local 480", region: "Central", state: "MN", city: "St. Paul", primarySupplementId: "central-supplement-2023" },
  { localNumber: 710, name: "Teamsters Local 710", region: "Central", state: "IL", city: "Mokena", primarySupplementId: "local-710-2023" },

  // Southern Region
  { localNumber: 19, name: "Teamsters Local 19", region: "Southern", state: "TN", city: "Memphis", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 89, name: "Teamsters Local 89", region: "Southern", state: "KY", city: "Louisville", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 391, name: "Teamsters Local 391", region: "Southern", state: "NC", city: "Greensboro", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 480, name: "Teamsters Local 480", region: "Southern", state: "TX", city: "Houston", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 657, name: "Teamsters Local 657", region: "Southern", state: "TX", city: "San Antonio", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 728, name: "Teamsters Local 728", region: "Southern", state: "GA", city: "Atlanta", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 767, name: "Teamsters Local 767", region: "Southern", state: "TX", city: "Dallas", primarySupplementId: "southern-supplement-2023" },
  { localNumber: 988, name: "Teamsters Local 988", region: "Southern", state: "TX", city: "Houston", primarySupplementId: "southern-supplement-2023" },

  // Atlantic Area
  { localNumber: 107, name: "Teamsters Local 107", region: "Atlantic", state: "PA", city: "Philadelphia", primarySupplementId: "atlantic-supplement-2023" },
  { localNumber: 177, name: "Teamsters Local 177", region: "Atlantic", state: "NJ", city: "Hillside", primarySupplementId: "atlantic-supplement-2023" },
  { localNumber: 355, name: "Teamsters Local 355", region: "Atlantic", state: "MD", city: "Baltimore", primarySupplementId: "atlantic-supplement-2023" },
  { localNumber: 384, name: "Teamsters Local 384", region: "Atlantic", state: "PA", city: "Norristown", primarySupplementId: "atlantic-supplement-2023" },
  { localNumber: 639, name: "Teamsters Local 639", region: "Atlantic", state: "DC", city: "Washington", primarySupplementId: "atlantic-supplement-2023" },

  // Eastern Region
  { localNumber: 25, name: "Teamsters Local 25", region: "Eastern", state: "MA", city: "Boston", primarySupplementId: "eastern-supplement-2023" },
  { localNumber: 170, name: "Teamsters Local 170", region: "Eastern", state: "MA", city: "Worcester", primarySupplementId: "eastern-supplement-2023" },
  { localNumber: 251, name: "Teamsters Local 251", region: "Eastern", state: "RI", city: "Providence", primarySupplementId: "eastern-supplement-2023" },
  { localNumber: 671, name: "Teamsters Local 671", region: "Eastern", state: "CT", city: "Hartford", primarySupplementId: "eastern-supplement-2023" },
  { localNumber: 804, name: "Teamsters Local 804", region: "Eastern", state: "NY", city: "Long Island City", primarySupplementId: "local-804-2023" },
];

// Documents data
const DOCUMENTS_DATA = [
  { id: "master-2023", title: "National Master UPS Agreement 2023-2028", type: "master", region: null, pdfPath: "master-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "western-supplement-2023", title: "Western Region Supplement 2023-2028", type: "supplement", region: "Western", pdfPath: "western-supplement-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "central-supplement-2023", title: "Central Region Supplement 2023-2028", type: "supplement", region: "Central", pdfPath: "central-supplement-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "southern-supplement-2023", title: "Southern Region Supplement 2023-2028", type: "supplement", region: "Southern", pdfPath: "southern-supplement-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "atlantic-supplement-2023", title: "Atlantic Area Supplement 2023-2028", type: "supplement", region: "Atlantic", pdfPath: "atlantic-supplement-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "eastern-supplement-2023", title: "Eastern Region Supplement 2023-2028", type: "supplement", region: "Eastern", pdfPath: "eastern-supplement-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "local-804-2023", title: "Local 804 Supplemental Agreement 2023-2028", type: "local", region: "Eastern", pdfPath: "local-804-2023.pdf", effectiveDate: "2023-08-01" },
  { id: "local-710-2023", title: "Local 710 Supplemental Agreement 2023-2028", type: "local", region: "Central", pdfPath: "local-710-2023.pdf", effectiveDate: "2023-08-01" },
];

async function seedDatabase() {
  console.log("Seeding database...\n");

  // Insert documents
  console.log("Inserting documents...");
  for (const doc of DOCUMENTS_DATA) {
    await db
      .insert(documents)
      .values({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        region: doc.region,
        pdfPath: doc.pdfPath,
        effectiveDate: doc.effectiveDate,
      })
      .onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${DOCUMENTS_DATA.length} documents\n`);

  // Insert locals
  console.log("Inserting locals...");
  for (const local of LOCALS_DATA) {
    await db
      .insert(locals)
      .values(local)
      .onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${LOCALS_DATA.length} locals\n`);

  // Create local-document mappings
  console.log("Creating document mappings...");
  let mappingCount = 0;

  for (const local of LOCALS_DATA) {
    // Everyone gets the master agreement
    await db
      .insert(localDocuments)
      .values({
        localNumber: local.localNumber,
        documentId: "master-2023",
        priority: 0,
      })
      .onConflictDoNothing();
    mappingCount++;

    // Add the primary supplement
    if (local.primarySupplementId) {
      await db
        .insert(localDocuments)
        .values({
          localNumber: local.localNumber,
          documentId: local.primarySupplementId,
          priority: 1,
        })
        .onConflictDoNothing();
      mappingCount++;
    }
  }
  console.log(`  ✓ Created ${mappingCount} document mappings\n`);

  console.log("Seeding complete!");
}

seedDatabase().catch(console.error);
