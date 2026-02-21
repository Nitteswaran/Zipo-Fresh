import Image from 'next/image'

export default function PromotionCard({ promo }) {
    const bgColors = {
        orange: 'bg-orange-50 border-orange-100',
        green: 'bg-green-50 border-green-100',
        red: 'bg-red-50 border-red-100',
        blue: 'bg-blue-50 border-blue-100'
    }

    return (
        <div className={`flex-none w-72 md:w-96 p-6 rounded-3xl border ${bgColors[promo.color] || bgColors.orange} flex items-center justify-between gap-4 group cursor-pointer hover:shadow-lg transition-all duration-300`}>
            <div className="flex-1 space-y-2">
                <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-900 border border-gray-100 shadow-sm uppercase tracking-wider">
                    {promo.tag}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{promo.description}</p>
                <div className="pt-2">
                    <button className="text-sm font-bold text-orange-600 group-hover:underline">
                        Explore Now →
                    </button>
                </div>
            </div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md flex-none bg-white">
                <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover transition-transform duration-500"
                />
            </div>
        </div>
    )
}
