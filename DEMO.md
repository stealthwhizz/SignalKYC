# SignalKYC – 3‑Minute Demo Script (Cinematic Pitch)

**Total time: 3:00**  
*Narration cues in italics, timing in [brackets].*

---

## [0:00 – 0:10] Hook

> *“Fraud teams don’t need another risk score. They need an **investigation**.”*

**[Screen: Dashboard with “New Investigation” button]**

> *“Meet SignalKYC – an autonomous KYC agent that builds a live identity graph and walks suspicious connections, just like a human analyst would.”*

---

## [0:10 – 0:40] Problem Framing

> *“Today, if you apply for a fintech account, your email, phone, device, and IP are checked in isolation. If one signal is suspicious, you might get a generic ‘manual review’ – but no one explains **why** or **what to do next**.”*

**[Show static screenshots of typical risk score UI]**

> *“Fraud rings exploit this fragmentation – they reuse devices, rotate IPs, and create synthetic identities. Traditional rules miss the links.”*

> *“So we built SignalKYC around **graph‑native agentic investigation**.”*

---

## [0:40 – 2:15] Live Walkthrough

### Step 1 – Start a new case

> *“Let’s investigate a real applicant.”*

**[Click “New Investigation” → Investigation page loads with a graph]**

> *“The frontend immediately builds an identity graph – user, email, phone, device, IP. But that’s just the canvas.”*

---

### Step 2 – Agent starts reasoning (auto‑play)

> *“Now watch the agent work.”*

**[Agent reasoning panel starts auto‑playing]**

> *“Step 1: Checking email reputation. The graph highlights the email node.”*

**[Graph highlights email node in orange]**

> *“Step 2: Device fingerprint analysis. It finds this device was previously marked suspicious – so it expands the investigation.”*

**[Highlight device node, then also highlight other users sharing that device]**

> *“Step 3: IP velocity check – nothing unusual here.”*

> *“Step 4: Historical fraud clusters – oh, this device belongs to a known fraud ring from three months ago.”*

**[Highlight FraudCluster node, show risk score jumping]**

> *“Step 5: Final decision – **Step‑up verification** because the risk is medium but not yet certain fraud.”*

**[Decision panel shows “STEP_UP” with explanation bullets]**

---

### Step 3 – Show interactivity (settings)

> *“But what if our compliance team is more aggressive?”*

**[Click Settings → drag Risk Sensitivity to 100]**

> *“Start a new investigation – with the same signals, the agent now recommends **Manual Review**.”*

**[Show decision change]**

> *“Every parameter is adjustable – fraud intensity, simulation speed – so you can tune the agent to your risk appetite.”*

---

## [2:15 – 2:50] Backend Explanation (Brief, Technical)

> *“Under the hood, the backend is written entirely in **Jac** – Jaseci’s graph‑native agentic language.”*

**[Show split screen: left = Jac code, right = graph]**

> *“We define nodes for every identity entity, edges for relationships, and a **stateful agent** that walks the graph.”*

> *“The agent keeps working memory, expands suspicious clusters, and even updates **long‑term fraud clusters** so future investigations remember past patterns.”*

> *“All of this is exposed through simple walkers – `investigate_signup`, `graph`, `get_case` – that return structured JSON to the Next.js frontend.”*

---

## [2:50 – 3:00] Closing Statement

> *“SignalKYC turns KYC from a black‑box score into an **explainable, autonomous investigation** – reducing manual review costs and catching fraud rings that siloed checks would miss.”*

> *“Built with Jac, for the future of agentic fintech.”*

**[Screen: Final card with “SignalKYC” logo, GitHub repo URL, team names]**

> *“Thank you – and we’d love to show you the code.”*

---

## Timing Breakdown

| Section | Duration |
|---------|----------|
| Hook + problem | 0:00 – 0:40 (40s) |
| Live walkthrough (auto‑play steps) | 0:40 – 2:15 (95s) |
| Backend technical snippet | 2:15 – 2:50 (35s) |
| Closing statement | 2:50 – 3:00 (10s) |

---

## What to Prepare Before Recording

- **Browser** open to localhost:3000 (dev server running).
- **Settings** pre‑set to default (50/50/1200ms).
- **No backend needed** – mock simulation mode is on.
- **Screen recording** with cursor visible.
- **Optional**: Show a quick glance at `fraud_agent.jac` or `nodes.jac` during backend explanation.

