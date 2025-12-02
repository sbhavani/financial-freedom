'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
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
    category?: any
    onSuccess: () => void
}

export default function DeleteCategoryModal({
    open,
    onOpenChange,
    category,
    onSuccess,
}: DeleteCategoryModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!category) return

        setIsDeleting(true)
        try {
            await axios.delete(`/api/settings/categories/${category.id}`)
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to delete category', error)
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
                        Are you sure you want to delete the category "{category?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
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
