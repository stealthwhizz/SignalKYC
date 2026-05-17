// SignalKYC Polished Frontend - Investigation Logic & Interactions

// Case Database with Comprehensive Details
const caseDatabase = {
    "app_clean_001": {
        applicant_id: "app_clean_001",
        full_name: "Alice Johnson",
        initials: "AJ",
        email: "alice.johnson@gmail.com",
        phone: "+1-415-555-0001",
        device_id: "dev_clean_001",
        ip_address: "203.0.113.10",
        country: "US",
        submitted_at: "2026-05-17 10:00 AM",
        case_type: "NORMAL",
        device_count: 1,
        email_count: 1,
        phone_count: 1,
        shared_signals: 0
    },
    "app_suspicious_001": {
        applicant_id: "app_suspicious_001",
        full_name: "Bob Smith",
        initials: "BS",
        email: "bob.smith+test@tempmail.com",
        phone: "+1-415-555-0002",
        device_id: "dev_reused_001",
        ip_address: "198.51.100.5",
        country: "US",
        submitted_at: "2026-05-17 10:30 AM",
        case_type: "SUSPICIOUS_HIGH",
        device_count: 3,
        email_count: 1,
        phone_count: 1,
        shared_signals: 2
    },
    "app_suspicious_002": {
        applicant_id: "app_suspicious_002",
        full_name: "Carol Davis",
        initials: "CD",
        email: "carol.davis@gmail.com",
        phone: "+1-415-555-0003",
        device_id: "dev_reused_001",
        ip_address: "198.51.100.5",
        country: "US",
        submitted_at: "2026-05-17 10:35 AM",
        case_type: "SUSPICIOUS_HIGH",
        device_count: 3,
        email_count: 1,
        phone_count: 1,
        shared_signals: 2,
        notes: "Shares device & IP with Bob Smith (app_suspicious_001)"
    },
    "app_verified_002": {
        applicant_id: "app_verified_002",
        full_name: "Frank Chen",
        initials: "FC",
        email: "frank.chen@company.com",
        phone: "+1-206-555-0006",
        device_id: "dev_clean_003",
        ip_address: "203.0.113.20",
        country: "US",
        submitted_at: "2026-05-17 11:30 AM",
        case_type: "NORMAL",
        device_count: 1,
        email_count: 1,
        phone_count: 1,
        shared_signals: 0
    }
};

// Investigation Engine - Deterministic Risk Detection
function investigateCase(applicantId) {
    if (!applicantId || !caseDatabase[applicantId]) {
        return null;
    }

    const appData = caseDatabase[applicantId];
    const triggeredSignals = [];
    let riskScore = 0;

    // Deterministic signal detection based on case type
    if (appData.case_type.includes("SUSPICIOUS")) {
        // Signal 1: Device Reuse
        triggeredSignals.push({
            code: "DEVICE_REUSE",
            name: "Device Reused",
            severity: "high",
            description: "Device has been used by multiple applicants",
            evidence: `Device ID ${appData.device_id} found in ${appData.device_count} applications`
        });
        riskScore += 3.0;

        // Signal 2: Suspicious Email
        if (appData.email.includes("tempmail") || appData.email.includes("yopmail")) {
            triggeredSignals.push({
                code: "SHARED_EMAIL",
                name: "Suspicious Email",
                severity: "medium",
                description: "Email shows disposable service pattern",
                evidence: `Email domain suggests temporary service: ${appData.email.split('@')[1]}`
            });
            riskScore += 2.0;
        }

        // Signal 3: Email Pattern Risk
        if (appData.email.includes("+")) {
            triggeredSignals.push({
                code: "EMAIL_PATTERN",
                name: "Email Pattern Risk",
                severity: "low",
                description: "Email contains alias pattern",
                evidence: `Email format suggests aliasing: ${appData.email}`
            });
            riskScore += 1.0;
        }

        // Signal 4: IP Geographic Mismatch
        triggeredSignals.push({
            code: "IP_GEO_MISMATCH",
            name: "Geographic Mismatch",
            severity: "medium",
            description: "IP country differs from applicant location",
            evidence: `IP geolocates to Nigeria (NG) but applicant reports US location`
        });
        riskScore += 2.0;
    }

    // Determine recommendation
    let recommendation = "APPROVE";
    let recommendationClass = "approve";
    let explanation = "All risk signals are within acceptable thresholds. Case approved for onboarding.";

    if (riskScore >= 7.0) {
        recommendation = "MANUAL REVIEW";
        recommendationClass = "manual";
        explanation = `High-risk signals detected (${triggeredSignals.length} triggered). Recommend immediate manual review by fraud team.`;
    } else if (riskScore >= 4.0) {
        recommendation = "STEP-UP VERIFICATION";
        recommendationClass = "stepup";
        explanation = `Medium-risk signals detected (${triggeredSignals.length} triggered). Recommend additional identity verification steps.`;
    }

    return {
        applicant_id: applicantId,
        full_name: appData.full_name,
        initials: appData.initials,
        email: appData.email,
        phone: appData.phone,
        device_id: appData.device_id,
        ip_address: appData.ip_address,
        country: appData.country,
        submitted_at: appData.submitted_at,
        recommendation: recommendation,
        recommendationClass: recommendationClass,
        risk_score: riskScore.toFixed(1),
        triggered_signals: triggeredSignals,
        explanation: explanation,
        linked_entities: {
            device_count: appData.device_count,
            email_count: appData.email_count,
            phone_count: appData.phone_count,
            shared_signals: appData.shared_signals
        },
        historical_similar: [
            {
                case_id: "hist_2026_0142",
                applicant_name: "Similar High Risk Profile",
                similarity_score: 0.87,
                outcome: "Manual Review → Fraud Detected"
            }
        ]
    };
}

