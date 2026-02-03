
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json()
        const { id } = await params

        // Allow updating any field passed in body
        const { data, error } = await supabaseAdmin
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const { error } = await supabaseAdmin
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
