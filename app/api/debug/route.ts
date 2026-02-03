import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return NextResponse.json({
    hasServiceKey: !!key,
    keyLength: key?.length || 0,
    keyStart: key ? key.substring(0, 5) + '...' : 'none',
    nodeEnv: process.env.NODE_ENV
  })
}
