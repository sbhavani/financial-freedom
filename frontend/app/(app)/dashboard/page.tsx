'use client'

import AppLayout from '@/components/AppLayout'
import Head from 'next/head'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }>
            <Head>
                <title>Dashboard - Financial Freedom</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                        </CardHeader>
                        <CardContent>
                            You&apos;re logged in!
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
