# 🎬 SignalKYC — Demo Script

**Format**: Live walkthrough + narration  
**Total runtime**: 3 minutes 30 seconds  
**Tone**: Confident, urgent, technically precise  

---

> **Presenter note**: Open the app at `http://localhost:3000` before starting. Have the dashboard visible. Keep energy high — this is a fraud investigation in real time.

---

## ⏱ 0:00–0:20 — THE HOOK

> *Stand at the dashboard. Let the UI speak first. Then speak.*

---

**[NARRATION]**

"Every second, somewhere in the world, a fintech company is approving a fraud ring member.

Not because their KYC system is broken. Because their KYC system is blind.

It's blind to the fact that this new applicant — clean profile, valid ID, real email — shares a device fingerprint with an account that was escalated for fraud six weeks ago. That link lives in a graph. But most KYC systems don't have one.

We built one.

This is **SignalKYC**."

> *[Gesture to the dashboard — let the UI be visible for 2–3 seconds before moving]*

---

## ⏱ 0:20–0:50 — THE PROBLEM (with UI context)

> *Stay on the dashboard. Point to the risk distribution cards.*

---

**[NARRATION]**

"The real problem in KYC is not verification — it's investigation.

When a case becomes ambiguous, fraud teams face an impossible choice: approve the risk, reject a legitimate user, or route everything into manual review that takes hours and costs money.

What they need is a system that can do what a human analyst does — connect fragmented signals, follow suspicious paths, gather evidence, and explain its reasoning.

They need an investigation layer. Not a score.

That's what we built."

---

## ⏱ 0:50–1:20 — PLATFORM INTRODUCTION

> *Click into any active investigation from the Recent Investigations table. Let the investigation view load fully.*

---

**[NARRATION]**

"The moment a new onboarding application hits SignalKYC, our Jac backend builds something traditional KYC systems don't have — a live identity graph.

Every entity is a node: the applicant, their email, their phone number, their device fingerprint, their IP address, their documents. Every relationship is a typed edge: `used_by`, `linked_to`, `part_of_cluster`.

What you're looking at right now is not a dashboard widget. This is a Jac property graph — and our investigation agent is about to walk it."

> *[Point to the graph visualization — zoom in slightly to show the node connections clearly]*

---

## ⏱ 1:20–2:00 — LIVE INVESTIGATION

> *Scroll down to show the AgentReasoningPanel. Let it animate through steps if it auto-plays. Or click to trigger the investigation.*

---

**[NARRATION]**

"Our core component is the `FraudInvestigationAgent` — a stateful Jac agent that traverses this graph using Jac's native walker syntax.

Watch what it does.

It starts at the applicant node. It follows the `used_by` edges to each linked entity. For each neighbor, it checks: has this entity been marked suspicious before? Is it a member of a known fraud cluster?

Right here — you can watch it find something."

> *[Point to the AgentReasoningPanel as a step appears — e.g., "Device fingerprint shared with previously escalated account"]*

"The device fingerprint of this new applicant — was used six weeks ago by a user that our system escalated for manual review. That previous case is still in our graph. The walker found it in one traversal hop."

> *[Let the next reasoning step appear]*

"And this email? The domain — `fraudmail.com` — triggers an immediate flag in `ingest_signup.jac`. That rule fires before the agent even starts walking.

Two signals. Neither of them visible in a flat tabular review. Both visible in a graph."

---

## ⏱ 2:00–2:30 — FRAUD RING DISCOVERY

> *Point to the secondary user node in the graph if visible, or navigate to a case with a linked account ("Linked Suspicious Account" node in red).*

---

**[NARRATION]**

"Here's where it gets serious.

This node — the red one, connected to the same device — is not our applicant. It's a *different* user. One who registered independently, three weeks ago, from a different IP address.

They share one thing: the same device fingerprint.

And that prior user is a member of fraud cluster C-7741 — a ring of synthetic identity accounts our system flagged over the past month.

Watch the decision."

> *[Scroll to or point at the DecisionOutputPanel]*

"Risk score: 87. Confidence: 92%. Decision: **MANUAL REVIEW**.

