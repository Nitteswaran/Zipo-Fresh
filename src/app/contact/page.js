import { Phone, Mail, MapPin, Instagram } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">Contact Us</h1>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <p className="text-gray-600 text-center mb-8">
                        Have questions about your order or our products? Reach out to us!
                    </p>

                    <div className="flex flex-col gap-6">

                        {/* WhatsApp / Phone */}
                        <a
                            href="https://wa.me/60122065295"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">WhatsApp / Call</h3>
                                <p className="text-gray-600">+60 12-206 5295</p>
                            </div>
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/zipo.fresh?igsh=dDF2ZWhzanU1NTRv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                                <Instagram className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Instagram</h3>
                                <p className="text-gray-600">@zipo.fresh</p>
                            </div>
                        </a>

                        {/* Email */}
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Email</h3>
                                <p className="text-gray-600">matheshwaran@zipofresh.com</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
