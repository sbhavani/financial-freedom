'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AddAccountModal from '@/components/accounts/AddAccountModal'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import { Account, AccountsData, CashAccount, CreditCard, Loan } from '@/types/account'
import AppLayout from '@/components/AppLayout'

export default function AccountsPage() {
  const { user } = useAuth({ middleware: 'auth' })
  const { data, error, mutate } = useSWR<AccountsData>('/accounts', () =>
    axios.get('/api/accounts').then((res) => res.data)
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()

  if (!user) return <AppLayout><div className="text-muted-foreground">Loading...</div></AppLayout>
  if (error) return <AppLayout><div className="text-destructive">Failed to load accounts</div></AppLayout>
  if (!data) return <AppLayout><div className="text-muted-foreground">Loading...</div></AppLayout>

  const { cashAccounts, creditCards, loans } = data

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const AccountTable = ({ accounts, type }: { accounts: Account[], type: string }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                No {type} found.
              </TableCell>
            </TableRow>
          ) : (
             accounts.map((account) => {
                // Determine display balance based on type
                let displayBalance = account.balance;
                if (type === 'Loans') {
                    const loan = account as Loan;
                    displayBalance = loan.remaining_balance ?? loan.balance;
                }

                return (
                  <TableRow
                    key={account.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                        let routeType = '';
                        if (type === 'Cash Accounts') routeType = 'cash-accounts';
                        else if (type === 'Credit Cards') routeType = 'credit-cards';
                        else if (type === 'Loans') routeType = 'loans';
                        router.push(`/${routeType}/${account.id}`)
                    }}
                  >
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.institution?.name || '-'}</TableCell>
                    <TableCell className="text-right">
                        {formatCurrency(displayBalance)}
                    </TableCell>
                  </TableRow>
                )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )

  const totalCash = cashAccounts?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0
  const totalCredit = creditCards?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0
  const totalLoans = loans?.reduce((acc, curr) => acc + (curr.remaining_balance || curr.balance || 0), 0) || 0

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your bank accounts, credit cards, and loans.
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Account
          </Button>
        </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCash)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Debt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCredit)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLoans)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Cash Accounts</h3>
                <AccountTable accounts={cashAccounts || []} type="Cash Accounts" />

                <h3 className="text-lg font-medium">Credit Cards</h3>
                <AccountTable accounts={creditCards || []} type="Credit Cards" />

                <h3 className="text-lg font-medium">Loans</h3>
                <AccountTable accounts={loans || []} type="Loans" />
            </div>
        </TabsContent>
        <TabsContent value="cash">
          <AccountTable accounts={cashAccounts || []} type="Cash Accounts" />
        </TabsContent>
        <TabsContent value="credit">
          <AccountTable accounts={creditCards || []} type="Credit Cards" />
        </TabsContent>
        <TabsContent value="loans">
          <AccountTable accounts={loans || []} type="Loans" />
        </TabsContent>
      </Tabs>

        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => mutate()}
          institutions={data.institutions || []}
        />
      </div>
    </AppLayout>
  )
}
