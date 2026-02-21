'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, Search } from 'lucide-react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Listen to cart changes
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('zipo-cart') || '[]')
            const count = cart.reduce((acc, item) => acc + item.qty, 0)
            setCartCount(count)
        }

        // Initial check
        updateCartCount()

        // Listen for custom event
        window.addEventListener('zipo-cart-updated', updateCartCount)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('zipo-cart-updated', updateCartCount)
        }
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4'}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight text-orange-600">
                    Zipo<span className="text-gray-900">Fresh</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/shop" className="text-sm font-bold text-gray-700 hover:text-orange-600 transition-colors">Shop</Link>
                    <Link href="/about" className="text-sm font-bold text-gray-700 hover:text-orange-600 transition-colors">About</Link>
                    <Link href="/contact" className="text-sm font-bold text-gray-700 hover:text-orange-600 transition-colors">Contact</Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Icon (Mobile) */}
                    <Link href="/shop" className="p-2 hover:bg-gray-100 rounded-full md:hidden">
                        <Search className="w-5 h-5 text-gray-600" />
                    </Link>

                    {/* Social Links (Icons) */}
                    <div className="hidden md:flex items-center gap-4 text-gray-500">
                        <a
                            href="https://wa.me/60122605295"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-600 hover:text-green-600 transition-colors"
                            aria-label="WhatsApp"
                        >
                            <FaWhatsapp className="w-6 h-6" />
                        </a>
                        <a
                            href="https://www.instagram.com/zipo.fresh?igsh=dDF2ZWhzanU1NTRv"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-600 hover:text-pink-600 transition-colors"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="w-6 h-6" />
                        </a>
                    </div>

                    {/* Cart */}
                    <Link href="/cart" className="relative p-2 hover:bg-orange-50 rounded-full group transition-colors">
                        <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-orange-600" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t p-4 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link
                        href="/shop"
                        className="text-gray-600 text-lg font-medium py-2 border-b border-gray-100 hover:text-orange-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Shop
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-600 text-lg font-medium py-2 border-b border-gray-100 hover:text-orange-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-600 text-lg font-medium py-2 border-b border-gray-100 hover:text-orange-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    <Link
                        href="/staff/sign-in"
                        className="text-sm text-gray-500 mt-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Staff Sign In
                    </Link>
                </div>
            )}
        </nav>
    )
}
