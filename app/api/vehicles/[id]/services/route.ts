
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Fetch services
        const { data: services, error } = await supabase
            .from('vehicle_services')
            .select('*')
            .eq('vehicle_id', id)
            .order('service_date', { ascending: false })

        if (error) throw error

        // Fetch vehicle details too for the header
        const { data: vehicle, error: vehicleError } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', id)
            .single()

        if (vehicleError) throw vehicleError

        return NextResponse.json({ services, vehicle })
    } catch (error) {
        console.error('Error fetching services:', error)
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { service_date, service_type, description, cost, odometer_reading } = body

        const { data, error } = await supabase
            .from('vehicle_services')
            .insert([
                {
                    vehicle_id: id,
                    service_date,
                    service_type,
                    description,
                    cost,
                    odometer_reading
                }
            ])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ service: data }, { status: 201 })
    } catch (error) {
        console.error('Error creating service log:', error)
        return NextResponse.json(
            { error: 'Failed to create service log' },
            { status: 500 }
        )
    }
}
