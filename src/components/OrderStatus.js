'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

const STEPS = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'accepted', label: 'Preparing', icon: Package }, // 'accepted' by rider/staff usually means prep or rider assigned. Let's map loosely.
    { status: 'enroute', label: 'On the Way', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
]

export default function OrderStatus({ initialOrder }) {
    const [order, setOrder] = useState(initialOrder)
    const supabase = createClient()

    useEffect(() => {
        // Realtime subscription
        const channel = supabase
            .channel('realtime-order')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${order.id}`,
                },
                (payload) => {
                    setOrder(prev => ({ ...prev, ...payload.new }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [order.id, supabase])

    const currentStepIndex = STEPS.findIndex(s => s.status === order.status)
    // Handle some status mapping if needed, e.g. 'paid' -> 'pending' visually or 'confirmed'.
    // Simple check: if status is in steps, use it. If 'paid', maybe maps to 'confirmed'? 
    // Let's stick to strict matching or simple fallback.

    // Actually, 'paid' isn't in STEPS. 'pending' -> (admin confirms) -> 'confirmed'.
    // 'assigned' -> 'accepted' -> 'enroute'.
    // I will just use text correlation.

    const getStepStatus = (stepIndex) => {
        // Find index of current order status in STEPS
        // Pending(0) -> Confirmed(1) -> Accepted(2) -> Enroute(3) -> Delivered(4)

        // Mapping complex statuses to linear steps:
        // pending, paid -> 0
        // confirmed -> 1
        // assigned -> 1 (Rider assigned but not accepted yet)
        // accepted -> 2
        // enroute -> 3
        // delivered -> 4

        let activeIndex = 0;
        switch (order.status) {
            case 'pending': case 'paid': activeIndex = 0; break;
            case 'confirmed': case 'assigned': activeIndex = 1; break;
            case 'accepted': activeIndex = 2; break;
            case 'enroute': activeIndex = 3; break;
            case 'delivered': activeIndex = 4; break;
            case 'cancelled': activeIndex = -1; break;
            default: activeIndex = 0;
        }

        if (order.status === 'cancelled') return 'cancelled'
        if (stepIndex < activeIndex) return 'completed'
        if (stepIndex === activeIndex) return 'current'
        return 'upcoming'
    }

    const activeIndex = (() => {
        switch (order.status) {
            case 'pending': case 'paid': return 0;
            case 'confirmed': case 'assigned': return 1;
            case 'accepted': return 2;
            case 'enroute': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    })()

    if (order.status === 'cancelled') {
        return (
            <div className="p-8 text-center text-red-600">
                <XCircle className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Order Cancelled</h2>
                <p className="text-gray-600 mt-2">Please contact support for assistance.</p>
            </div>
        )
    }

    return (
        <div>
            {/* Progress Bar */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                    {/* Line */}
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-0"></div>
                    <div
                        className="absolute left-0 top-1/2 h-1 bg-orange-500 -z-0 transition-all duration-500"
                        style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {STEPS.map((step, index) => {
                        const status = getStepStatus(index)
                        const Icon = step.icon
                        return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center bg-white p-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${status === 'completed' || status === 'current' ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs mt-2 font-medium ${status === 'current' ? 'text-orange-700' : 'text-gray-500'} hidden md:block`}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="text-center mt-6 md:hidden">
                    <span className="font-bold text-orange-700">
                        {STEPS[activeIndex]?.label || order.status}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-900">Name:</span> {order.customer_name}</p>
                        <p><span className="font-medium text-gray-900">Phone:</span> {order.customer_phone}</p>
                        <p><span className="font-medium text-gray-900">Address:</span><br />{order.delivery_address}</p>
                        {order.notes && <p><span className="font-medium text-gray-900">Notes:</span> {order.notes}</p>}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between">
                                <span>{item.qty}x {item.name_snapshot}</span>
                                <span>{formatCurrency(item.price_cents_snapshot * item.qty)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-bold text-gray-900 text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(order.total_cents)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 capitalize">Payment: {order.payment_method} ({order.payment_status})</p>
                        </div>
                    </div>
                </div>
            </div>

            {order.status === 'enroute' && (
                <div className="p-6 bg-orange-50 text-center">
                    <p className="text-orange-800 font-medium">Your rider is on the way!</p>
                </div>
            )}
        </div>
    )
}
