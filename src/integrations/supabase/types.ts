export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          admin_password_hash: string | null
          created_at: string
          email_sender_email: string | null
          email_sender_name: string | null
          event_date: string | null
          event_time: string | null
          id: string
          stripe_public_key: string | null
          stripe_secret_key: string | null
          team_entry_price: number | null
          updated_at: string
        }
        Insert: {
          admin_password_hash?: string | null
          created_at?: string
          email_sender_email?: string | null
          email_sender_name?: string | null
          event_date?: string | null
          event_time?: string | null
          id?: string
          stripe_public_key?: string | null
          stripe_secret_key?: string | null
          team_entry_price?: number | null
          updated_at?: string
        }
        Update: {
          admin_password_hash?: string | null
          created_at?: string
          email_sender_email?: string | null
          email_sender_name?: string | null
          event_date?: string | null
          event_time?: string | null
          id?: string
          stripe_public_key?: string | null
          stripe_secret_key?: string | null
          team_entry_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient_email: string
          retry_count: number | null
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email_type: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          capacity: number | null
          created_at: string
          custom_rules_notes: string | null
          date: string
          description: string | null
          display_order: number | null
          email_template: string | null
          end_time: string | null
          event_type: string
          featured: boolean
          hero_image: string | null
          id: string
          location: string | null
          location_id: string | null
          location_notes: string | null
          map_link: string | null
          match_duration: number | null
          max_roster_size: number | null
          min_roster_size: number | null
          pinned: boolean
          price: number | null
          registration_close_at: string | null
          roster_lock_at: string | null
          short_description: string | null
          start_time: string
          status: string
          surface_type: string | null
          target_score: number | null
          title: string
          updated_at: string
          venue_name: string | null
          waitlist_capacity: number | null
          waitlist_enabled: boolean
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          created_at?: string
          custom_rules_notes?: string | null
          date: string
          description?: string | null
          display_order?: number | null
          email_template?: string | null
          end_time?: string | null
          event_type?: string
          featured?: boolean
          hero_image?: string | null
          id?: string
          location?: string | null
          location_id?: string | null
          location_notes?: string | null
          map_link?: string | null
          match_duration?: number | null
          max_roster_size?: number | null
          min_roster_size?: number | null
          pinned?: boolean
          price?: number | null
          registration_close_at?: string | null
          roster_lock_at?: string | null
          short_description?: string | null
          start_time: string
          status?: string
          surface_type?: string | null
          target_score?: number | null
          title: string
          updated_at?: string
          venue_name?: string | null
          waitlist_capacity?: number | null
          waitlist_enabled?: boolean
        }
        Update: {
          address?: string | null
          capacity?: number | null
          created_at?: string
          custom_rules_notes?: string | null
          date?: string
          description?: string | null
          display_order?: number | null
          email_template?: string | null
          end_time?: string | null
          event_type?: string
          featured?: boolean
          hero_image?: string | null
          id?: string
          location?: string | null
          location_id?: string | null
          location_notes?: string | null
          map_link?: string | null
          match_duration?: number | null
          max_roster_size?: number | null
          min_roster_size?: number | null
          pinned?: boolean
          price?: number | null
          registration_close_at?: string | null
          roster_lock_at?: string | null
          short_description?: string | null
          start_time?: string
          status?: string
          surface_type?: string | null
          target_score?: number | null
          title?: string
          updated_at?: string
          venue_name?: string | null
          waitlist_capacity?: number | null
          waitlist_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          map_link: string | null
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          map_link?: string | null
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          map_link?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          current_uses: number
          discount_type: string
          discount_value: number
          event_id: string | null
          expires_at: string | null
          id: string
          max_uses: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          event_id?: string | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          event_id?: string | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      registrants: {
        Row: {
          checked_in: boolean
          checked_in_at: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          event_id: string
          full_name: string
          id: string
          payment_status: string | null
          phone: string | null
          promo_code_id: string | null
          stripe_payment_id: string | null
          team_name: string | null
          waitlisted: boolean
          waiver_accepted: boolean
        }
        Insert: {
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
          email: string
          emergency_contact?: string | null
          event_id: string
          full_name: string
          id?: string
          payment_status?: string | null
          phone?: string | null
          promo_code_id?: string | null
          stripe_payment_id?: string | null
          team_name?: string | null
          waitlisted?: boolean
          waiver_accepted?: boolean
        }
        Update: {
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          event_id?: string
          full_name?: string
          id?: string
          payment_status?: string | null
          phone?: string | null
          promo_code_id?: string | null
          stripe_payment_id?: string | null
          team_name?: string | null
          waitlisted?: boolean
          waiver_accepted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "registrants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrants_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          created_at: string
          email: string
          event_date: string | null
          full_name: string
          id: string
          party_size: number | null
          zip_code: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_date?: string | null
          full_name: string
          id?: string
          party_size?: number | null
          zip_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string | null
          full_name?: string
          id?: string
          party_size?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          amount: number | null
          captain_email: string
          captain_name: string
          captain_phone: string
          created_at: string
          event_date: string | null
          id: string
          media_release: boolean
          payment_status: string | null
          players: string[] | null
          rules_acknowledged: boolean
          skill_level: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          submission_id: string | null
          team_name: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          captain_email: string
          captain_name: string
          captain_phone: string
          created_at?: string
          event_date?: string | null
          id?: string
          media_release?: boolean
          payment_status?: string | null
          players?: string[] | null
          rules_acknowledged?: boolean
          skill_level: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          submission_id?: string | null
          team_name: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          captain_email?: string
          captain_name?: string
          captain_phone?: string
          created_at?: string
          event_date?: string | null
          id?: string
          media_release?: boolean
          payment_status?: string | null
          players?: string[] | null
          rules_acknowledged?: boolean
          skill_level?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          submission_id?: string | null
          team_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json | null
          processed: boolean | null
          stripe_event_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          stripe_event_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          stripe_event_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "event_staff"
        | "finance"
        | "content_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "event_staff",
        "finance",
        "content_manager",
      ],
    },
  },
} as const
