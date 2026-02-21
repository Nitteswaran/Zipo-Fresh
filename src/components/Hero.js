import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="relative bg-orange-600 rounded-3xl overflow-hidden shadow-lg mx-4 mt-6 md:mx-0 min-h-[300px] flex items-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>

            <div className="relative z-10 p-8 md:py-12 md:px-12 flex flex-col items-start text-white w-full md:w-2/3">
                <span className="bg-orange-500/30 text-orange-50 text-xs font-bold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                    Free Delivery on First Order
                </span>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    Fresh Groceries,<br />Delivered Fast.
                </h1>
                <p className="text-orange-50 mb-8 max-w-md text-lg">
                    From farm to table in minutes. Shop fresh produce, meat, dairy and more.
                </p>
                <Link
                    href="/shop"
                    className="bg-white text-orange-700 font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition-colors shadow-lg"
                >
                    Shop Now
                </Link>
            </div>

            {/* Cart Image - Middle Right */}
            <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 opacity-90">
                <Image
                    src="/zipo_assets/cart.png"
                    alt="Shopping Cart"
                    fill
                    className="object-contain rounded-full"
                />
            </div>
        </section>
    )
}
