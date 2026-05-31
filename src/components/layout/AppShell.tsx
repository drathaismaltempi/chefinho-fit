import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-24 pt-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
