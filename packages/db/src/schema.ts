import {
  pgTable,
  text,
  integer,
  timestamp,
  date,
  uuid,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// Users
// ============================================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email"),
  phone: text("phone"),
  localNumber: integer("local_number").notNull(),
  classification: text("classification").notNull(),
  // Nullable fields for v2 chat features
  hubId: text("hub_id"),
  shift: text("shift"),
  seniorityDate: date("seniority_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  local: one(locals, {
    fields: [users.localNumber],
    references: [locals.localNumber],
  }),
  queries: many(queries),
}));

// ============================================================================
// Local Unions
// ============================================================================

export const locals = pgTable("locals", {
  localNumber: integer("local_number").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  state: text("state").notNull(),
  city: text("city"),
  primarySupplementId: text("primary_supplement_id").notNull(),
});

export const localsRelations = relations(locals, ({ many }) => ({
  users: many(users),
  localDocuments: many(localDocuments),
}));

// ============================================================================
// Documents
// ============================================================================

export const documents = pgTable("documents", {
  id: text("id").primaryKey(), // e.g., 'master-2023', 'western-supplement-2023'
  title: text("title").notNull(),
  type: text("type").notNull(), // 'master', 'supplement', 'rider', 'local'
  region: text("region"),
  effectiveDate: date("effective_date"),
  pdfPath: text("pdf_path").notNull(), // Supabase storage path
  pageCount: integer("page_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentsRelations = relations(documents, ({ many }) => ({
  localDocuments: many(localDocuments),
}));

// ============================================================================
// Local-to-Document Mapping
// ============================================================================

export const localDocuments = pgTable(
  "local_documents",
  {
    localNumber: integer("local_number")
      .notNull()
      .references(() => locals.localNumber),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id),
    priority: integer("priority").default(0).notNull(), // Order for display
  },
  (t) => [primaryKey({ columns: [t.localNumber, t.documentId] })]
);

export const localDocumentsRelations = relations(localDocuments, ({ one }) => ({
  local: one(locals, {
    fields: [localDocuments.localNumber],
    references: [locals.localNumber],
  }),
  document: one(documents, {
    fields: [localDocuments.documentId],
    references: [documents.id],
  }),
}));

// ============================================================================
// Query History
// ============================================================================

export const queries = pgTable("queries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  queryText: text("query_text").notNull(),
  responseText: text("response_text"),
  citations: jsonb("citations").$type<CitationJson[]>(),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const queriesRelations = relations(queries, ({ one }) => ({
  user: one(users, {
    fields: [queries.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// Types
// ============================================================================

export interface CitationJson {
  documentId: string;
  documentTitle: string;
  article: string | null;
  section: string | null;
  subsection: string | null;
  pageNumber: number;
  excerpt: string;
}

// Inferred types for use in application code
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Local = typeof locals.$inferSelect;
export type NewLocal = typeof locals.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type LocalDocument = typeof localDocuments.$inferSelect;
export type NewLocalDocument = typeof localDocuments.$inferInsert;

export type Query = typeof queries.$inferSelect;
export type NewQuery = typeof queries.$inferInsert;
