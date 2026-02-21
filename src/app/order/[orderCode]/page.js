import { createClient } from '@/utils/supabase/server'
import OrderStatus from '@/components/OrderStatus'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function OrderPage({ params }) {
    const supabase = createClient()
    const orderCode = (await params)?.orderCode

    if (!orderCode) return notFound()

    // Use RPC for secure guest access
    const { data: order, error } = await supabase
        .rpc('get_order_by_code', { p_order_code: orderCode })

    if (error || !order) {
        console.error('Error fetching order:', error)
        return notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-green-600 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-white font-bold text-xl">Order #{order.order_code}</h1>
                    <span className="text-green-100 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <OrderStatus initialOrder={order} />

            </div>
        </div>
    )
}
