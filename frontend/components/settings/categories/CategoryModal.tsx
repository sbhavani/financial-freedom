'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/lib/axios'
import { Category, Group } from '@/types/category'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    group_id: z.string().min(1, 'Group is required'),
    icon: z.string().optional(),
    color: z.string().min(1, 'Color is required'),
})

interface CategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
    onSuccess: () => void
    groups?: Group[]
}

export default function CategoryModal({
    open,
    onOpenChange,
    category,
    onSuccess,
    groups,
}: CategoryModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            group_id: '',
            icon: 'fa-star', // Default icon
            color: '#000000',
        },
    })

    useEffect(() => {
        if (open) {
            setServerError(null)
            if (category) {
                form.reset({
                    name: category.name,
                    group_id: category.group_id.toString(),
                    icon: category.icon,
                    color: category.color,
                })
            } else {
                form.reset({
                    name: '',
                    group_id: '',
                    icon: 'fa-star',
                    color: '#000000',
                })
            }
        }
    }, [open, category, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        setServerError(null)
        try {
            if (category) {
                await axios.put(`/api/settings/categories/${category.id}`, values)
            } else {
                await axios.post('/api/settings/categories', values)
            }
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors
                Object.keys(errors).forEach((key) => {
                    form.setError(key as any, {
                        type: 'manual',
                        message: errors[key][0],
                    })
                })
            } else {
                setServerError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Update the category details below.'
                            : 'Fill in the details to create a new category.'}
                    </DialogDescription>
                </DialogHeader>

                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {serverError}
                    </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="group_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a group" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {groups?.map((group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={group.id.toString()}
                                                >
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 h-10 p-1"
                                                {...field}
                                            />
                                            <Input
                                                {...field}
                                                placeholder="#000000"
                                                className="flex-1"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Icon picker could go here, simplified for now */}
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon Class (FontAwesome)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="fa-star" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
