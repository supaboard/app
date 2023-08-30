import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"


export async function GET(req, { params }) {
    const hash = params.hash

    const supabase = createRouteHandlerClient({ cookies }, {
        options: {
            db: { schema: "supaboard" }
        }
    })

    const { data: dashboard, error } = await supabase
        .from("dashboards")
        .select()
		.eq("public_hash", hash)
		.eq("is_public", true)
        .single()

	if (error || !dashboard) {
		return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(dashboard)
}
