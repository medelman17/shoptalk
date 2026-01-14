export interface Env {
  // Database
  DATABASE_URL: string;

  // Clerk
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET: string;

  // Pinecone
  PINECONE_API_KEY: string;
  PINECONE_INDEX: string;

  // OpenAI (embeddings)
  OPENAI_API_KEY: string;

  // Anthropic (LLM)
  ANTHROPIC_API_KEY: string;

  // Supabase Storage
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export interface AuthUser {
  userId: string;
  sessionId: string;
}
