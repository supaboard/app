import "@/app/globals.css"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main className="p-4">
                    {children}
                </main>
            </body>
        </html>
    )
}
