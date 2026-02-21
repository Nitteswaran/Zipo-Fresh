'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('search') || '')

    const handleSearch = (e) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        if (query) {
            params.set('search', query)
        } else {
            params.delete('search')
        }
        router.push(`/shop?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </form>
    )
}
