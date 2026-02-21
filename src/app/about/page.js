import Image from 'next/image'
import { Truck, ShieldCheck, Leaf, Heart } from 'lucide-react'



export const metadata = {
    title: 'About Us - Zipo Fresh',
    description: 'Learn more about Zipo Fresh and our mission to deliver quality groceries.',
}

export default function AboutPage() {
    return (
        <div className="font-sans">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/zipo_assets/zipo_foreground.jpeg"
                    alt="Fresh groceries background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Image Frame */}
                        <div className="w-full md:w-1/2 animate-in slide-in-from-left-10 fade-in duration-1000">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 group">
                                <Image
                                    src="/zipo_assets/shopping.png"
                                    alt="cartoon shopping"
                                    fill
                                    className="object-cover transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="w-full md:w-1/2 space-y-6 animate-in slide-in-from-right-10 fade-in duration-1000 delay-100">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Our Story
                            </h2>
                            <div className="w-20 h-1.5 bg-orange-500 rounded-full"></div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Zipo Fresh started with a simple idea: good food shouldn't be hard to find. We noticed that families were struggling to find time to shop for fresh, quality ingredients amidst their busy schedules.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Founded in 2025, we set out to bridge the gap between local farmers and your kitchen table. By cutting out the middlemen, we ensure that our produce is fresher, tastier, and more affordable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-orange-50/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-600">We don't just deliver groceries; we deliver a promise of quality and care.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Value Cards */}
                        {[
                            { icon: Leaf, title: 'Farm Fresh', desc: 'Sourced directly from local partners to ensure peak freshness.' },
                            { icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery to keep your kitchen stocked.' },
                            { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'Not satisfied? We will replace it, no questions asked.' },
                            { icon: Heart, title: 'Community First', desc: 'We support local farmers and sustainable practices.' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-orange-100/50 flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Highlight Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

                        <div className="w-full md:w-1/2 px-8 py-12 md:p-16 flex flex-col justify-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Committed to Sustainability
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                We believe in a greener future. That's why we use eco-friendly packaging and optimize our delivery routes to reduce our carbon footprint. Every order you place contributes to a healthier planet.
                            </p>
                            <div className="flex items-center gap-4 text-orange-400 font-bold">
                                <Leaf className="w-6 h-6" />
                                <span>100% Eco-Friendly Packaging</span>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full">
                            <Image
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
                                alt="Eco friendly packaging"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent md:bg-gradient-to-r md:from-gray-900 md:to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
