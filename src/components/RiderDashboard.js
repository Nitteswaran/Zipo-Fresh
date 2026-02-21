'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatCurrency } from '@/utils/currency'
import { ExternalLink, Navigation } from 'lucide-react'

export default function RiderDashboard({ initialOrders, riderId }) {
    const [orders, setOrders] = useState(initialOrders)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('rider-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders', filter: `assigned_rider_id=eq.${riderId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setOrders(prev => [payload.new, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [riderId, supabase])

    const updateStatus = async (id, status) => {
        await supabase.from('orders').update({ status }).eq('id', id)
    }

    // Active vs History
    const activeOrders = orders.filter(o => ['assigned', 'accepted', 'enroute'].includes(o.status))
    const historyOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status))

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Rider Dashboard</h1>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Active Tasks</h2>
                {activeOrders.length === 0 && <p className="text-gray-500">No active tasks.</p>}

                {activeOrders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase">{order.status}</span>
                        </div>

                        <h3 className="font-bold text-lg">{order.order_code}</h3>
                        <p className="text-gray-500 mb-4">{order.delivery_address}</p>

                        <div className="flex flex-col gap-3">
                            {order.status === 'assigned' && (
                                <button onClick={() => updateStatus(order.id, 'accepted')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Accept Order</button>
                            )}

                            {order.status === 'accepted' && (
                                <button onClick={() => updateStatus(order.id, 'enroute')} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold">Start Delivery</button>
                            )}

                            {order.status === 'enroute' && (
                                <button onClick={() => updateStatus(order.id, 'delivered')} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">Mark Delivered</button>
                            )}

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${order.delivery_lat},${order.delivery_lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200"
                            >
                                <Navigation className="w-5 h-5" /> Navigate
                            </a>
                        </div>

                        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                            <p>Customer: {order.customer_name} ({order.customer_phone})</p>
                            <p>Total: {formatCurrency(order.total_cents)} ({order.payment_method})</p>
                            <p>Status: {order.payment_status}</p>
                            {order.notes && <p className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded">Note: {order.notes}</p>}
                        </div>
                    </div>
                ))}

                <h2 className="text-xl font-bold text-gray-800 mt-8">Recent History</h2>
                {historyOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 opacity-60">
                        <div className="flex justify-between">
                            <span className="font-bold">{order.order_code}</span>
                            <span className="text-sm">{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
