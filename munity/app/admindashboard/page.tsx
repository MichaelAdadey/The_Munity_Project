import { AdminDashboardView } from '@/components/admindashboard/admin-dashboard-view'
import { AdminLayout } from '@/components/admindashboard/admin-layout'

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboardView />
    </AdminLayout>
  )
}
