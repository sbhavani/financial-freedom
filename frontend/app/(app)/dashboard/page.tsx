'use client'

import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here&apos;s an overview of your finances.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$0.00</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all accounts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Debt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$0.00</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Credit cards & loans
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Net Worth
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$0.00</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Assets minus liabilities
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Start tracking your finances by adding your accounts.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Add your cash accounts (checking, savings)</li>
                            <li>Track your credit cards</li>
                            <li>Monitor your loans</li>
                            <li>Set up categories for transactions</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
