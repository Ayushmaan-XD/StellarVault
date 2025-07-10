export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      containers: {
        Row: {
          id: string
          containerId: string
          zone: string
          width: number
          depth: number
          height: number
          maxWeight: number
          currentWeight: number
          itemCount: number
          utilization: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          containerId: string
          zone: string
          width: number
          depth: number
          height: number
          maxWeight: number
          currentWeight?: number
          itemCount?: number
          utilization?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          containerId?: string
          zone?: string
          width?: number
          depth?: number
          height?: number
          maxWeight?: number
          currentWeight?: number
          itemCount?: number
          utilization?: number
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          itemId: string
          name: string
          width: number
          depth: number
          height: number
          mass: number
          priority: number
          expiryDate: string | null
          usageLimit: number
          usesLeft: number
          preferredZone: string
          containerId: string
          position: Json | null
          isWaste: boolean
          wasteReason: string | null
          createdBy: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          itemId: string
          name: string
          width: number
          depth: number
          height: number
          mass: number
          priority: number
          expiryDate?: string | null
          usageLimit: number
          usesLeft: number
          preferredZone: string
          containerId: string
          position?: Json | null
          isWaste?: boolean
          wasteReason?: string | null
          createdBy: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          itemId?: string
          name?: string
          width?: number
          depth?: number
          height?: number
          mass?: number
          priority?: number
          expiryDate?: string | null
          usageLimit?: number
          usesLeft?: number
          preferredZone?: string
          containerId?: string
          position?: Json | null
          isWaste?: boolean
          wasteReason?: string | null
          createdBy?: string
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          userId: string
          userName: string
          action: string
          itemId: string
          itemName: string
          containerId: string
          details: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          userId: string
          userName: string
          action: string
          itemId: string
          itemName: string
          containerId: string
          details?: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          userId?: string
          userName?: string
          action?: string
          itemId?: string
          itemName?: string
          containerId?: string
          details?: string
          timestamp?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}
