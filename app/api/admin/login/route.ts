import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, password } = body

        if (!username || !password) {
            return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
        }

        // Get admin by username (Using Admin Client to bypass RLS)
        const { data: admin, error } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('username', username)
            .single()

        if (error || !admin) {
            return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password_hash)

        if (!isMatch) {
            return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
        }

        // Generate simple session token (in production, use proper JWT)
        const sessionToken = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64')

        const response = NextResponse.json({
            message: 'Login berhasil',
            admin: {
                id: admin.id,
                username: admin.username,
                name: admin.name,
            }
        })

        // Set cookie
        response.cookies.set('admin_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        })

        return response
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
