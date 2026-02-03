import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Booking {
  id: string
  item_type: 'vehicle'
  item_name: string
  requester_name: string
  division: string
  purpose: string
  destination?: string
  start_datetime: string
  end_datetime: string
  duration_type: 'hours' | 'days'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  name: string
  type: string
  plate_number: string
  is_active: boolean
  created_at: string
}

export interface Admin {
  id: string
  username: string
  password_hash: string
  name: string
  created_at: string
}
