// components/dashboard/OverviewCards.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, AlertTriangle, Flag, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

// Mock data – in a real app this would come from an API
const fetchStats = () => ({
  totalSignups: 1247,
  riskDistribution: { low: 892, medium: 267, high: 88 },
  flaggedUsers: 88,
})

export default function OverviewCards() {
  const [stats, setStats] = useState({ totalSignups: 0, riskDistribution: { low: 0, medium: 0, high: 0 }, flaggedUsers: 0 })

  useEffect(() => {
    // Simulate API call
    setStats(fetchStats())
  }, [])

  const cards = [
    {
      title: 'Total Signups',
      value: stats.totalSignups.toLocaleString(),
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Risk Distribution',
      value: `${stats.riskDistribution.high} High / ${stats.riskDistribution.medium} Med`,
      icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
      sub: `${stats.riskDistribution.low} low risk`,
    },
    {
      title: 'Flagged Users',
      value: stats.flaggedUsers.toString(),
      icon: <Flag className="h-5 w-5 text-destructive" />,
      trend: '+8%',
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.trend && (
                <p className={`text-xs ${card.trendUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 mt-1`}>
                  {card.trend} from last week
                </p>
              )}
              {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
