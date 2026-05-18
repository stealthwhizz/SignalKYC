# ⚖️ SignalKYC — Judge's Navigation Guide

> **Estimated review time: 5–8 minutes** · You will see real graph intelligence, real fraud detection, and a real explainability system in action.

---

## ⚡ Quick Start (Under 2 Minutes)

### Option A — Frontend Only (Recommended for Judges)
The frontend runs completely offline with a full investigation simulation. No backend required.

```bash
git clone https://github.com/stealthwhizz/SignalKYC.git
cd signalKYC/Frontend
npm install
npm run dev
```

**Open: [http://localhost:3000](http://localhost:3000)**

---

### Option B — Full Stack

```bash
# Terminal 1 — Jac backend
pip install jaclang
cd signalkyc/Backend
jac run data/seed.jac     # load historical fraud data
jac serve main.jac        # starts on port 8000

# Terminal 2 — Next.js frontend
cd signalkyc/Frontend
npm install && npm run dev
```

**Frontend: [http://localhost:3000](http://localhost:3000)**  
**API: [http://localhost:8000](http://localhost:8000)**

---

## 🗺️ Recommended Judge Flow (5 Minutes)

Follow this path to see the most impressive features in the right order:

### Step 1 — Dashboard (30 seconds)
> **URL: `http://localhost:3000`**

What to notice:
- Overview cards: total investigations, risk distribution (Approve / Step-Up / Manual Review split)
- Recent Investigations table: live feed of cases with risk scores and decision badges
- The UI is built for fraud analysts — not a toy demo interface

---

### Step 2 — Open a High-Risk Investigation (1 minute)
> **Click any investigation with risk score > 70 or badge `MANUAL REVIEW`**

What to notice:
- The **GraphView** renders the applicant's full identity graph as an interactive node-edge diagram
- Red/highlighted nodes indicate suspicious entities
- The graph shows connections between the applicant and their email, phone, device, and IP — with linked accounts visible as separate nodes

> 💡 **This is the core Jac insight**: every node and edge you see corresponds to a Jac `node` definition and a typed `edge` (`used_by`, `part_of_cluster`, etc.) traversed by a walker

---

### Step 3 — Watch the Agent Reason (1.5 minutes)
> **Look at the AgentReasoningPanel (right or bottom panel)**

What to notice:
- The agent displays its investigation steps **sequentially** — you can watch it traverse the graph
- Each step highlights which nodes are being examined
- Evidence accumulates: "Device fingerprint shared with previously escalated account" / "Email domain associated with fraud cluster C-7741"

> 💡 **This is real agentic behavior** — not a static result. The `FraudInvestigationAgent` in `fraud_agent.jac` runs `by llm()` reasoning over the structured graph evidence

---

### Step 4 — Read the Decision (1 minute)
> **Look at DecisionOutputPanel**

What to notice:
- Final outcome: `MANUAL REVIEW` (or `STEP_UP` / `APPROVE` depending on the case)
- **Full explanation chain**: every reason listed in plain English
  - Which entities were flagged and why
  - Which rules fired
  - Which fraud cluster was matched
  - What the confidence level is and why

> 💡 **This is the product differentiator**: not just a score, but a complete explainable case that a compliance analyst can act on immediately

---

### Step 5 — Find a Fraud Ring (1 minute)
> **Look for investigations with a "Linked Suspicious Account" node in the graph**

What to notice:
- A second `user` node connected via `shared device` edge to the current applicant
- That linked user is connected to a `fraud@darkweb.net` email node
- The `part_of_cluster` edge connects both to a `FraudCluster` node
- The current applicant's risk score has **inherited** risk from the cluster — even though they registered independently

> 💡 **This is fraud ring detection**: the applicant didn't do anything wrong on their own application — but they share a device with a fraud ring member. SignalKYC catches this. A flat risk score system cannot.

---

## 🌟 WOW Features — What to Look For

| Feature | Where | Why It's Impressive |
|---|---|---|
| **Interactive identity graph** | Investigation → GraphView | React Flow renders a live, draggable graph of linked entities — click nodes to inspect |
| **Animated agent reasoning** | Investigation → AgentReasoningPanel | Watch the walker "think" — step-by-step investigation with node highlighting |
| **Fraud ring discovery** | Any MANUAL_REVIEW case | Cross-account device/email sharing detected through graph traversal |
| **Explainable decisions** | Investigation → DecisionOutputPanel | Complete audit trail in plain English — compliance-ready |
| **Risk propagation** | Any clustered case | Applicant risk inherits from fraud cluster membership via `part_of_cluster` edges |
| **Three-outcome routing** | Dashboard badges | APPROVE / STEP_UP / MANUAL_REVIEW — not just approve or reject |
| **Long-term memory** | Backend: memory.jac | Every decision persisted to graph — future applicants sharing any signal carry risk forward |

---

## 🎭 Demo Accounts

The following cases are pre-seeded in the investigation feed and demonstrate distinct fraud patterns:

| Case | Risk Profile | Decision | Key Signal |
|---|---|---|---|
| **Marcus Webb** | Disposable email + VPN IP | `STEP_UP` | `tempmail.io` domain detected |
| **Lena Okafor** | Clean profile | `APPROVE` | No suspicious links found |
| **James Tran** | Device shared with fraud ring member | `MANUAL_REVIEW` | `part_of_cluster C-7741` propagated |
| **Priya Sharma** | Rapid resubmission + mismatched doc | `MANUAL_REVIEW` | 3 submissions in 4 minutes, doc name mismatch |
| **Dmitri Volkov** | Linked to previously escalated account | `MANUAL_REVIEW` | `linked_to` edge to escalated profile |

---

## 🔬 Technical Highlights for Judges

### Jac Language Usage

```
✅ Graph-native node definitions (User, Email, Phone, Device, IP, FraudCluster)
✅ Typed edge relationships with metadata (used_by, linked_to, flagged_as, part_of_cluster)
✅ 6 production walkers (ingest_signup, build_graph, investigate, decision, memory, api_handlers)
✅ Stateful FraudInvestigationAgent with by llm() reasoning
✅ Native Jac graph traversal syntax: user_node -[used_by]-> node
✅ Walker composition: investigate.jac spawns and coordinates sub-walkers
✅ get_or_create pattern for entity resolution across applications
```

### Architecture Quality

```
✅ Separation of concerns: models / walkers / agents / utils / data
✅ Modular walker design — each walker has a single well-defined responsibility
✅ Frontend TypeScript contract matches backend output schema exactly
✅ Zustand state management for investigation lifecycle
✅ Full offline simulation for reliable demo without backend dependency
✅ React Flow graph rendering with custom node types and suspicious path highlighting
✅ Framer Motion for smooth agent step animations
```

### Innovation Depth

```
✅ First KYC investigation system built as a graph walker agent
✅ Three-outcome decision model (not binary approve/reject)
✅ Risk propagation through cluster membership — not just per-user scoring
✅ Explainability as a first-class output — not an afterthought
✅ Long-term fraud memory — system intelligence compounds over time
✅ Continuous monitoring architecture — not a one-time check
```

---

## 📊 Judging Criteria — How SignalKYC Scores

| Criterion | What Judges Will See | Confidence |
|---|---|---|
| **Technical Execution** | Full-stack working system, clean architecture, stable demo, edge case handling | ⬛⬛⬛⬛⬛ |
| **Use of Jac and Jaseci** | 6 walkers + stateful agent + by llm() + graph-native data model — maximum depth | ⬛⬛⬛⬛⬛ |
| **Creativity and Innovation** | Novel problem domain for Jac, graph-walker investigation as product architecture | ⬛⬛⬛⬛⬜ |
| **Presentation and Demo** | Interactive graph UI, animated reasoning, clear 3-min demo path documented | ⬛⬛⬛⬛⬛ |

---

## ❓ Questions Judges Might Ask

**"Why Jac for this?"**
> Because the problem is graph-shaped. Walkers traversing linked identity entities *is* the investigation engine — not an implementation detail. Jac's graph primitives let us write the product logic in graph terms directly.

**"How is this different from a fraud score API?"**
> A score tells you risk. SignalKYC tells you *why* something is risky, *what links* make it risky, and *what to do* about it. The explainability chain is the differentiator — especially for compliance-regulated fintech teams.

**"What would you build next?"**
> Real-time WebSocket investigation feed, webhook integrations with KYC providers (Persona, Onfido), distributed graph cluster for production scale, and continuous post-approval monitoring — because KYC risk doesn't stop at onboarding.

**"Is this production-ready?"**
> The architecture is production-aligned. The Jac walker pipeline maps cleanly to a distributed graph deployment. The frontend is enterprise-UI quality. What's missing for production: real external data integrations and distributed Jac graph clustering — both on our roadmap.

---

*Full technical documentation: [README.md](./README.md) · Executive brief: [SUMMARY.md](./SUMMARY.md) · Demo script: [DEMO.md](./DEMO.md)*
