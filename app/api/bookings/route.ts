import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List bookings with optional filters
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const item_type = searchParams.get('item_type')
        const requester_name = searchParams.get('requester_name')

        let query = supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }
        if (item_type) {
            query = query.eq('item_type', item_type)
        }
        if (requester_name) {
            query = query.ilike('requester_name', `%${requester_name}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ bookings: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            item_type,
            item_name,
            requester_name,
            division,
            purpose,
            destination,
            start_datetime,
            end_datetime,
            duration_type,
        } = body

        // Validation
        if (!item_type || !item_name || !requester_name || !division || !purpose || !start_datetime || !end_datetime || !duration_type) {
            return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
        }

        // Check for conflicts (only for approved bookings)
        const { data: conflicts } = await supabase
            .from('bookings')
            .select('*')
            .eq('item_name', item_name)
            .eq('status', 'approved')
            .or(`and(start_datetime.lte.${end_datetime},end_datetime.gte.${start_datetime})`)

        if (conflicts && conflicts.length > 0) {
            return NextResponse.json({
                error: 'Item sudah dibooking pada waktu tersebut. Silakan pilih waktu lain.',
                conflicts
            }, { status: 409 })
        }

        // Create booking
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                item_type,
                item_name,
                requester_name,
                division,
                purpose,
                destination: destination || null,
                start_datetime,
                end_datetime,
                duration_type,
                status: 'pending',
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ booking: data, message: 'Booking berhasil dibuat' }, { status: 201 })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
