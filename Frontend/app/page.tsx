// app/page.tsx
'use client'

import { Button } from '@/components/ui/Button'
import OverviewCards from '@/components/dashboard/OverviewCards'
import RecentInvestigations from '@/components/dashboard/RecentInvestigations'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const startNewInvestigation = () => {
    const newId = Math.random().toString(36).substring(2, 10)
    router.push(`/investigation/${newId}`)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SignalKYC Dashboard</h1>
          <p className="text-muted-foreground">Agentic fraud investigation platform</p>
        </div>
        <Button onClick={startNewInvestigation}>
          <Plus className="mr-2 h-4 w-4" /> New Investigation
        </Button>
      </div>
      <OverviewCards />
      <RecentInvestigations />
    </div>
  )
}
