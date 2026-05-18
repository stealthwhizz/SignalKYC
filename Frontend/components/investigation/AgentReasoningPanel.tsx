// components/investigation/AgentReasoningPanel.tsx
'use client'

import { AgentStep } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  steps: AgentStep[]
  currentStepIndex: number
}

export default function AgentReasoningPanel({ steps, currentStepIndex }: Props) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border p-5 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Agent Reasoning Engine
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
        {steps.slice(0, currentStepIndex + 1).map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-2 border-primary pl-3 py-1"
          >
            <span className="text-muted-foreground">[{step.step}]</span> {step.message}
          </motion.div>
        ))}
        {currentStepIndex === steps.length - 1 && (
          <div className="text-green-400 pt-2">✓ Investigation complete.</div>
        )}
      </div>
    </div>
  )
}
