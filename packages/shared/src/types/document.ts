export type DocumentType = "master" | "supplement" | "rider" | "local";

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  region: string | null;
  effectiveDate: string | null;
  pdfPath: string;
  pageCount: number | null;
  createdAt: string;
}

export interface LocalUnion {
  localNumber: number;
  name: string;
  region: string;
  state: string;
  primarySupplementId: string;
}

export interface LocalWithDocuments extends LocalUnion {
  documents: Document[];
}
