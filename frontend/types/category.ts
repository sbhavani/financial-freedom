export interface Category {
    id: number
    name: string
    icon?: string
    color: string
    group_id: number
    created_at?: string
    updated_at?: string
}

export interface Group {
    id: number
    name: string
    categories: Category[]
    created_at?: string
    updated_at?: string
}
