'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatCurrency } from '@/utils/currency'
import { Filter, User } from 'lucide-react'

export default function AdminDashboard({ initialOrders, riders }) {
    const [orders, setOrders] = useState(initialOrders)
    const [filter, setFilter] = useState('all') // all, pending, active, completed
    const supabase = createClient()

    useEffect(() => {
        // Realtime orders
        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        // New order
                        setOrders(prev => [payload.new, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        // Update order
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const updateStatus = async (id, status) => {
        await supabase.from('orders').update({ status }).eq('id', id)
    }

    const assignRider = async (orderId, riderId) => {
        await supabase.from('orders').update({
            assigned_rider_id: riderId,
            status: 'assigned'
        }).eq('id', orderId)
    }

    const filteredOrders = orders.filter(o => {
        if (filter === 'all') return true
        if (filter === 'pending') return o.status === 'pending' || o.status === 'paid'
        if (filter === 'active') return ['confirmed', 'assigned', 'accepted', 'enroute'].includes(o.status)
        if (filter === 'completed') return ['delivered', 'cancelled'].includes(o.status)
        return true
    })

    // Sort by recent
    filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex bg-white rounded-lg border p-1">
                    {['all', 'pending', 'active', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1 rounded-md text-sm capitalize ${filter === f ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{order.order_code}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>{order.status}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                                <p className="text-sm mt-1">{order.customer_name} • {order.customer_phone}</p>
                                <p className="text-sm text-gray-600 mt-1">{order.delivery_address}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <p className="font-bold text-xl">{formatCurrency(order.total_cents)}</p>
                                <p className="text-xs text-gray-500 uppercase">{order.payment_method} ({order.payment_status})</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
                            {/* Rider Assignment */}
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <select
                                    className="border rounded px-2 py-1 text-sm outline-none focus:ring-1"
                                    value={order.assigned_rider_id || ''}
                                    onChange={(e) => assignRider(order.id, e.target.value)}
                                >
                                    <option value="">Select Rider</option>
                                    {riders.map(r => (
                                        <option key={r.id} value={r.id}>{r.full_name || r.email || 'Rider'}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <button onClick={() => updateStatus(order.id, 'confirmed')} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Confirm Order</button>
                                )}
                                {order.status === 'confirmed' && !order.assigned_rider_id && (
                                    <span className="text-sm text-orange-500 flex items-center">Assign a rider first</span>
                                )}
                                {/* Provide manual override buttons if needed */}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 text-gray-500">No orders found.</div>
                )}
            </div>
        </div>
    )
}
