# 📋 SignalKYC — Executive Intelligence Brief

> *For judges, sponsors, and technical reviewers. Read time: ~3 minutes.*

---

## What We Built

**SignalKYC** is a graph-native, autonomous KYC fraud investigation agent for fintech onboarding — built end-to-end in Jac, the world's first agentic programming language.

Instead of scoring an identity, SignalKYC **investigates a case**. It ingests onboarding signals, builds a live property graph of linked entities, deploys a Jac walker to traverse that graph, detects fraud ring membership and suspicious entity reuse, reasons over the evidence using an LLM-backed stateful agent, and returns one of three explainable outcomes: **APPROVE**, **STEP-UP VERIFICATION**, or **MANUAL REVIEW** — with a full reasoning chain that compliance teams and fraud analysts can actually read and act on.

---

## The Problem This Solves

KYC fraud is a graph problem, not a threshold problem. Fraud rings, synthetic identities, and mule account networks only become visible when signals are connected across email, phone, device, IP, documents, and prior applications. Flat tabular risk scores miss what graph traversal catches.

Meanwhile, when a KYC case becomes ambiguous, fraud teams currently face three bad options: approve the risk, reject the legitimate user, or route everything into slow and expensive manual review. None of these scale. None of them are explainable.

**SignalKYC eliminates that gap.** It provides the *investigation layer* that turns fragmented signals into a readable case, without requiring an analyst to gather the evidence manually.

---

## Architecture in 60 Seconds

```
New Signup
    │
    ▼
ingest_signup.jac           → Creates/resolves graph nodes (User, Email, Phone, Device, IP)
    │                          Creates/strengthens used_by edges
    ▼
investigate.jac             → Master orchestration walker
    │
    ├─ fraud_agent.jac       → Stateful agent: traverses graph, fires rules, runs by llm() reasoning
    │                          Detects: suspicious entity reuse, fraud cluster membership, signal contradictions
    ├─ decision.jac          → Calculates risk score, confidence, final decision (APPROVE/STEP_UP/MANUAL_REVIEW)
    └─ memory.jac            → Persists outcome to graph for future propagation
    │
    ▼
Frontend Investigation UI
    ├─ GraphView.tsx          → React Flow: interactive identity graph with suspicious path highlighting
    ├─ AgentReasoningPanel    → Animated step-by-step walker reasoning display
    ├─ RiskSummaryCard        → Risk score, confidence, category
    └─ DecisionOutputPanel    → Full explainable decision output
```

**Stack**: Jac (backend graph engine + walkers + agent) · Next.js 15 · TypeScript · React Flow · Framer Motion · Zustand · Tailwind CSS · shadcn/ui

---

## Technical Differentiators

| What We Did | Why It Matters |
|---|---|
| Built the investigation engine as Jac walkers | Graph traversal IS the product — not a feature bolted on |
| `FraudInvestigationAgent` with stateful memory | True agentic behavior: multi-step, evidence-accumulating, persistent |
| `by llm()` reasoning over graph evidence | LLM reasons over structured graph context, not free-form text |
| Three-outcome decision model | Eliminates the binary approve/reject bottleneck |
| Full explainability chain | Every decision auditable by compliance and fraud teams |
| `memory.jac` persists fraud signals | System gets smarter with every investigation — ongoing risk, not one-time check |
| Frontend fully demonstrable offline | `mockData.ts` + `agentSimulation.ts` provide complete investigation simulation |

---

## Jac Usage Depth

SignalKYC uses Jac at its architectural core — not superficially:

- **Graph-native data modeling**: All identity entities are Jac `node` definitions with typed properties
- **Typed edge relationships**: `used_by`, `linked_to`, `flagged_as`, `part_of_cluster` edges carry first-class metadata
- **Walkers as investigation agents**: `ingest_signup`, `build_graph`, `investigate`, `decision`, `memory` — each walker is a discrete, composable investigation step
- **Stateful agent orchestration**: `FraudInvestigationAgent` coordinates the full pipeline with `by llm()` reasoning
- **Graph traversal syntax**: `for neighbor in user_node -[used_by]-> node` — Jac's native traversal used throughout

This is the deepest possible integration of Jac's unique capabilities into a coherent product.

---

## Business Impact

| Metric | Impact |
|---|---|
| **Fraud prevention** | Catches cross-account fraud rings invisible to per-user scoring |
| **Analyst efficiency** | Autonomous investigation reduces manual review volume |
| **Compliance readiness** | Full decision audit trail for regulatory review |
| **Onboarding conversion** | Step-up routing preserves legitimate users who would otherwise be rejected |
| **Scalability** | Graph memory accumulates intelligence across every investigation |

**Target users**: Fintech compliance teams, fraud operations analysts, KYC platform builders, neobanks, payment processors

**Market context**: KYC automation and identity fraud prevention is a multi-billion-dollar market segment with strong regulatory tailwinds globally

---

## Judging Criteria Alignment

| JacHacks Criterion | SignalKYC Delivery |
|---|---|
| **Technical Execution** | Full-stack working system: Jac backend with 6 walkers + stateful agent + Next.js frontend with interactive graph UI |
| **Use of Jac and Jaseci** | Graph-native nodes/edges, 6 walkers, stateful agent, `by llm()` — not superficial usage |
| **Creativity and Innovation** | First KYC investigation system built as a Jac graph walker agent — novel architecture, novel application domain |
| **Presentation and Demo** | Interactive investigation UI, animated reasoning panel, live graph visualization — fully demonstrable in under 3 minutes |

---

## Track

**Fintech** · JacHacks Spring 2026 · Jaseci Labs · $4,000 prize pool

---

*Full technical documentation: [README.md](./README.md) · Judge navigation guide: [JUDGES.md](./JUDGES.md) · Demo script: [DEMO.md](./DEMO.md)*
