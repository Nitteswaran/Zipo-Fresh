import Link from 'next/link'

export default function CategoryChips({ categories }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="flex-none px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors whitespace-nowrap shadow-sm"
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    )
}
