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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      agency_members: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_members_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_roles: {
        Row: {
          assignee: string | null
          client_id: string
          created_at: string
          id: string
          priority: number
          requires_legal: boolean
          requires_messaging: boolean
          requires_visuals: boolean
          role_name: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          client_id: string
          created_at?: string
          id?: string
          priority?: number
          requires_legal?: boolean
          requires_messaging?: boolean
          requires_visuals?: boolean
          role_name: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          client_id?: string
          created_at?: string
          id?: string
          priority?: number
          requires_legal?: boolean
          requires_messaging?: boolean
          requires_visuals?: boolean
          role_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_roles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          audit_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          recommendation: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          status: string
          title: string
        }
        Insert: {
          audit_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recommendation?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: string
          title: string
        }
        Update: {
          audit_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recommendation?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_schedules: {
        Row: {
          audit_type: string
          client_id: string
          created_at: string
          day_of_month: number | null
          day_of_week: string | null
          frequency: string
          id: string
          is_active: boolean
          last_run: string | null
          next_run: string | null
          time_of_day: string
          updated_at: string
        }
        Insert: {
          audit_type: string
          client_id: string
          created_at?: string
          day_of_month?: number | null
          day_of_week?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run?: string | null
          next_run?: string | null
          time_of_day?: string
          updated_at?: string
        }
        Update: {
          audit_type?: string
          client_id?: string
          created_at?: string
          day_of_month?: number | null
          day_of_week?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run?: string | null
          next_run?: string | null
          time_of_day?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_schedules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          input_context: Json | null
          score: number | null
          status: Database["public"]["Enums"]["audit_status"]
          summary: string | null
          title: string | null
          type: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          input_context?: Json | null
          score?: number | null
          status?: Database["public"]["Enums"]["audit_status"]
          summary?: string | null
          title?: string | null
          type: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          input_context?: Json | null
          score?: number | null
          status?: Database["public"]["Enums"]["audit_status"]
          summary?: string | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      baselines: {
        Row: {
          audits_count: number
          category_scores: Json
          client_id: string
          created_at: string
          created_by: string | null
          findings_count: number
          id: string
          issues_count: number
          label: string
          notes: string | null
          overall_score: number
        }
        Insert: {
          audits_count?: number
          category_scores?: Json
          client_id: string
          created_at?: string
          created_by?: string | null
          findings_count?: number
          id?: string
          issues_count?: number
          label?: string
          notes?: string | null
          overall_score?: number
        }
        Update: {
          audits_count?: number
          category_scores?: Json
          client_id?: string
          created_at?: string
          created_by?: string | null
          findings_count?: number
          id?: string
          issues_count?: number
          label?: string
          notes?: string | null
          overall_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "baselines_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      boilerplate_items: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          audiences: Json
          client_id: string
          content: string | null
          created_at: string
          id: string
          name: string
          regions: Json
          type: string | null
          updated_at: string
          usage_guidelines: string | null
          version: string | null
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          audiences?: Json
          client_id: string
          content?: string | null
          created_at?: string
          id?: string
          name: string
          regions?: Json
          type?: string | null
          updated_at?: string
          usage_guidelines?: string | null
          version?: string | null
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          audiences?: Json
          client_id?: string
          content?: string | null
          created_at?: string
          id?: string
          name?: string
          regions?: Json
          type?: string | null
          updated_at?: string
          usage_guidelines?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boilerplate_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_strategy: {
        Row: {
          client_id: string
          created_at: string
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_strategy_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          agency_id: string
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      color_tokens: {
        Row: {
          accessibility: Json
          category: string
          client_id: string
          cmyk: string | null
          created_at: string
          description: string | null
          hex: string
          id: string
          name: string
          rgb: string | null
          updated_at: string
          usage: Json
        }
        Insert: {
          accessibility?: Json
          category?: string
          client_id: string
          cmyk?: string | null
          created_at?: string
          description?: string | null
          hex: string
          id?: string
          name: string
          rgb?: string | null
          updated_at?: string
          usage?: Json
        }
        Update: {
          accessibility?: Json
          category?: string
          client_id?: string
          cmyk?: string | null
          created_at?: string
          description?: string | null
          hex?: string
          id?: string
          name?: string
          rgb?: string | null
          updated_at?: string
          usage?: Json
        }
        Relationships: [
          {
            foreignKeyName: "color_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_rules: {
        Row: {
          category: string
          client_id: string
          consequences: string | null
          created_at: string
          created_by: string | null
          description: string | null
          enabled: boolean
          id: string
          severity: Database["public"]["Enums"]["severity_level"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          client_id: string
          consequences?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_id?: string
          consequences?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "governance_rules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          assignee: string | null
          audit_id: string | null
          category: string | null
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          severity: Database["public"]["Enums"]["severity_level"]
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          audit_id?: string | null
          category?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          audit_id?: string | null
          category?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_items: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          client_id: string
          content: string | null
          created_at: string
          expiry_date: string | null
          id: string
          mandatory: boolean
          name: string
          placement: Json
          products: Json
          regions: Json
          risk_level: Database["public"]["Enums"]["severity_level"]
          type: string | null
          updated_at: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          client_id: string
          content?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          mandatory?: boolean
          name: string
          placement?: Json
          products?: Json
          regions?: Json
          risk_level?: Database["public"]["Enums"]["severity_level"]
          type?: string | null
          updated_at?: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          client_id?: string
          content?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          mandatory?: boolean
          name?: string
          placement?: Json
          products?: Json
          regions?: Json
          risk_level?: Database["public"]["Enums"]["severity_level"]
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messaging_pillars: {
        Row: {
          asset_types: Json
          client_id: string
          created_at: string
          current_coverage: number
          definition: string | null
          description: string | null
          examples: Json
          icon: string | null
          id: string
          keywords: Json
          name: string
          priority: string
          required_coverage: number
          updated_at: string
        }
        Insert: {
          asset_types?: Json
          client_id: string
          created_at?: string
          current_coverage?: number
          definition?: string | null
          description?: string | null
          examples?: Json
          icon?: string | null
          id?: string
          keywords?: Json
          name: string
          priority?: string
          required_coverage?: number
          updated_at?: string
        }
        Update: {
          asset_types?: Json
          client_id?: string
          created_at?: string
          current_coverage?: number
          definition?: string | null
          description?: string | null
          examples?: Json
          icon?: string | null
          id?: string
          keywords?: Json
          name?: string
          priority?: string
          required_coverage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messaging_pillars_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          agency_id: string
          category: string | null
          client_id: string | null
          created_at: string
          id: string
          message: string | null
          read: boolean
          severity: Database["public"]["Enums"]["severity_level"]
          title: string
        }
        Insert: {
          agency_id: string
          category?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          severity?: Database["public"]["Enums"]["severity_level"]
          title: string
        }
        Update: {
          agency_id?: string
          category?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          severity?: Database["public"]["Enums"]["severity_level"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_agency_access: { Args: { _agency_id: string }; Returns: boolean }
      has_agency_role: {
        Args: {
          _agency_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      has_client_access: { Args: { _client_id: string }; Returns: boolean }
      shares_agency: { Args: { _other: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "editor" | "viewer"
      approval_status: "approved" | "pending" | "rejected"
      audit_status: "pending" | "running" | "completed" | "failed"
      client_status: "active" | "inactive" | "draft"
      severity_level: "low" | "medium" | "high" | "critical"
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
      app_role: ["owner", "admin", "editor", "viewer"],
      approval_status: ["approved", "pending", "rejected"],
      audit_status: ["pending", "running", "completed", "failed"],
      client_status: ["active", "inactive", "draft"],
      severity_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
