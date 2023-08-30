
async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/setup/state`)
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json()
}

export default async function Setup() {
    const data = await getData()

    return (
        <div>

        </div>
    )
}