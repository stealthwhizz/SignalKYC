// components/investigation/RiskSummaryCard.tsx
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'

export default function RiskSummaryCard({ riskScore }: { riskScore: number }) {
  const category = riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low'
  const color = category === 'High' ? 'destructive' : category === 'Medium' ? 'secondary' : 'default'
  return (
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-card rounded-xl border p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Risk Summary</h3>
      <div className="text-5xl font-bold mb-2">{Math.round(riskScore)}</div>
      <div className="flex gap-2 items-center">
        <Badge variant={color as any}>{category} Risk</Badge>
        <span className="text-xs text-muted-foreground">Confidence: 94%</span>
      </div>
    </motion.div>
  )
}
