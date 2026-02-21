import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/utils/currency'
import QuantitySelector from './QuantitySelector'

export default function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-gray-100">
                <Image
                    src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=327'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300"
                />
                {!product.is_active && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Unavailable</span>
                    </div>
                )}
            </Link>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate" title={product.name}>{product.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-orange-700 font-bold">{formatCurrency(product.price_cents)}</span>
                    <div className="flex items-center">
                        <QuantitySelector product={product} />
                    </div>
                </div>
            </div>
        </div>
    )
}