// UI Update Functions
function loadCaseByElement(element, applicantId) {
    // Visual feedback
    document.querySelectorAll('.case-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');

    // Give brief delay for visual feedback
    setTimeout(() => {
        loadCase(applicantId);
    }, 100);
}

function loadCase(applicantId) {
    if (!applicantId) {
        console.error('No applicant ID provided');
        return;
    }

    const result = investigateCase(applicantId);
    if (!result) {
        alert("Case not found");
        return;
    }

    // Transition to investigation view
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('investigation-view').style.display = 'grid';

    // Populate all sections
    populateApplicantHeader(result);
    populateDetails(result);
    populateSignals(result.triggered_signals);
    populateTimeline(result);
    populateDecision(result);
    populateEntities(result.linked_entities);
    populateSimilarCases(result.historical_similar);
    renderIdentityGraph(result);

    // Scroll to top
    window.scrollTo(0, 0);
}

function goToDashboard() {
    document.getElementById('investigation-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function populateApplicantHeader(result) {
    document.getElementById('applicant-initials').textContent = result.initials;
    document.getElementById('applicant-name').textContent = result.full_name;
    document.getElementById('applicant-id').textContent = `ID: ${result.applicant_id}`;
    document.getElementById('applicant-submitted').textContent = `Submitted: ${result.submitted_at}`;
}

function populateDetails(result) {
    document.getElementById('detail-email').textContent = result.email;
    document.getElementById('detail-phone').textContent = result.phone;
    document.getElementById('detail-device').textContent = result.device_id;
    document.getElementById('detail-ip').textContent = result.ip_address;
}

function populateSignals(signals) {
    const signalsContainer = document.getElementById('signals-list');
    
    if (signals.length === 0) {
        signalsContainer.innerHTML = '<p style="color: var(--text-tertiary); font-style: italic;">No risk signals triggered</p>';
        return;
    }

    signalsContainer.innerHTML = signals.map((signal, idx) => `
        <div class="signal-item ${signal.severity}" style="animation-delay: ${idx * 0.1}s;">
            <div class="signal-name">${signal.name}</div>
            <div class="signal-code">${signal.code} • ${signal.severity.toUpperCase()}</div>
            <div class="signal-desc">${signal.description}</div>
            <div class="signal-evidence">Evidence: ${signal.evidence}</div>
        </div>
    `).join('');
}

function populateTimeline(result) {
    const timeline = document.getElementById('timeline');
    
    const steps = [
        { marker: '1', label: 'Ingesting applicant data', complete: true },
        { marker: '2', label: 'Linking identity signals', complete: true },
        { marker: '3', label: `Evaluating risk: ${result.triggered_signals.length} signals triggered`, complete: true, risk: result.risk_score >= 7 },
        { marker: '4', label: 'Investigating linked entities', complete: true, risk: result.linked_entities.shared_signals > 0 },
        { marker: '5', label: `Decision: <strong>${result.recommendation}</strong>`, complete: true, risk: result.recommendationClass !== 'approve' }
    ];

    timeline.innerHTML = steps.map(step => `
        <div class="timeline-item">
            <div class="timeline-marker ${step.risk ? 'risk' : (step.complete ? 'complete' : '')}">${step.marker}</div>
            <div class="timeline-content">${step.label}</div>
        </div>
    `).join('');
}

function populateDecision(result) {
    const decisionCard = document.getElementById('decision-card');
    decisionCard.className = `decision-card-large ${result.recommendationClass}`;
    
    document.getElementById('decision-badge').textContent = result.recommendation;
    document.getElementById('decision-badge').className = `decision-badge ${result.recommendationClass}`;
    document.getElementById('score-number').textContent = result.risk_score;
    document.getElementById('decision-explanation').textContent = result.explanation;

    const evidenceList = document.getElementById('evidence-list');
    if (result.triggered_signals.length > 0) {
        evidenceList.innerHTML = result.triggered_signals.map(signal => 
            `<li>${signal.name}: ${signal.evidence}</li>`
        ).join('');
    } else {
        evidenceList.innerHTML = '<li>All identity signals clean</li>';
    }
}

function populateEntities(linkedEntities) {
    const entitiesContainer = document.getElementById('linked-entities');
    
    const entities = [
        { type: 'DEVICE', value: `dev_*`, count: linkedEntities.device_count, desc: 'applicant(s)' },
        { type: 'EMAIL', value: 'email@*', count: linkedEntities.email_count, desc: 'usage(s)' },
        { type: 'PHONE', value: '+1-*', count: linkedEntities.phone_count, desc: 'usage(s)' }
    ];

    if (linkedEntities.shared_signals > 0) {
        entities.push({ 
            type: 'SHARED SIGNALS', 
            value: 'linked', 
            count: linkedEntities.shared_signals, 
            desc: 'shared with others' 
        });
    }

    entitiesContainer.innerHTML = entities.map(entity => `
        <div class="entity-badge">
            <div class="entity-type">${entity.type}</div>
            <div class="entity-value">${entity.value}</div>
            <div class="entity-count"><strong>${entity.count}</strong> ${entity.desc}</div>
        </div>
    `).join('');
}

function populateSimilarCases(historicalCases) {
    const histContainer = document.getElementById('similar-cases');
    
    if (historicalCases.length === 0) {
        histContainer.innerHTML = '<p style="color: var(--text-tertiary); font-style: italic;">No similar cases found</p>';
        return;
    }

    histContainer.innerHTML = historicalCases.map(hist => `
        <div class="similar-case-item">
            <div class="similar-case-id">${hist.case_id}</div>
            <div class="similar-case-reason">${hist.applicant_name}</div>
            <div class="similarity-score">Similarity: ${(hist.similarity_score * 100).toFixed(0)}% • Outcome: ${hist.outcome}</div>
        </div>
    `).join('');
}

// Simple SVG Graph Rendering
function renderIdentityGraph(result) {
    const container = document.getElementById('graph-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'graph-svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Determine colors based on risk
    const isRisky = result.risk_score >= 7;
    const applicantColor = isRisky ? '#ef4444' : '#06b6d4';
    const linkedColor = isRisky ? '#f59e0b' : '#10b981';
    
    // Center point
    const cx = width / 2;
    const cy = height / 2;
    const radius = 80;
    
    // Draw center applicant
    svg.innerHTML = `
        <!-- Lines to linked entities -->
        <line x1="${cx}" y1="${cy}" x2="${cx - radius}" y2="${cy}" stroke="#374151" stroke-width="2" stroke-dasharray="5,5"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + radius}" y2="${cy}" stroke="#374151" stroke-width="2" stroke-dasharray="5,5"/>
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - radius}" stroke="#374151" stroke-width="2" stroke-dasharray="5,5"/>
        
        <!-- Center node: Applicant -->
        <circle cx="${cx}" cy="${cy}" r="20" fill="${applicantColor}" stroke="white" stroke-width="2"/>
        <text x="${cx}" y="${cy}" text-anchor="middle" dy="0.3em" fill="white" font-size="11" font-weight="bold">APP</text>
        
        <!-- Left: Device -->
        <circle cx="${cx - radius}" cy="${cy}" r="15" fill="${linkedColor}" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="${cx - radius}" y="${cy}" text-anchor="middle" dy="0.3em" fill="white" font-size="10" font-weight="bold">DEV</text>
        <text x="${cx - radius}" y="${cy + 30}" text-anchor="middle" font-size="11" fill="#b8bcc6">Device</text>
        
        <!-- Right: Email -->
        <circle cx="${cx + radius}" cy="${cy}" r="15" fill="${linkedColor}" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="${cx + radius}" y="${cy}" text-anchor="middle" dy="0.3em" fill="white" font-size="10" font-weight="bold">EML</text>
        <text x="${cx + radius}" y="${cy + 30}" text-anchor="middle" font-size="11" fill="#b8bcc6">Email</text>
        
        <!-- Top: IP -->
        <circle cx="${cx}" cy="${cy - radius}" r="15" fill="${linkedColor}" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="${cx}" y="${cy - radius}" text-anchor="middle" dy="0.3em" fill="white" font-size="10" font-weight="bold">IP</text>
        <text x="${cx}" y="${cy - radius - 25}" text-anchor="middle" font-size="11" fill="#b8bcc6">IP Address</text>
        
        <!-- Shared link indicators -->
        ${result.linked_entities.shared_signals > 0 ? `
            <circle cx="${cx - radius}" cy="${cy}" r="18" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" opacity="0.6"/>
        ` : ''}
    `;
    
    container.innerHTML = '';
    container.appendChild(svg);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('SignalKYC dashboard initialized');
    // Set first case card to be visually highlighted
    const firstCard = document.querySelector('.case-card.suspicious');
    if (firstCard) {
        firstCard.focus();
    }
});
