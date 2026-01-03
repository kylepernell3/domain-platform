// Type definitions for Supabase Database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
      }
      domains: {
        Row: {
          id: string
          user_id: string
          domain_name: string
          status: 'active' | 'pending' | 'expired'
          expires_at: string
          created_at: string
        }
      }
      ssl_certificates: {
        Row: {
          id: string
          user_id: string
          domain_id: string
          status: 'active' | 'pending' | 'expired'
          issued_at: string
          expires_at: string
        }
      }
    }
  }
}
