import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Get bookings by requester name
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const name = searchParams.get('name')

        if (!name) {
            return NextResponse.json({ error: 'Nama pemohon wajib diisi' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .ilike('requester_name', `%${name}%`)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ bookings: data || [] })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