And here — this is the part that matters for compliance — is the full explanation. Every node that was flagged. Every rule that fired. Every edge that was traversed. Every reason, in plain English, that a fraud analyst can read and act on immediately.

No black box. No unexplained score. A complete audit trail."

---

## ⏱ 2:30–2:55 — TECHNICAL DEPTH

> *Briefly navigate or gesture toward the code / architecture — even verbally is fine.*

---

**[NARRATION]**

"Under the hood, this system is built entirely in **Jac** — the world's first agentic programming language, developed at the University of Michigan, backed by NVIDIA and the NSF.

Our backend is six walkers and a stateful agent.

`ingest_signup.jac` resolves entities and builds the graph. `investigate.jac` orchestrates the full pipeline. `fraud_agent.jac` runs `by llm()` reasoning over structured graph evidence — not free-form prompts, but typed graph context. `decision.jac` formats the outcome. `memory.jac` writes everything back to the graph so future investigations start smarter.

The frontend is Next.js 15, React Flow for graph rendering, Framer Motion for the reasoning animation, Zustand for state management.

The architecture is not a demo. It's a blueprint for production."

---

## ⏱ 2:55–3:20 — SCALABILITY VISION

---

**[NARRATION]**

"This is a hackathon MVP. But the design decisions we made here are exactly the decisions a production fraud intelligence team would make.

The graph accumulates intelligence with every investigation. Every fraud cluster expands. Every memory write improves future risk scoring. The system gets smarter without retraining a model — because the knowledge lives in the graph, not the weights.

In Phase 2, we add real-time WebSocket investigation feeds, webhook integrations with Persona and Onfido, and distributed Jac graph clustering for enterprise scale.

In Phase 3, we add continuous post-approval monitoring — because KYC risk doesn't stop at onboarding. New signals can emerge after an account is approved. SignalKYC is designed to reassess linked identities over time. That's not a feature. That's the future of compliance."

---

## ⏱ 3:20–3:30 — CLOSING IMPACT STATEMENT

> *Return to the dashboard. Let the full UI be visible. Speak slowly and clearly.*

---

**[NARRATION]**

"Every fraud ring has a weakness: it leaves graph fingerprints.

Shared devices. Reused emails. Linked accounts. Patterns that are invisible to a flat risk score — and obvious to a graph walker.

SignalKYC is the first KYC investigation system built natively as a Jac graph agent. It doesn't approximate agent behavior. It *is* agent behavior — walkers traversing a live identity graph, reasoning over evidence, and producing decisions that fraud teams can actually trust.

We didn't build a fraud score.

We built a fraud investigator.

**SignalKYC.**"

> *[End on the dashboard. Let the UI hold for 3–4 seconds before cutting.]*

---

## 📋 Demo Checklist

Before recording / presenting, verify:

- [ ] Application running at `http://localhost:3000`
- [ ] Dashboard shows at least 5 recent investigations with varied decisions
- [ ] At least one `MANUAL_REVIEW` case with a visible fraud ring (linked account node)
- [ ] AgentReasoningPanel animates correctly through investigation steps
- [ ] DecisionOutputPanel shows full explanation chain (not loading/skeleton)
- [ ] GraphView is interactive — can drag/zoom nodes
- [ ] `James Tran` or equivalent pre-seeded fraud ring case is accessible

---

## ⏱ Timing Reference

| Section | Time | Key UI Element |
|---|---|---|
| Hook | 0:00–0:20 | Dashboard overview |
| Problem | 0:20–0:50 | Overview cards + recent investigations |
| Platform intro | 0:50–1:20 | Investigation view + GraphView |
| Live investigation | 1:20–2:00 | AgentReasoningPanel in motion |
| Fraud ring discovery | 2:00–2:30 | Linked account node + DecisionOutputPanel |
| Technical depth | 2:30–2:55 | Verbal / gesture only |
| Scalability vision | 2:55–3:20 | Verbal |
| Closing | 3:20–3:30 | Dashboard full view |

---

*Judge navigation guide: [JUDGES.md](./JUDGES.md) · Technical docs: [README.md](./README.md) · Executive brief: [SUMMARY.md](./SUMMARY.md)*
