import "dotenv/config";
import { ingestPdf } from "./ingest-pdf";

const DOCUMENTS_TO_INGEST = [
  {
    id: "master-2023",
    title: "National Master Agreement 2023-2028",
    type: "master",
    filePath: "./documents/master-agreement-2023.pdf",
  },
  {
    id: "western-supplement-2023",
    title: "Western Region Supplement 2023-2028",
    type: "supplement",
    region: "western",
    filePath: "./documents/western-supplement-2023.pdf",
  },
  {
    id: "central-supplement-2023",
    title: "Central Region Supplement 2023-2028",
    type: "supplement",
    region: "central",
    filePath: "./documents/central-supplement-2023.pdf",
  },
  {
    id: "southern-supplement-2023",
    title: "Southern Region Supplement 2023-2028",
    type: "supplement",
    region: "southern",
    filePath: "./documents/southern-supplement-2023.pdf",
  },
  {
    id: "atlantic-supplement-2023",
    title: "Atlantic Area Supplement 2023-2028",
    type: "supplement",
    region: "atlantic",
    filePath: "./documents/atlantic-supplement-2023.pdf",
  },
  {
    id: "eastern-supplement-2023",
    title: "Eastern Region Supplement 2023-2028",
    type: "supplement",
    region: "eastern",
    filePath: "./documents/eastern-supplement-2023.pdf",
  },
];

async function main() {
  console.log("Starting document ingestion...\n");

  for (const doc of DOCUMENTS_TO_INGEST) {
    console.log(`Processing: ${doc.title}`);
    try {
      await ingestPdf(doc);
      console.log(`  ✓ Completed\n`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error}\n`);
    }
  }

  console.log("Ingestion complete!");
}

main().catch(console.error);
