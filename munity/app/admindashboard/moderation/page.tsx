import { AdminLayout } from '@/components/admindashboard/admin-layout'
import { ModerationView } from '@/components/admindashboard/moderation-view'

export default function ModerationPage() {
  return (
    <AdminLayout
      title="Moderation Center"
      searchPlaceholder="Search reports, users, or keywords..."
    >
      <ModerationView />
    </AdminLayout>
  )
}
