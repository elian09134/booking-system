import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // Get all bookings
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('status')

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const stats = {
            total: bookings?.length || 0,
            pending: bookings?.filter(b => b.status === 'pending').length || 0,
            approved: bookings?.filter(b => b.status === 'approved').length || 0,
            rejected: bookings?.filter(b => b.status === 'rejected').length || 0,
        }

        return NextResponse.json({ stats })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
