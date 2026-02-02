
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { id } = params

        // Allow updating any field passed in body
        const { data, error } = await supabase
            .from('vehicles')
            .update(body)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ vehicle: data })
    } catch (error) {
        console.error('Error updating vehicle:', error)
        return NextResponse.json(
            { error: 'Failed to update vehicle' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting vehicle:', error)
        return NextResponse.json(
            { error: 'Failed to delete vehicle' },
            { status: 500 }
        )
    }
}
