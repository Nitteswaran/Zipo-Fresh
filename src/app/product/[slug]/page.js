import { products as allProducts } from '@/data/products'
import { categories } from '@/data/categories'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/utils/currency'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 60

export default async function ProductPage({ params }) {
    const slug = (await params)?.slug

    if (!slug) return notFound()

    const product = allProducts.find(p => p.slug === slug)

    if (!product) {
        return notFound()
    }

    // Enrich with category name
    const category = categories.find(c => c.id === product.category_id)
    const enrichedProduct = {
        ...product,
        categories: category ? { name: category.name, slug: category.slug } : null
    }

    const displayProduct = enrichedProduct

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                    <Image
                        src={displayProduct.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=327'}
                        alt={displayProduct.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                    <div className="text-sm text-orange-600 font-bold mb-2 uppercase tracking-wide">
                        {displayProduct.categories?.name || 'Groceries'}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{displayProduct.name}</h1>
                    <div className="text-2xl text-gray-900 font-bold mb-6">
                        {formatCurrency(displayProduct.price_cents)}
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8">
                        <p>{displayProduct.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {displayProduct.is_active && displayProduct.stock_qty > 0 ? (
                            <AddToCartButton product={displayProduct} fullWidth />
                        ) : (
                            <button disabled className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl font-bold cursor-not-allowed">
                                Out of Stock
                            </button>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t text-sm text-gray-500 space-y-2">
                        <p>Freshness Guaranteed</p>
                        <p>Delivery within 24 hours</p>
                        <p>Cash on Delivery Available</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
