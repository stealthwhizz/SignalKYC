// components/investigation/GraphView.tsx
'use client'

import ReactFlow, { Node, Edge, Background, Controls, NodeTypes } from 'reactflow'
import 'reactflow/dist/style.css'
import { IdentityGraph } from '@/types'
import { useCallback, useMemo } from 'react'

interface GraphViewProps {
  graph: IdentityGraph
  highlightNodes: string[]
  highlightEdges: string[]
}

const nodeColor = (node: any, highlight: boolean) => {
  if (highlight) return '#f97316' // orange highlight
  if (node.data?.suspicious) return '#ef4444' // red
  if (node.type === 'user') return '#8b5cf6' // purple
  return '#3b82f6' // blue
}

const GraphView = ({ graph, highlightNodes, highlightEdges }: GraphViewProps) => {
  const nodes: Node[] = useMemo(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        type: 'default',
        position: { x: Math.random() * 500, y: Math.random() * 300 },
        data: { label: n.label, type: n.type, suspicious: n.suspicious },
        style: {
          background: nodeColor({ type: n.type, data: n }, highlightNodes.includes(n.id)),
          color: 'white',
          border: highlightNodes.includes(n.id) ? '2px solid #ffa500' : 'none',
          width: 120,
          padding: 8,
          borderRadius: 8,
          fontWeight: 500,
        },
      })),
    [graph, highlightNodes]
  )

  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: highlightEdges.includes(e.id),
        style: { stroke: highlightEdges.includes(e.id) ? '#ff7300' : e.suspicious ? '#ef4444' : '#555', strokeWidth: 2 },
      })),
    [graph, highlightEdges]
  )

  return (
    <div style={{ height: '550px', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView attributionPosition="bottom-right">
        <Background color="#1e293b" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default GraphView
