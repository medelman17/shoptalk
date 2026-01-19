export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      queries: {
        Row: {
          answer: string | null;
          citations: Json;
          created_at: string;
          id: string;
          question: string;
          user_id: string;
        };
        Insert: {
          answer?: string | null;
          citations?: Json;
          created_at?: string;
          id?: string;
          question: string;
          user_id: string;
        };
        Update: {
          answer?: string | null;
          citations?: Json;
          created_at?: string;
          id?: string;
          question?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "queries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_profiles: {
        Row: {
          classification: string | null;
          clerk_id: string;
          created_at: string;
          email: string | null;
          id: string;
          local_number: string | null;
          supplement_ids: string[];
          updated_at: string;
        };
        Insert: {
          classification?: string | null;
          clerk_id: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          local_number?: string | null;
          supplement_ids?: string[];
          updated_at?: string;
        };
        Update: {
          classification?: string | null;
          clerk_id?: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          local_number?: string | null;
          supplement_ids?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

// Convenience types
export type UserProfile = Tables<"user_profiles">;
export type UserProfileInsert = TablesInsert<"user_profiles">;
export type UserProfileUpdate = TablesUpdate<"user_profiles">;

export type Query = Tables<"queries">;
export type QueryInsert = TablesInsert<"queries">;
export type QueryUpdate = TablesUpdate<"queries">;

// Citation type for query history
export type Citation = {
  source: string;
  text: string;
  page?: number;
  section?: string;
};
