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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      artesanos: {
        Row: {
          contacto_publico: string
          coord_x: number
          coord_y: number
          created_at: string
          descripcion: string
          foto: string
          historia: string
          id: string
          nombre: string
          proceso: string
          taller: string
          tecnica: string
          tradicion: string
          ubicacion: string
          user_id: string | null
          verificado: boolean
        }
        Insert: {
          contacto_publico?: string
          coord_x?: number
          coord_y?: number
          created_at?: string
          descripcion?: string
          foto?: string
          historia?: string
          id: string
          nombre: string
          proceso?: string
          taller?: string
          tecnica?: string
          tradicion?: string
          ubicacion?: string
          user_id?: string | null
          verificado?: boolean
        }
        Update: {
          contacto_publico?: string
          coord_x?: number
          coord_y?: number
          created_at?: string
          descripcion?: string
          foto?: string
          historia?: string
          id?: string
          nombre?: string
          proceso?: string
          taller?: string
          tecnica?: string
          tradicion?: string
          ubicacion?: string
          user_id?: string | null
          verificado?: boolean
        }
        Relationships: []
      }
      conversaciones: {
        Row: {
          artesano_id: string
          comprador_id: string
          created_at: string
          id: string
          producto_id: string | null
          producto_nombre: string | null
          updated_at: string
        }
        Insert: {
          artesano_id: string
          comprador_id: string
          created_at?: string
          id?: string
          producto_id?: string | null
          producto_nombre?: string | null
          updated_at?: string
        }
        Update: {
          artesano_id?: string
          comprador_id?: string
          created_at?: string
          id?: string
          producto_id?: string | null
          producto_nombre?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversaciones_artesano_id_fkey"
            columns: ["artesano_id"]
            isOneToOne: false
            referencedRelation: "artesanos"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          created_at: string
          producto_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          producto_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          producto_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      mensajes: {
        Row: {
          autor_id: string
          conversacion_id: string
          created_at: string
          id: string
          texto: string
        }
        Insert: {
          autor_id?: string
          conversacion_id: string
          created_at?: string
          id?: string
          texto: string
        }
        Update: {
          autor_id?: string
          conversacion_id?: string
          created_at?: string
          id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "conversaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          created_at: string
          detalle: string
          enlace: string | null
          id: string
          leida: boolean
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detalle?: string
          enlace?: string | null
          id?: string
          leida?: boolean
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string
          detalle?: string
          enlace?: string | null
          id?: string
          leida?: boolean
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      pedido_historial: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["estado_pedido"]
          id: string
          pedido_id: string
        }
        Insert: {
          created_at?: string
          estado: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          pedido_id: string
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          pedido_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_historial_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_items: {
        Row: {
          cantidad: number
          id: string
          imagen: string
          nombre: string
          pedido_id: string
          precio: number
          producto_id: string | null
        }
        Insert: {
          cantidad: number
          id?: string
          imagen?: string
          nombre: string
          pedido_id: string
          precio: number
          producto_id?: string | null
        }
        Update: {
          cantidad?: number
          id?: string
          imagen?: string
          nombre?: string
          pedido_id?: string
          precio?: number
          producto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          artesano_id: string
          codigo: string
          comprador_id: string
          comprador_nombre: string
          created_at: string
          direccion: string
          estado: Database["public"]["Enums"]["estado_pedido"]
          id: string
          total: number
          updated_at: string
        }
        Insert: {
          artesano_id: string
          codigo?: string
          comprador_id: string
          comprador_nombre?: string
          created_at?: string
          direccion?: string
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          total?: number
          updated_at?: string
        }
        Update: {
          artesano_id?: string
          codigo?: string
          comprador_id?: string
          comprador_nombre?: string
          created_at?: string
          direccion?: string
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_artesano_id_fkey"
            columns: ["artesano_id"]
            isOneToOne: false
            referencedRelation: "artesanos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          agotado: boolean
          artesano_id: string
          categoria: string
          created_at: string
          descripcion: string
          destacado: boolean
          dimensiones: string
          disponible: number
          id: string
          imagenes: string[]
          materiales: string
          nombre: string
          precio: number
          tiempo_entrega: string
          videos: string[]
        }
        Insert: {
          agotado?: boolean
          artesano_id: string
          categoria?: string
          created_at?: string
          descripcion?: string
          destacado?: boolean
          dimensiones?: string
          disponible?: number
          id?: string
          imagenes?: string[]
          materiales?: string
          nombre: string
          precio: number
          tiempo_entrega?: string
          videos?: string[]
        }
        Update: {
          agotado?: boolean
          artesano_id?: string
          categoria?: string
          created_at?: string
          descripcion?: string
          destacado?: boolean
          dimensiones?: string
          disponible?: number
          id?: string
          imagenes?: string[]
          materiales?: string
          nombre?: string
          precio?: number
          tiempo_entrega?: string
          videos?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "productos_artesano_id_fkey"
            columns: ["artesano_id"]
            isOneToOne: false
            referencedRelation: "artesanos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nombre: string
          tipo: string
          ubicacion: string | null
        }
        Insert: {
          created_at?: string
          id: string
          nombre?: string
          tipo?: string
          ubicacion?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          tipo?: string
          ubicacion?: string | null
        }
        Relationships: []
      }
      publicaciones: {
        Row: {
          artesano_id: string
          created_at: string
          id: string
          media_url: string
          oculta: boolean
          texto: string
          tipo: string
        }
        Insert: {
          artesano_id: string
          created_at?: string
          id?: string
          media_url: string
          oculta?: boolean
          texto?: string
          tipo?: string
        }
        Update: {
          artesano_id?: string
          created_at?: string
          id?: string
          media_url?: string
          oculta?: boolean
          texto?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_artesano_id_fkey"
            columns: ["artesano_id"]
            isOneToOne: false
            referencedRelation: "artesanos"
            referencedColumns: ["id"]
          },
        ]
      }
      reportes: {
        Row: {
          created_at: string
          id: string
          motivo: string
          publicacion_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          motivo?: string
          publicacion_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          motivo?: string
          publicacion_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reportes_publicacion_id_fkey"
            columns: ["publicacion_id"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      resenas: {
        Row: {
          autor_id: string | null
          autor_nombre: string
          comentario: string
          created_at: string
          estrellas: number
          id: string
          producto_id: string
          verificada: boolean
        }
        Insert: {
          autor_id?: string | null
          autor_nombre?: string
          comentario?: string
          created_at?: string
          estrellas: number
          id?: string
          producto_id: string
          verificada?: boolean
        }
        Update: {
          autor_id?: string | null
          autor_nombre?: string
          comentario?: string
          created_at?: string
          estrellas?: number
          id?: string
          producto_id?: string
          verificada?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "resenas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_estado_pedido: {
        Args: {
          _estado: Database["public"]["Enums"]["estado_pedido"]
          _pedido_id: string
        }
        Returns: undefined
      }
      crear_pedido: {
        Args: { _direccion?: string; _items: Json }
        Returns: string[]
      }
      es_duenio_artesano: { Args: { _artesano_id: string }; Returns: boolean }
      es_participante: { Args: { _conv: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      puede_resenar: { Args: { _producto_id: string }; Returns: boolean }
      puede_ver_pedido: { Args: { _pedido_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "comprador" | "artesano" | "admin"
      estado_pedido:
        | "pendiente"
        | "confirmado"
        | "preparacion"
        | "enviado"
        | "entregado"
        | "cancelado"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["comprador", "artesano", "admin"],
      estado_pedido: [
        "pendiente",
        "confirmado",
        "preparacion",
        "enviado",
        "entregado",
        "cancelado",
      ],
    },
  },
} as const
