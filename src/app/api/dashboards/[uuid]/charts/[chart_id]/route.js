import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"


export async function PUT(req, { params }) {
    const uuid = params.uuid
    const chart_id = params.chart_id
    const data = await req.json()
    let newConfig

    const supabase = createRouteHandlerClient({ cookies }, {
        options: {
            db: { schema: "supaboard" }
        }
    })

    if (data.duplicate) {
        const chart = data.dashboard.config.charts.find((chart) => parseInt(chart.id) == parseInt(chart_id))
        const newChart = { ...chart, id: new Date().getTime() }
        newConfig = { ...data.dashboard.config, charts: [...data.dashboard.config.charts, newChart] }
    } else {
        const charts = data.dashboard.config.charts.filter((chart) => parseInt(chart.id) != parseInt(chart_id))
        newConfig = { ...data.dashboard.config, charts }
    }

    const { data: dashboard, error } = await supabase
        .from("dashboards")
        .update({config: newConfig })
        .eq("uuid", uuid)
        .select()
        .single()
    
    if (error) {
        console.log(error)
    }

    return NextResponse.json(dashboard || [])
}
