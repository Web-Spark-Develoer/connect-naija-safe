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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          is_active: boolean | null
          last_message_at: string | null
          matched_at: string
          user_a_id: string
          user_b_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          matched_at?: string
          user_a_id: string
          user_b_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          matched_at?: string
          user_a_id?: string
          user_b_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_boosts: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          daily_super_likes_remaining: number | null
          daily_swipes_remaining: number | null
          date_of_birth: string
          display_name: string
          education: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          gender_preference: Database["public"]["Enums"]["gender_type"][] | null
          height_cm: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_active_at: string | null
          location_city: string | null
          location_lat: number | null
          location_lng: number | null
          looking_for: Database["public"]["Enums"]["looking_for_type"][] | null
          max_age_preference: number | null
          max_distance_km: number | null
          min_age_preference: number | null
          occupation: string | null
          profile_boost_active_until: string | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          swipes_reset_at: string | null
          updated_at: string
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          daily_super_likes_remaining?: number | null
          daily_swipes_remaining?: number | null
          date_of_birth: string
          display_name: string
          education?: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          gender_preference?:
            | Database["public"]["Enums"]["gender_type"][]
            | null
          height_cm?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          looking_for?: Database["public"]["Enums"]["looking_for_type"][] | null
          max_age_preference?: number | null
          max_distance_km?: number | null
          min_age_preference?: number | null
          occupation?: string | null
          profile_boost_active_until?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          swipes_reset_at?: string | null
          updated_at?: string
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          daily_super_likes_remaining?: number | null
          daily_swipes_remaining?: number | null
          date_of_birth?: string
          display_name?: string
          education?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          gender_preference?:
            | Database["public"]["Enums"]["gender_type"][]
            | null
          height_cm?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          looking_for?: Database["public"]["Enums"]["looking_for_type"][] | null
          max_age_preference?: number | null
          max_distance_km?: number | null
          min_age_preference?: number | null
          occupation?: string | null
          profile_boost_active_until?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          swipes_reset_at?: string | null
          updated_at?: string
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      swipes: {
        Row: {
          action: Database["public"]["Enums"]["swipe_action"]
          created_at: string
          id: string
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["swipe_action"]
          created_at?: string
          id?: string
          swiped_id: string
          swiper_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["swipe_action"]
          created_at?: string
          id?: string
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string
          id: string
          interest_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interest_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_photos: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          photo_url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          photo_url: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          photo_url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string
          id: string
          id_document_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          id_document_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          id_document_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      virtual_gifts: {
        Row: {
          created_at: string
          gift_type: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          gift_type: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          gift_type?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
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
      reset_daily_swipes: { Args: { _user_id: string }; Returns: undefined }
      use_swipe: {
        Args: { _is_super_like?: boolean; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      gender_type: "male" | "female" | "non_binary" | "other"
      looking_for_type: "relationship" | "casual" | "friendship" | "networking"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      subscription_tier: "free" | "gold" | "platinum"
      swipe_action: "like" | "pass" | "super_like"
      verification_status: "pending" | "verified" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      gender_type: ["male", "female", "non_binary", "other"],
      looking_for_type: ["relationship", "casual", "friendship", "networking"],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      subscription_tier: ["free", "gold", "platinum"],
      swipe_action: ["like", "pass", "super_like"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
