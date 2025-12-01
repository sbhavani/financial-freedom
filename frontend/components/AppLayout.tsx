'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/components/Navigation'

export default function AppLayout({
    header,
    children,
}: {
    header: React.ReactNode
    children: React.ReactNode
}) {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
            </header>

            <main>{children}</main>
        </div>
    )
}
