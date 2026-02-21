import Link from 'next/link'
import Image from 'next/image'

export default function CategoryCard({ category }) {
    return (
        <Link
            href={`/shop?category=${category.slug}`}
            className="group relative flex-none w-40 md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg leading-tight">{category.name}</h3>
                <div className="w-8 h-1 bg-orange-500 rounded-full mt-2 group-hover:w-12 transition-all duration-300"></div>
            </div>
        </Link>
    )
}
