import { HomeFeedView } from '@/components/home/home-feed-view'
import { HomeLayout } from '@/components/home/home-layout'

export default function HomePage() {
  return (
    <HomeLayout>
      <HomeFeedView />
    </HomeLayout>
  )
}
