'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user, router])

    return (
        <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
            <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
                {user ? (
                    <Link href="/dashboard" className="text-sm text-gray-700 underline">
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href="/login" className="text-sm text-gray-700 underline">
                            Log in
                        </Link>

                        <Link href="/register" className="ml-4 text-sm text-gray-700 underline">
                            Register
                        </Link>
                    </>
                )}
            </div>

            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                    <h1 className="text-6xl font-bold text-gray-800 dark:text-white">
                        Financial Freedom
                    </h1>
                </div>
            </div>
        </div>
    )
}
