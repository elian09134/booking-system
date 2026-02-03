import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List bookings with optional filters
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const item_type = searchParams.get('item_type')
        const requester_name = searchParams.get('requester_name')
        const vehicle_id = searchParams.get('vehicle_id')

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
        if (vehicle_id) {
            query = query.eq('vehicle_id', vehicle_id)
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
            vehicle_id, // Add vehicle_id
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
        // Using vehicle_id if available, otherwise fallback to item_name
        let conflictQuery = supabase
            .from('bookings')
            .select('*')
            .eq('status', 'approved') // Only block confirmed bookings
            // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
            .lte('start_datetime', end_datetime)
            .gte('end_datetime', start_datetime)

        if (vehicle_id) {
            conflictQuery = conflictQuery.eq('vehicle_id', vehicle_id)
        } else {
            conflictQuery = conflictQuery.eq('item_name', item_name)
        }

        const { data: conflicts } = await conflictQuery

        if (conflicts && conflicts.length > 0) {
            return NextResponse.json({
                error: 'Kendaraan sudah dibooking (Approved) pada tanggal tersebut. Silakan pilih waktu atau kendaraan lain.',
                conflicts
            }, { status: 409 })
        }

        // Create booking
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                item_type,
                item_name,
                vehicle_id: vehicle_id || null, // Insert vehicle_id
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
