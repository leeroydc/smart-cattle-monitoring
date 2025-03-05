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
      cattle: {
        Row: {
          created_at: string | null
          health_status: string | null
          id: string
          location: string | null
          tag_number: string
          temperature: number | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          health_status?: string | null
          id?: string
          location?: string | null
          tag_number: string
          temperature?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          health_status?: string | null
          id?: string
          location?: string | null
          tag_number?: string
          temperature?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_students: {
        Row: {
          course_id: string | null
          id: string
          join_date: string | null
          profile_image: string | null
          student_email: string
          student_name: string
        }
        Insert: {
          course_id?: string | null
          id?: string
          join_date?: string | null
          profile_image?: string | null
          student_email: string
          student_name: string
        }
        Update: {
          course_id?: string | null
          id?: string
          join_date?: string | null
          profile_image?: string | null
          student_email?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          instructor_id: string | null
          level: string | null
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          instructor_id?: string | null
          level?: string | null
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          instructor_id?: string | null
          level?: string | null
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_distribution: {
        Row: {
          details: string | null
          feed_type: string
          id: string
          percentage: number | null
        }
        Insert: {
          details?: string | null
          feed_type: string
          id?: string
          percentage?: number | null
        }
        Update: {
          details?: string | null
          feed_type?: string
          id?: string
          percentage?: number | null
        }
        Relationships: []
      }
      feeding_schedule: {
        Row: {
          amount: number | null
          feed_type: string
          id: string
          notes: string | null
          time_of_day: string
        }
        Insert: {
          amount?: number | null
          feed_type: string
          id?: string
          notes?: string | null
          time_of_day: string
        }
        Update: {
          amount?: number | null
          feed_type?: string
          id?: string
          notes?: string | null
          time_of_day?: string
        }
        Relationships: []
      }
      gps_tracking: {
        Row: {
          battery_level: number | null
          cattle_id: string | null
          id: string
          last_updated: string | null
          lat: number | null
          lng: number | null
          signal_strength: number | null
        }
        Insert: {
          battery_level?: number | null
          cattle_id?: string | null
          id?: string
          last_updated?: string | null
          lat?: number | null
          lng?: number | null
          signal_strength?: number | null
        }
        Update: {
          battery_level?: number | null
          cattle_id?: string | null
          id?: string
          last_updated?: string | null
          lat?: number | null
          lng?: number | null
          signal_strength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gps_tracking_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "cattle"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          battery_level: number | null
          cattle_id: string | null
          created_at: string | null
          humidity: number | null
          id: string
          lat: number | null
          lng: number | null
          signal_strength: number | null
          temperature: number | null
        }
        Insert: {
          battery_level?: number | null
          cattle_id?: string | null
          created_at?: string | null
          humidity?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          signal_strength?: number | null
          temperature?: number | null
        }
        Update: {
          battery_level?: number | null
          cattle_id?: string | null
          created_at?: string | null
          humidity?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          signal_strength?: number | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "cattle"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grades: {
        Row: {
          assignment_name: string
          course_id: string | null
          feedback: string | null
          grade: number | null
          id: string
          submission_date: string | null
          user_id: string | null
        }
        Insert: {
          assignment_name: string
          course_id?: string | null
          feedback?: string | null
          grade?: number | null
          id?: string
          submission_date?: string | null
          user_id?: string | null
        }
        Update: {
          assignment_name?: string
          course_id?: string | null
          feedback?: string | null
          grade?: number | null
          id?: string
          submission_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
