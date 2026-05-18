// components/investigation/DecisionOutputPanel.tsx
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, AlertTriangle, Users } from 'lucide-react'

export default function DecisionOutputPanel({ decision, explanation }: { decision: string; explanation: string[] }) {
  const icon =
    decision === 'APPROVE' ? <CheckCircle className="text-green-400" /> : decision === 'STEP_UP' ? <AlertTriangle className="text-yellow-400" /> : <Users className="text-red-400" />
  const color = decision === 'APPROVE' ? 'bg-green-900/30 border-green-500' : decision === 'STEP_UP' ? 'bg-yellow-900/30 border-yellow-500' : 'bg-red-900/30 border-red-500'
  return (
    <div className={`rounded-xl border p-5 ${color}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span className="font-bold text-xl">{decision.replace('_', ' ')}</span>
      </div>
      <div className="space-y-2 text-sm">
        <p className="font-medium">Why?</p>
        <ul className="list-disc pl-5 space-y-1">
          {explanation.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
          {explanation.length === 0 && <li>All signals appear clean. Low risk profile.</li>}
        </ul>
      </div>
    </div>
  )
}
