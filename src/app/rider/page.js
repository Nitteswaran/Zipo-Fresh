import { createClient } from '@/utils/supabase/server'
import RiderDashboard from '@/components/RiderDashboard'
import { redirect } from 'next/navigation'

export default async function RiderPage() {
    const supabase = createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/staff/sign-in')

    // Check role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'rider') redirect('/staff/sign-in')

    // Fetch assigned orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('assigned_rider_id', user.id)
        .order('created_at', { ascending: false })

    return <RiderDashboard initialOrders={orders || []} riderId={user.id} />
}
