"use client"

export function ChartTypes({ chartType, setChartType }) {
    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
                <div 
                    className={`
                        block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
                        ${chartType == "area" ? "!ring-highlight shadow-lg" : ""}
                    `}
                    onClick={() => {
                        setChartType("area")
                    }}
                >
                    <img src="/img/charts/area-chart.png" alt="Area Chart" className="rounded-t-lg" />
                    <div className="p-4">
                        <b>Area chart</b>
                        <p>
                            Area charts are best used to represent quantitative variations over time.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-span-3">
                <div 
                    className={`
                        block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
                        ${chartType == "bar" ? "!ring-highlight shadow-lg" : ""}
                    `}
                    onClick={() => {
                        setChartType("bar")
                    }}
                >
                    <img src="/img/charts/bar-chart.png" alt="Area Chart" className="rounded-t-lg" />
                    <div className="p-4">
                        <b>Bar chart</b>
                        <p>
                            Bar charts are best used to represent categorical data.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-span-3">
                <div 
                    className={`
                        block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
                        ${chartType == "counter" ? "!ring-highlight shadow-lg" : ""}
                    `}
                    onClick={() => {
                        setChartType("counter")
                    }}
                >
                    <img src="/img/charts/counter-chart.png" alt="Area Chart" className="rounded-t-lg" />
                    <div className="p-4">
                        <b>Counter chart</b>
                        <p>
                            Counter charts are best used to represent a single value.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-span-3">
                <div 
                    className={`
                        block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
                        ${chartType == "table" ? "!ring-highlight shadow-lg" : ""}
                    `}
                    onClick={() => {
                        setChartType("table")
                    }}
                >
                    <img src="/img/charts/table-chart.png" alt="Area Chart" className="rounded-t-lg" />
                    <div className="p-4">
                        <b>Table chart</b>
                        <p>
                            Table charts are ideal to show a list of data.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-span-3">
                <div 
                    className={`
                        block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
                        ${chartType == "pie" ? "!ring-highlight shadow-lg" : ""}
                    `}
                    onClick={() => {
                        setChartType("pie")
                    }}
                >
                    <img src="/img/charts/pie-chart.png" alt="Area Chart" className="rounded-t-lg" />
                    <div className="p-4">
                        <b>Pie chart</b>
                        <p>
                            Pie charts are great for comparing parts of a whole.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
