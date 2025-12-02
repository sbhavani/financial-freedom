'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from '@/lib/axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  original_balance: z.any().transform(v => Number(v)).optional(),
  remaining_balance: z.any().transform(v => Number(v)).optional(),
  payment_amount: z.any().transform(v => Number(v)).optional(),
  interest_rate: z.any().transform(v => Number(v)).optional(),
  opened_at: z.string().optional(),
})

interface EditLoanModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  account: any
}

export default function EditLoanModal({
  isOpen,
  onClose,
  onSuccess,
  account,
}: EditLoanModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account.name || '',
      description: account.description || '',
      original_balance: account.original_balance || 0,
      remaining_balance: account.remaining_balance || 0,
      payment_amount: account.payment_amount || 0,
      interest_rate: account.interest_rate || 0,
      opened_at: account.opened_at ? account.opened_at.split('T')[0] : '', // Format date for input
    },
  })

  const onSubmit = async (values: z.infer<typeof accountSchema>) => {
    setError(null)
    setLoading(true)
    try {
      await axios.put(`/loans/${account.id}`, values)
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      if (err.response?.data?.errors) {
         const validationErrors = Object.values(err.response.data.errors).flat().join(', ')
         setError(validationErrors)
      } else {
         setError(err.response?.data?.message || 'Something went wrong')
      }
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Loan</DialogTitle>
          <DialogDescription>
            Update loan details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Car Loan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="original_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Balance</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remaining_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remaining Balance</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Payment</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="interest_rate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

             <FormField
                  control={form.control}
                  name="opened_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Opened</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <DialogFooter>
               <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
