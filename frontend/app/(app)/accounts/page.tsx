'use client'

import AppLayout from '@/components/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Accounts() {
    const [accounts, setAccounts] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('/api/accounts')
            .then(res => {
                setAccounts(res.data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            })
    }, [])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Accounts
                </h2>
            }>
            <Head>
                <title>Accounts - Financial Freedom</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {loading ? (
                                <div>Loading accounts...</div>
                            ) : (
                                <div>
                                    {/* Display accounts here. For now, just dumping the data */}
                                    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                                        {JSON.stringify(accounts, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
