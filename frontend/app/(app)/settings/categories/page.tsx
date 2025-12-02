'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import CategoryModal from '@/components/settings/categories/CategoryModal'
import DeleteCategoryModal from '@/components/settings/categories/DeleteCategoryModal'
import { Category, Group } from '@/types/category'
import AppLayout from '@/components/AppLayout'

export default function CategoriesPage() {
    const { user } = useAuth({ middleware: 'auth' })

    const { data: groups, error, isLoading } = useSWR<Group[]>('/api/settings/categories', () =>
        axios.get('/api/settings/categories').then(res => res.data)
    )

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    const handleAdd = () => {
        setEditingCategory(null)
        setIsAddModalOpen(true)
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setIsAddModalOpen(true)
    }

    const handleDelete = (category: Category) => {
        setDeletingCategory(category)
    }

    const handleSuccess = () => {
        mutate('/api/settings/categories')
        setIsAddModalOpen(false)
        setEditingCategory(null)
        setDeletingCategory(null)
    }

    if (!user || isLoading) return <AppLayout><div className="text-muted-foreground">Loading...</div></AppLayout>
    if (error) return <AppLayout><div className="text-destructive">Error loading categories</div></AppLayout>

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your transaction categories and groups.
                        </p>
                    </div>
                    <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                <div className="space-y-6">
                    {groups?.map((group) => (
                        <Card key={group.id}>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Icon</TableHead>
                                                <TableHead>Color</TableHead>
                                                <TableHead className="w-[100px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {group.categories?.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                        No categories in this group yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                group.categories?.map((category) => (
                                                    <TableRow key={category.id}>
                                                        <TableCell className="font-medium">
                                                            {category.name}
                                                        </TableCell>
                                                        <TableCell>{category.icon}</TableCell>
                                                        <TableCell>
                                                            <div
                                                                className="w-6 h-6 rounded-full border"
                                                                style={{ backgroundColor: category.color }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">Open menu</span>
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDelete(category)}
                                                                        className="text-destructive focus:text-destructive">
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <CategoryModal
                    open={isAddModalOpen}
                    onOpenChange={setIsAddModalOpen}
                    category={editingCategory}
                    onSuccess={handleSuccess}
                    groups={groups}
                />

                <DeleteCategoryModal
                    open={!!deletingCategory}
                    onOpenChange={(open) => !open && setDeletingCategory(null)}
                    category={deletingCategory}
                    onSuccess={handleSuccess}
                />
            </div>
        </AppLayout>
    )
}
