'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { Category } from '@/types/category'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteCategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
    onSuccess: () => void
}

export default function DeleteCategoryModal({
    open,
    onOpenChange,
    category,
    onSuccess,
}: DeleteCategoryModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!category) return

        setIsDeleting(true)
        setError(null)
        try {
            await axios.delete(`/api/settings/categories/${category.id}`)
            onSuccess()
            onOpenChange(false)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete category')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the category &quot;{category?.name}&quot;? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
