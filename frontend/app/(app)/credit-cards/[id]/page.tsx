'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EditCreditCardModal from '@/components/accounts/EditCreditCardModal'

export default function CreditCardDetails({ params }: { params: { id: string } }) {
  const { data: account, error, mutate } = useSWR(`/credit-cards/${params.id}`, () =>
    axios.get(`/credit-cards/${params.id}`).then((res) => res.data)
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()

  if (error) return <div>Failed to load account details</div>
  if (!account) return <div>Loading...</div>

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{account.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Institution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg">{account.institution?.name || 'N/A'}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Brand</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg capitalize">{account.brand || 'N/A'}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg">{formatCurrency(account.credit_limit)}</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg">{account.interest_rate ? `${account.interest_rate}%` : '0%'}</div>
            </CardContent>
        </Card>
      </div>

      <div>
        <Button onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Account
        </Button>
      </div>

      <EditCreditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => mutate()}
        account={account}
      />
    </div>
  )
}
