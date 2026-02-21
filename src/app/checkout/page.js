'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import MapPicker from '@/components/MapPicker'
import { formatCurrency } from '@/utils/currency'
import { generateOrderCode } from '@/utils/order'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
    const router = useRouter()
    const supabase = createClient()
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        paymentMethod: 'cod' // or 'senangpay'
    })

    const [location, setLocation] = useState(null) // { lat, lng, address }

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('zipo-cart') || '[]')
        if (stored.length === 0) {
            router.replace('/cart')
        } else {
            setCart(stored)
            setLoading(false)
        }
    }, [router])

    const subtotal = cart.reduce((acc, item) => acc + (item.price_cents * item.qty), 0)
    const deliveryFee = 500 // Flat rate RM 5.00 for now
    const total = subtotal + deliveryFee

    const handleLocationSelect = (loc) => {
        setLocation(loc)
        setFormData(prev => ({ ...prev, address: loc.address || prev.address }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            if (!location) {
                alert('Please select a delivery location on the map.')
                setSubmitting(false)
                return
            }

            const orderCode = generateOrderCode()

            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_code: orderCode,
                    status: 'pending',
                    payment_method: formData.paymentMethod,
                    payment_status: 'unpaid',
                    subtotal_cents: subtotal,
                    delivery_fee_cents: deliveryFee,
                    total_cents: total,
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    customer_email: formData.email || null,
                    delivery_address: formData.address,
                    delivery_lat: location.lat,
                    delivery_lng: location.lng,
                    notes: formData.notes
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                name_snapshot: item.name,
                price_cents_snapshot: item.price_cents,
                qty: item.qty,
                line_total_cents: item.price_cents * item.qty
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // 3. Handle Payment
            if (formData.paymentMethod === 'senangpay') {
                // Call Netlify function to get payment URL/Form
                const response = await fetch('/.netlify/functions/create-senangpay-payment', {
                    method: 'POST',
                    body: JSON.stringify({ order_id: order.id, order_code: orderCode, amount_cents: total, phone: formData.phone, email: formData.email, name: formData.name })
                })
                const paymentData = await response.json()

                if (paymentData.url) {
                    // Clear cart
                    localStorage.removeItem('zipo-cart')
                    window.dispatchEvent(new Event('zipo-cart-updated'))

                    // Redirect to payment
                    window.location.href = paymentData.url
                    return
                } else {
                    // Handle manual form submit if returned html
                    // For simplicity, we expect a URL or we construct the form here if the function returns signature.
                    // Let's assume the function returns a URL to a payment page or the raw payment URL with params.
                    // Or we can just redirect to the return URL if mock.
                    alert('Payment integration pending. Redirecting to success for now.')
                    localStorage.removeItem('zipo-cart')
                    window.dispatchEvent(new Event('zipo-cart-updated'))
                    router.replace(`/order/${orderCode}`)
                }

            } else {
                // COD
                localStorage.removeItem('zipo-cart')
                window.dispatchEvent(new Event('zipo-cart-updated'))
                router.replace(`/order/${orderCode}`)
            }

        } catch (err) {
            console.error('Order submission error:', err)
            alert('Failed to place order. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border rounded-lg"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full p-3 border rounded-lg"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border rounded-lg"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Delivery Location</h2>
                        <p className="text-sm text-gray-500 mb-2">Pin your location on the map</p>
                        <MapPicker onLocationSelect={handleLocationSelect} />
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Details</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full p-3 border rounded-lg"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Unit number, floor, building name..."
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes</label>
                            <textarea
                                rows={2}
                                className="w-full p-3 border rounded-lg"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Gate code, leave at door..."
                            />
                        </div>
                    </section>
                </div>

                {/* Summary */}
                <div className="space-y-8">
                    <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Your Order</h2>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.qty}x {item.name}</span>
                                    <span className="font-medium">{formatCurrency(item.price_cents * item.qty)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span>{formatCurrency(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="font-medium">Cash on Delivery</span>
                            </label>

                            <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'senangpay' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="senangpay"
                                    checked={formData.paymentMethod === 'senangpay'}
                                    onChange={() => setFormData({ ...formData, paymentMethod: 'senangpay' })}
                                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="font-medium">Online Banking / Card (senangPay)</span>
                            </label>
                        </div>
                    </section>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                        {submitting ? 'Processing...' : `Place Order • ${formatCurrency(total)}`}
                    </button>
                </div>
            </div>
        </div>
    )
}
