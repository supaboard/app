import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"


export async function GET(req) {
    return NextResponse.json({ null: [] })
}
