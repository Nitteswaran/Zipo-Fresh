import { categories } from '@/data/categories'
import { products as allProducts } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

export const revalidate = 0

export default async function Shop({ searchParams }) {
    const params = await searchParams
    const categorySlug = params?.category
    const searchQuery = params?.search
    const sort = params?.sort || 'latest'

    // Filter products
    let filteredProducts = allProducts.filter(p => p.is_active)

    if (categorySlug) {
        const category = categories.find(c => c.slug === categorySlug)
        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category_id === category.id)
        }
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        )
    }

    // Sort
    if (sort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price_cents - b.price_cents)
    } else if (sort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price_cents - a.price_cents)
    } else {
        // Assume 'latest' means reverse order of the mock data or by a date if added
        // Simple reverse for mock data
        filteredProducts.reverse()
    }

    const products = filteredProducts

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
                <SearchBar />
            </div>

            {/* Categories for mobile/desktop quick access */}
            <div className="mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Link
                        href="/shop"
                        className={`flex-none px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${!categorySlug ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-500'}`}
                    >
                        All
                    </Link>
                    {categories?.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            className={`flex-none px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${categorySlug === cat.slug ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-500'}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p>No products found.</p>
                    {(categorySlug || searchQuery) && (
                        <Link href="/shop" className="text-orange-600 hover:underline mt-2 inline-block">
                            Clear filters
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}
