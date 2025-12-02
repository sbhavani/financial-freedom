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

    if (!user || isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading categories</div>

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Categories
                    </h2>
                    <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        {groups?.map((group) => (
                            <div key={group.id} className="mb-8 last:mb-0">
                                <h3 className="font-bold text-lg mb-4">{group.name}</h3>
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
                                        {group.categories?.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">
                                                    {category.name}
                                                </TableCell>
                                                <TableCell>{category.icon}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className="w-6 h-6 rounded-full"
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
                                                                className="text-red-600 focus:text-red-600">
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
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
        </div>
    )
}
