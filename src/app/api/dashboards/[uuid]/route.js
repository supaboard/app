import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(req, { params }) {
    const supabase = createRouteHandlerClient({ cookies }, {
        options: {
            db: { schema: "supaboard" }
        }
    })

    const uuid = params.uuid

    const { data: dashboard, error } = await supabase
        .from("dashboards")
        .select()
        .eq("uuid", uuid)
        .single()

    if (error) {
        console.log(error)
    }

    return NextResponse.json(dashboard || [])
}


export async function PUT(req, { params }) {
	const supabase = createRouteHandlerClient({ cookies }, {
        options: {
            db: { schema: "supaboard" }
        }
    })

    const uuid = params.uuid
    const data = await req.json()

    const { data: dashboard, error } = await supabase
        .from("dashboards")
        .update({config: data.config })
        .eq("uuid", uuid)
        .select()
        .single()

    if (error) {
        console.log(error)
    }

    return NextResponse.json(dashboard || [])
}
