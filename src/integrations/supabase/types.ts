export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          arrfy24: number | null
          cnpj: string
          createdat: number | null
          crescimentoreceita: number | null
          ebitda: number | null
          faturamentoanual: number | null
          id: string
          insightsqualitativos: string | null
          margem: number | null
          margemebitda: number | null
          nota: number | null
          qsa: Json | null
          razaosocial: string
          receitabrutafy24: number | null
          riscooperacional: string | null
          setor: string | null
          statusaprovacao: string | null
          subsetor: string | null
          valuationmultiplo: number | null
          weightedscore: number | null
        }
        Insert: {
          arrfy24?: number | null
          cnpj: string
          createdat?: number | null
          crescimentoreceita?: number | null
          ebitda?: number | null
          faturamentoanual?: number | null
          id?: string
          insightsqualitativos?: string | null
          margem?: number | null
          margemebitda?: number | null
          nota?: number | null
          qsa?: Json | null
          razaosocial: string
          receitabrutafy24?: number | null
          riscooperacional?: string | null
          setor?: string | null
          statusaprovacao?: string | null
          subsetor?: string | null
          valuationmultiplo?: number | null
          weightedscore?: number | null
        }
        Update: {
          arrfy24?: number | null
          cnpj?: string
          createdat?: number | null
          crescimentoreceita?: number | null
          ebitda?: number | null
          faturamentoanual?: number | null
          id?: string
          insightsqualitativos?: string | null
          margem?: number | null
          margemebitda?: number | null
          nota?: number | null
          qsa?: Json | null
          razaosocial?: string
          receitabrutafy24?: number | null
          riscooperacional?: string | null
          setor?: string | null
          statusaprovacao?: string | null
          subsetor?: string | null
          valuationmultiplo?: number | null
          weightedscore?: number | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          cnpj: string
          created_at: string | null
          ebitda: number
          faturamento_anual: number
          id: string
          margem: number
          razao_social: string
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          ebitda: number
          faturamento_anual: number
          id?: string
          margem: number
          razao_social: string
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          ebitda?: number
          faturamento_anual?: number
          id?: string
          margem?: number
          razao_social?: string
        }
        Relationships: []
      }
      "g6-capital": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      modulo_dd: {
        Row: {
          atualizado_em: number | null
          criado_em: number | null
          documento_nome: string | null
          documento_url: string | null
          empresa_id: string
          id: string
          item: string
          recomendacao: string | null
          risco: string
          status: string
          tipo_dd: string
        }
        Insert: {
          atualizado_em?: number | null
          criado_em?: number | null
          documento_nome?: string | null
          documento_url?: string | null
          empresa_id: string
          id?: string
          item: string
          recomendacao?: string | null
          risco: string
          status: string
          tipo_dd: string
        }
        Update: {
          atualizado_em?: number | null
          criado_em?: number | null
          documento_nome?: string | null
          documento_url?: string | null
          empresa_id?: string
          id?: string
          item?: string
          recomendacao?: string | null
          risco?: string
          status?: string
          tipo_dd?: string
        }
        Relationships: [
          {
            foreignKeyName: "modulo_dd_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      qsa: {
        Row: {
          created_at: string | null
          documento: string
          empresa_id: string
          id: string
          nome: string
          participacao: number
        }
        Insert: {
          created_at?: string | null
          documento: string
          empresa_id: string
          id?: string
          nome: string
          participacao: number
        }
        Update: {
          created_at?: string | null
          documento?: string
          empresa_id?: string
          id?: string
          nome?: string
          participacao?: number
        }
        Relationships: [
          {
            foreignKeyName: "qsa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_empresas_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_qsa_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
