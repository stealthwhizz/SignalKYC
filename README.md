# SignalKYC

**Autonomous Onboarding Risk Investigation Agent**

## One-Line Pitch
SignalKYC is a Jac-native agent that links identity, device, network, and behavioral signals into an explainable graph for faster, smarter KYC decisions in fintech onboarding.

## Problem

Fintech onboarding teams face a critical tradeoff:
- **Strict KYC** prevents fraud but creates friction, leading to high manual-review rates and lost revenue
- **Loose KYC** accelerates onboarding but increases fraud exposure and compliance risk
- **Existing tools** produce fragmented signals or black-box risk scores, making it hard to understand why a case should be approved or escalated

Teams need a way to:
1. Connect signals across applicant identity, phone, email, device, IP, documents, and prior cases
2. Apply deterministic fraud logic they can audit and explain
3. Make transparent decisions: Approve, Step-up Verification, or Manual Review
4. Learn from prior cases to improve detection over time

## Why Existing Onboarding Tools Are Not Enough

Traditional KYC platforms:
- **Siloed signals**: Each check (ID verification, email validation, device fingerprinting) runs independently without connecting insights
- **Opaque scoring**: Risk scores come from black-box models; teams can't explain to regulators why a case was escalated
- **No graph reasoning**: They don't traverse relationships (e.g., "multiple applicants on one device linked to a flagged case")
- **Static rules**: Manual rule updates for new fraud patterns require engineering; no agent-based investigation
- **Poor UX for analysts**: Fraud teams waste time stitching signals together manually

**SignalKYC solves this** by making relationships explicit and investigation transparent.

## How SignalKYC Works

### 1. **Case Intake**
New applicant onboarding data arrives with signals: email, phone, device ID, IP address, document, submission timestamp.

### 2. **Graph Construction**
SignalKYC ingests the applicant and creates/links graph nodes:
- **Applicant** node (identity)
- **Email, Phone, Device, IPAddress, Document** nodes (identity attributes)
- **Edges** connect applicants to signals and link shared signals across applicants

### 3. **Signal Linking**
A walker merges related entities and identifies shared signals:
- Which applicants share the same device?
- Which have the same email or phone?
- Which IP addresses have suspicious submission patterns?

### 4. **Risk Evaluation**
Deterministic signal detection (non-LLM):
- **Device Reuse**: Flag if device used by multiple applicants
- **Shared Phone**: Flag if phone linked to prior flagged case
- **Suspicious Email**: Flag disposable domains or alias patterns
- **IP Burst**: Flag if IP has many submissions in short time
- **IP Geo-Mismatch**: Flag if IP country ≠ applicant country
- **Document Reuse**: Flag if document used by multiple applicants
- **Email Pattern**: Heuristic scoring for suspicious formats
- **Session Burst**: Flag rapid session activity
- **Signal Stacking**: Weak signals combine into meaningful risk
- **Historical Similarity**: Compare to prior escalated cases

### 5. **Investigation Walker**
Traverse suspicious relationships to find connected risks.

### 6. **Memory Lookup**
Find similar historical cases.

### 7. **Decision Engine**
Combine all signals into a transparent recommendation:
- **High Risk** (score ≥ 7): **MANUAL REVIEW**
- **Medium Risk** (score 4-6): **STEP-UP VERIFICATION**
- **Low Risk** (score < 4): **APPROVE**

### 8. **Explainable Output**
Every decision includes triggered signals with evidence, risk score, recommendation, and linked entities.

## Jac Features Used

### 1. **Graph-Native Data Model**
Nodes (Applicant, Email, Phone, Device, IPAddress, Document, RiskEvent) and edges (uses_email, uses_device, shares_signal_with, similar_to) make relationships first-class and queryable.

### 2. **Walkers for Multi-Step Investigation**
- `ingestion_walker`: Create graph entities from case data
- `linking_walker`: Merge related nodes and establish relationships
- `risk_evaluation_walker`: Fire all deterministic risk signals
- `investigation_walker`: Traverse suspicious links
- `memory_walker`: Find similar historical cases
- `decision_walker`: Combine signals into final recommendation

### 3. **Deterministic Signal Engine**
All signals are rule-based with structured evidence. No LLM calls for fraud logic.

### 4. **Structured Evidence Tracking**
Each signal produces rule code, severity, explanation, and linked evidence.

### 5. **Node Relationships for Context**
Edges capture how entities relate, enabling efficient graph traversal for investigation.

## Architecture Overview

```
Frontend (HTML/CSS/JS)
    ↓
Jac Backend
  • main.jac (orchestrator)
  • models.jac (graph definition)
  • walkers.jac (investigation flow)
  • signals.jac (risk detection)
  • data/seed_cases.json (test data)
```

## File Structure

