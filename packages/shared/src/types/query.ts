export interface Citation {
  documentId: string;
  documentTitle: string;
  article: string | null;
  section: string | null;
  subsection: string | null;
  pageNumber: number;
  excerpt: string;
}

export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  id: string;
  query: string;
  response: string;
  citations: Citation[];
  durationMs: number;
  createdAt: string;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  responsePreview: string;
  citationCount: number;
  createdAt: string;
}
