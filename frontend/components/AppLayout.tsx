'use client'

import { useAuth } from '@/hooks/auth'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function AppLayout({
    header,
    children,
}: {
    header?: React.ReactNode
    children: React.ReactNode
}) {
    const { user } = useAuth({ middleware: 'auth' })
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Sync with sidebar's localStorage state
    useEffect(() => {
        const savedState = localStorage.getItem('sidebar-collapsed')
        if (savedState !== null) {
            setSidebarCollapsed(savedState === 'true')
        }

        // Listen for changes to localStorage (from Sidebar component)
        const handleStorageChange = () => {
            const savedState = localStorage.getItem('sidebar-collapsed')
            if (savedState !== null) {
                setSidebarCollapsed(savedState === 'true')
            }
        }

        window.addEventListener('storage', handleStorageChange)
        // Custom event for same-window updates
        window.addEventListener('sidebar-toggle', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('sidebar-toggle', handleStorageChange)
        }
    }, [])

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar user={user} />

            <main className={cn(
                "pt-14 lg:pt-0 transition-all duration-300",
                sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
            )}>
                <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {header && (
                        <div className="mb-8">
                            {header}
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    )
}
