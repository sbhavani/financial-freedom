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

interface Account {
  id: number
  name: string
  balance?: number
  current_balance?: number
  remaining_balance?: number // Added remaining_balance
  type: string
  institution?: {
    name: string
  }
}

interface AccountsData {
  cashAccounts: Account[]
  creditCards: Account[]
  loans: Account[]
  institutions: any[]
}

export default function AccountsPage() {
  const { data, error, mutate } = useSWR('/accounts', () =>
    axios.get('/accounts').then((res) => res.data)
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()

  if (error) return <div>Failed to load accounts</div>
  if (!data) return <div>Loading...</div>

  const { cashAccounts, creditCards, loans } = data as AccountsData

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
             accounts.map((account) => (
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
                    {type === 'Loans'
                        ? formatCurrency(account.remaining_balance ?? account.current_balance ?? account.balance) // Check for loan specific balance field
                        : formatCurrency(account.balance)
                    }
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  const totalCash = cashAccounts?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0
  const totalCredit = creditCards?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0
  // For loans, use remaining_balance if available, else balance
  const totalLoans = loans?.reduce((acc, curr) => acc + (curr.remaining_balance || curr.balance || 0), 0) || 0

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">
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
  )
}
