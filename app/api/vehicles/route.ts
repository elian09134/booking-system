
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
    try {
        const { data: vehicles, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('is_active', { ascending: false }) // Active first
            .order('name', { ascending: true })

        if (error) {
            throw error
        }

        return NextResponse.json({ vehicles })
    } catch (error) {
        console.error('Error fetching vehicles:', error)
        return NextResponse.json(
            { error: 'Failed to fetch vehicles' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, type, plate_number, brand, year, photo_url } = body

        const { data, error } = await supabase
            .from('vehicles')
            .insert([
                { name, type, plate_number, brand, year, photo_url, is_active: true }
            ])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ vehicle: data }, { status: 201 })
    } catch (error) {
        console.error('Error creating vehicle:', error)
        return NextResponse.json(
            { error: 'Failed to create vehicle' },
            { status: 500 }
        )
    }
}
