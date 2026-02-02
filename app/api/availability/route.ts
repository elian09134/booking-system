import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Check availability for an item
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const item_name = searchParams.get('item_name')
        const start_datetime = searchParams.get('start_datetime')
        const end_datetime = searchParams.get('end_datetime')

        if (!item_name || !start_datetime || !end_datetime) {
            return NextResponse.json({
                error: 'item_name, start_datetime, dan end_datetime wajib diisi'
            }, { status: 400 })
        }

        // Check for approved bookings that overlap with the requested time
        const { data: conflicts, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('item_name', item_name)
            .eq('status', 'approved')
            .or(`and(start_datetime.lte.${end_datetime},end_datetime.gte.${start_datetime})`)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const isAvailable = !conflicts || conflicts.length === 0

        return NextResponse.json({
            available: isAvailable,
            conflicts: conflicts || [],
            message: isAvailable ? 'Item tersedia untuk waktu yang dipilih' : 'Item tidak tersedia pada waktu tersebut'
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
