'use client'

import { Plus, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function QuantitySelector({ product, onUpdate }) {
    const [qty, setQty] = useState(0)

    useEffect(() => {
        const updateQtyFromCart = () => {
            const cart = JSON.parse(localStorage.getItem('zipo-cart') || '[]')
            const item = cart.find(i => i.id === product.id)
            setQty(item ? item.qty : 0)
        }

        updateQtyFromCart()
        window.addEventListener('zipo-cart-updated', updateQtyFromCart)
        return () => window.removeEventListener('zipo-cart-updated', updateQtyFromCart)
    }, [product.id])

    const updateCart = (newQty) => {
        const cart = JSON.parse(localStorage.getItem('zipo-cart') || '[]')
        const existingIndex = cart.findIndex(i => i.id === product.id)

        if (newQty > 0) {
            if (existingIndex >= 0) {
                cart[existingIndex].qty = newQty
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price_cents: product.price_cents,
                    image_url: product.image_url,
                    qty: newQty
                })
            }
        } else {
            if (existingIndex >= 0) {
                cart.splice(existingIndex, 1)
            }
        }

        localStorage.setItem('zipo-cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('zipo-cart-updated'))
        if (onUpdate) onUpdate(newQty)
    }

    if (qty === 0) {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    updateCart(1)
                }}
                className="h-8 px-3 flex items-center justify-center bg-orange-600 text-white rounded-full text-sm font-bold hover:bg-orange-700 transition-colors"
            >
                Add
            </button>
        )
    }

    return (
        <div
            className="flex items-center bg-gray-100 rounded-full overflow-hidden h-8"
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <button
                onClick={() => updateCart(qty - 1)}
                className="w-8 h-full flex items-center justify-center text-orange-700 hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-gray-900">{qty}</span>
            <button
                onClick={() => updateCart(qty + 1)}
                className="w-8 h-full flex items-center justify-center text-orange-700 hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    )
}