```
SignalKYC/
├── main.jac                 # Entry point, orchestrator
├── models.jac               # Graph nodes and edges
├── walkers.jac              # Investigation walkers
├── signals.jac              # Risk signal engine
├── data/
│   └── seed_cases.json      # Sample test cases
├── frontend/
│   ├── index.html           # Dashboard UI
│   ├── app.js               # Investigation logic
│   ├── styles.css           # Styling
│   └── graph-viz.js         # Graph rendering
├── README.md                # This file
└── LICENSE
```

## How to Run Locally

### Prerequisites
- Python 3.8+
- Jac (v0.15+)
- A modern browser

### Install Jac
```bash
pip install jaclang
```

### Start the Application
1. Navigate to the project:
```bash
cd SignalKYC
```

2. Open `frontend/index.html` in your browser:
   - **Mac**: `open frontend/index.html`
   - **Windows**: Double-click in File Explorer or run `start frontend/index.html`
   - **Linux**: `xdg-open frontend/index.html`

3. The dashboard loads with sample cases ready to investigate.

### Run Jac Backend (Optional)
```bash
jac run main.jac
```

## Demo Flow (3 Minutes)

**Scenario 1: Clean Applicant** (30s)
- Load "Alice Johnson (Clean)"
- Show: 0 risk signals, score 0/20
- Decision: ✅ APPROVE

**Scenario 2: High-Risk Fraud** (1m)
- Load "Bob Smith (High Risk)"
- Show:
  - ❌ Device reused (3 applicants)
  - ❌ Disposable email (tempmail.com)
  - ❌ IP mismatch (NG IP, US applicant)
  - Risk score: 7.0/20
- Decision: 🔴 MANUAL REVIEW

**Scenario 3: Fraud Ring** (1m)
- Load "Carol Davis (Device Reuse)"
- Show: Device shared with Bob Smith, same IP
- Decision: 🔴 MANUAL REVIEW

**Scenario 4: Medium Risk** (30s)
- Show medium-risk case with step-up verification
- Explain geographic mismatch signal

## Key Decisions

✅ **Real Agent Behavior**: Graph nodes, walkers, deterministic signals  
✅ **Jac-First**: Nodes/edges model the domain; walkers handle investigation phases  
✅ **Demoable MVP**: 6 seed cases, no external APIs, fast load times  
✅ **Explainable**: Every signal has evidence; every decision is justified  

## What Worked Well

1. **Graph relationships** reveal fraud patterns (rings, coordinated attacks) invisible with sequential checks
2. **Walker stages** (ingest → link → evaluate → investigate → decide) structure investigation naturally
3. **Deterministic signals** are fast, trustworthy, and auditable
4. **Seed data** eliminates API dependencies, focusing on core logic

## Challenges & Next Steps

**What Broke**:
- Jac graph traversal is verbose (explicit edge loops needed)
- LLM integration: Kept explanations hardcoded to avoid latency
- Historical matching: Simplified to signal pattern matching
- Frontend-backend bridge: MVP uses mock JS logic

**Production Roadmap**:
- REST API wrapper around Jac walkers
- Real historical case database (PostgreSQL/Neo4j)
- Advanced signals (behavioral, velocity, document verification)
- Agent learning feedback loop (analyst reviews → signal reweighting)
- Compliance reporting and audit logging
- Performance optimization for 10K+ cases/day

## Lessons Learned

1. **Graph reasoning > sequential checks**: Relationships reveal patterns
2. **Explainability builds trust**: Analysts trust decisions they understand
3. **Jac's walkers are ideal for agents**: Clear separation of concerns
4. **Seed data is crucial for hackathons**: Enables focus on core logic
5. **Deterministic + transparent > ML + opaque**: For compliance, auditability wins

## Contributors

Built for **JacHacks Spring 2026**.

## License

MIT License - see LICENSE file for details

---

## Quick Reference: Risk Signals

| Signal | Severity | Threshold |
|--------|----------|-----------|
| Device Reuse | HIGH | Device used by >1 applicant |
| Shared Phone | HIGH | Phone linked to prior flagged case |
| Suspicious Email | MEDIUM | Disposable domain or alias |
| IP Burst | HIGH | >5 submissions in short window |
| IP Geo-Mismatch | MEDIUM | IP country ≠ applicant country |
| Document Reuse | HIGH | Document used by >1 applicant |
| Email Pattern | LOW | Contains +, "test", "admin" |
| Session Burst | MEDIUM | >3 rapid sessions |
| Signal Stacking | MEDIUM | ≥3 weak signals combine |
| Historical Similarity | HIGH | Similar to escalated case |

**Risk Score Interpretation**:
- **< 4**: Low risk → APPROVE
- **4-6**: Medium risk → STEP-UP VERIFICATION
- **≥ 7**: High risk → MANUAL REVIEW

---

**SignalKYC**: Making fintech onboarding faster, smarter, and more transparent. 🔍
