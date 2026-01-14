import "dotenv/config";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

interface DocumentConfig {
  id: string;
  title: string;
  type: string;
  region?: string;
  filePath: string;
}

interface Chunk {
  text: string;
  metadata: {
    documentId: string;
    documentTitle: string;
    documentType: string;
    region: string | null;
    article: string | null;
    section: string | null;
    subsection: string | null;
    pageNumber: number;
    chunkIndex: number;
  };
}

const TARGET_CHUNK_SIZE = 400; // tokens
const CHUNK_OVERLAP = 50; // tokens

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Token encoder
const encoder = encoding_for_model("gpt-4");

function countTokens(text: string): number {
  return encoder.encode(text).length;
}

function extractArticleSection(
  text: string
): { article: string | null; section: string | null; subsection: string | null } {
  // Match patterns like "Article 15", "Section 2", "(a)" or "(1)"
  const articleMatch = text.match(/Article\s+(\d+[A-Za-z]*)/i);
  const sectionMatch = text.match(/Section\s+(\d+[A-Za-z]*)/i);
  const subsectionMatch = text.match(/\(([a-z]|\d+)\)/i);

  return {
    article: articleMatch ? `Article ${articleMatch[1]}` : null,
    section: sectionMatch ? `Section ${sectionMatch[1]}` : null,
    subsection: subsectionMatch ? `(${subsectionMatch[1]})` : null,
  };
}

function splitIntoChunks(text: string, config: DocumentConfig): Chunk[] {
  const chunks: Chunk[] = [];
  const pages = text.split(/\f/); // Form feed character often separates pages

  let chunkIndex = 0;
  let currentArticle: string | null = null;
  let currentSection: string | null = null;

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const pageText = pages[pageIndex];
    const pageNumber = pageIndex + 1;

    // Split page into paragraphs
    const paragraphs = pageText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    let currentChunk = "";
    let currentChunkTokens = 0;

    for (const paragraph of paragraphs) {
      // Extract article/section info
      const extracted = extractArticleSection(paragraph);
      if (extracted.article) currentArticle = extracted.article;
      if (extracted.section) currentSection = extracted.section;

      const paragraphTokens = countTokens(paragraph);

      // If adding this paragraph would exceed target, save current chunk
      if (
        currentChunkTokens + paragraphTokens > TARGET_CHUNK_SIZE &&
        currentChunk.length > 0
      ) {
        chunks.push({
          text: currentChunk.trim(),
          metadata: {
            documentId: config.id,
            documentTitle: config.title,
            documentType: config.type,
            region: config.region ?? null,
            article: currentArticle,
            section: currentSection,
            subsection: extracted.subsection,
            pageNumber,
            chunkIndex: chunkIndex++,
          },
        });

        // Start new chunk with overlap from previous
        const words = currentChunk.split(" ");
        const overlapWords = words.slice(-Math.floor(CHUNK_OVERLAP / 2));
        currentChunk = overlapWords.join(" ");
        currentChunkTokens = countTokens(currentChunk);
      }

      currentChunk += (currentChunk ? " " : "") + paragraph;
      currentChunkTokens += paragraphTokens;
    }

    // Save any remaining content
    if (currentChunk.trim().length > 0) {
      const extracted = extractArticleSection(currentChunk);
      chunks.push({
        text: currentChunk.trim(),
        metadata: {
          documentId: config.id,
          documentTitle: config.title,
          documentType: config.type,
          region: config.region ?? null,
          article: currentArticle,
          section: currentSection,
          subsection: extracted.subsection,
          pageNumber,
          chunkIndex: chunkIndex++,
        },
      });
    }
  }

  return chunks;
}

async function generateEmbeddings(chunks: Chunk[]): Promise<number[][]> {
  const batchSize = 100;
  const embeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: batch.map((c) => c.text),
    });

    embeddings.push(...response.data.map((d) => d.embedding));
    console.log(`  Generated embeddings: ${embeddings.length}/${chunks.length}`);
  }

  return embeddings;
}

async function uploadToPinecone(
  chunks: Chunk[],
  embeddings: number[][]
): Promise<void> {
  const index = pinecone.index(process.env.PINECONE_INDEX!);

  const vectors = chunks.map((chunk, i) => {
    // Convert null values to empty strings for Pinecone compatibility
    const metadata: Record<string, string | number> = {
      documentId: chunk.metadata.documentId,
      documentTitle: chunk.metadata.documentTitle,
      documentType: chunk.metadata.documentType,
      region: chunk.metadata.region ?? "",
      article: chunk.metadata.article ?? "",
      section: chunk.metadata.section ?? "",
      subsection: chunk.metadata.subsection ?? "",
      pageNumber: chunk.metadata.pageNumber,
      chunkIndex: chunk.metadata.chunkIndex,
      text: chunk.text, // Store text for retrieval
    };

    return {
      id: `${chunk.metadata.documentId}-${chunk.metadata.chunkIndex}`,
      values: embeddings[i],
      metadata,
    };
  });

  // Upload in batches of 100
  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    console.log(`  Uploaded to Pinecone: ${Math.min(i + batchSize, vectors.length)}/${vectors.length}`);
  }
}

export async function ingestPdf(config: DocumentConfig): Promise<void> {
  // Read PDF
  const filePath = path.resolve(config.filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);

  console.log(`  Pages: ${pdfData.numpages}`);
  console.log(`  Characters: ${pdfData.text.length}`);

  // Split into chunks
  const chunks = splitIntoChunks(pdfData.text, config);
  console.log(`  Chunks: ${chunks.length}`);

  // Generate embeddings
  const embeddings = await generateEmbeddings(chunks);

  // Upload to Pinecone
  await uploadToPinecone(chunks, embeddings);
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: tsx ingest-pdf.ts <document-id> <pdf-path> [title] [type] [region]");
    process.exit(1);
  }

  const [id, filePath, title, type, region] = args;

  ingestPdf({
    id,
    filePath,
    title: title ?? id,
    type: type ?? "document",
    region,
  })
    .then(() => console.log("Done!"))
    .catch(console.error);
}
