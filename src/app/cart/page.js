'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

export default function CartPage() {
    const [cart, setCart] = useState([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = JSON.parse(localStorage.getItem('zipo-cart') || '[]')
        setCart(stored)
    }, [])

    const updateQty = (id, delta) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, qty: Math.max(1, item.qty + delta) }
            }
            return item
        })
        setCart(newCart)
        localStorage.setItem('zipo-cart', JSON.stringify(newCart))
        window.dispatchEvent(new Event('zipo-cart-updated'))
    }

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id)
        setCart(newCart)
        localStorage.setItem('zipo-cart', JSON.stringify(newCart))
        window.dispatchEvent(new Event('zipo-cart-updated'))
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price_cents * item.qty), 0)

    if (!mounted) return <div className="container mx-auto px-4 py-8">Loading cart...</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <Link href="/shop" className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-green-600 font-bold">{formatCurrency(item.price_cents)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 rounded">
                                        <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="font-medium w-6 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-100 rounded">
                                        <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-bold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="text-gray-500 text-sm">RM 3/km</span>
                        </div>
                        <div className="flex justify-between py-4 text-xl font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <Link href="/checkout" className="block w-full bg-green-600 text-white text-center font-bold py-3 rounded-xl hover:bg-green-700 transition-colors mt-4">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
