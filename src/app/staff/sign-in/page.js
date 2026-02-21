'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react' // just an icon placeholder

export default function StaffSignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        // Check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile) {
            if (profile.role === 'admin' || profile.role === 'clerk') {
                router.push('/admin')
            } else if (profile.role === 'rider') {
                router.push('/rider')
            } else {
                setError('Unauthorized role')
                await supabase.auth.signOut()
            }
        } else {
            setError('Profile not found')
            await supabase.auth.signOut()
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Staff Portal</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
