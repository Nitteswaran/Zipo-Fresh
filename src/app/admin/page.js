import { createClient } from '@/utils/supabase/server'
import AdminDashboard from '@/components/AdminDashboard'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
    const supabase = createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/staff/sign-in')

    // Check role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || (profile.role !== 'admin' && profile.role !== 'clerk')) redirect('/staff/sign-in')

    // Fetch data
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    const { data: riders } = await supabase.from('profiles').select('*').eq('role', 'rider')

    return <AdminDashboard initialOrders={orders || []} riders={riders || []} />
}
