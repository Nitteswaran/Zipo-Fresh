import { categories } from '@/data/categories'
import { products as allProducts } from '@/data/products'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import PromotionCard from '@/components/PromotionCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60

export default async function Home() {
  // Use local data
  const products = allProducts.filter(p => p.is_active).reverse().slice(0, 8)

  const promotions = [
    {
      id: 'promo-1',
      tag: 'Festive Offer',
      title: 'CNY Promo 🧧',
      description: 'Get up to 28% off on fresh oranges and select festive groceries.',
      color: 'red',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'promo-2',
      tag: 'Upcoming',
      title: 'Hari Raya Prep 🌙',
      description: 'Early bird deals on premium dates, spices, and cooking essentials.',
      color: 'green',
      image: 'https://images.unsplash.com/photo-1598115609386-ca4ec63e8080?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'promo-3',
      tag: 'Weekly Deal',
      title: 'Healthy Weekend',
      description: 'Specially curated boxes of organic greens at amazing prices.',
      color: 'orange',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400'
    }
  ]

  return (
    <div className="pb-20 space-y-16">
      <Hero />

      {/* Promotions Section */}
      <section className="container mx-auto px-4 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sweet Deals for You</h2>
            <p className="text-gray-500 text-sm mt-1">Don't miss out on our limited time offers</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
          {promotions.map((promo) => (
            <div key={promo.id} className="snap-start">
              <PromotionCard promo={promo} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-gray-500 text-sm mt-1">Everything you need, organized for you</p>
          </div>
          <Link href="/shop" className="text-sm font-bold text-orange-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Fresh Arrivals Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fresh Arrivals</h2>
            <p className="text-gray-500 text-sm mt-1">Just picked and stocked today</p>
          </div>
          <Link href="/shop" className="text-sm font-bold text-green-600 flex items-center hover:underline group">
            Shop New Arrivals <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map(product => (
            <div key={product.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
