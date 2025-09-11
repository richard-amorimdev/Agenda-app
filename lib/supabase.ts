import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          name: string
          role: "admin" | "consultor"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          name: string
          role?: "admin" | "consultor"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          name?: string
          role?: "admin" | "consultor"
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          client_name: string
          consultant_id: string
          start_date: string
          end_date: string
          time_slot: "manha" | "tarde" | "integral" // Novo campo
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          client_name: string
          consultant_id: string
          start_date: string
          end_date: string
          time_slot: "manha" | "tarde" | "integral" // Novo campo
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          client_name?: string
          consultant_id?: string
          start_date?: string
          end_date?: string
          time_slot?: "manha" | "tarde" | "integral" // Novo campo
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
