// SignalKYC Frontend Application
// Handles case investigation UI and result display

// Mock case database with investigation results
const caseDatabase = {
    "app_clean_001": {
        applicant_id: "app_clean_001",
        full_name: "Alice Johnson",
        email: "alice.johnson@gmail.com",
        phone: "+1-415-555-0001",
        device_id: "dev_clean_001",
        ip_address: "203.0.113.10",
        country: "US",
        submitted_at: "2026-05-17 10:00 AM",
        case_type: "NORMAL"
    },
    "app_suspicious_001": {
        applicant_id: "app_suspicious_001",
        full_name: "Bob Smith",
        email: "bob.smith+test@tempmail.com",
        phone: "+1-415-555-0002",
        device_id: "dev_reused_001",
        ip_address: "198.51.100.5",
        country: "US",
        submitted_at: "2026-05-17 10:30 AM",
        case_type: "SUSPICIOUS_HIGH"
    },
    "app_suspicious_002": {
        applicant_id: "app_suspicious_002",
        full_name: "Carol Davis",
        email: "carol.davis@gmail.com",
        phone: "+1-415-555-0003",
        device_id: "dev_reused_001",
        ip_address: "198.51.100.5",
        country: "US",
        submitted_at: "2026-05-17 10:35 AM",
        case_type: "SUSPICIOUS_HIGH",
        notes: "Shares device & IP with Bob Smith"
    },
    "app_verified_002": {
        applicant_id: "app_verified_002",
        full_name: "Frank Chen",
        email: "frank.chen@company.com",
        phone: "+1-206-555-0006",
        device_id: "dev_clean_003",
        ip_address: "203.0.113.20",
        country: "US",
        submitted_at: "2026-05-17 11:30 AM",
        case_type: "NORMAL"
    }
};

// Investigation engine
function investigateCase(applicantId) {
    if (!applicantId || !caseDatabase[applicantId]) {
        return null;
    }

    const appData = caseDatabase[applicantId];
    const triggeredSignals = [];
    let riskScore = 0;

    // Deterministic signal detection
    if (appData.case_type.includes("SUSPICIOUS")) {
        triggeredSignals.push({
            code: "DEVICE_REUSE",
            name: "Device Reused",
            severity: "high",
            description: "Device has been used by multiple applicants",
            evidence: `Device ID ${appData.device_id} found in other applications`
        });
        riskScore += 3.0;

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

        triggeredSignals.push({
            code: "IP_GEO_MISMATCH",
            name: "Geographic Mismatch",
            severity: "medium",
            description: "IP country differs from applicant location",
            evidence: `IP geolocates to NG but applicant reports US location`
        });
        riskScore += 2.0;
    }

    // Determine recommendation
    let recommendation = "APPROVE";
    let recommendationClass = "approve";
    let explanation = "All risk signals are within acceptable thresholds. Case approved for onboarding.";

    if (riskScore >= 7.0) {
        recommendation = "MANUAL REVIEW";
        recommendationClass = "manual-review";
        explanation = `High-risk signals detected (${triggeredSignals.length} triggered). Recommend immediate manual review by fraud team.`;
    } else if (riskScore >= 4.0) {
        recommendation = "STEP-UP VERIFICATION";
        recommendationClass = "step-up";
        explanation = `Medium-risk signals detected (${triggeredSignals.length} triggered). Recommend additional identity verification steps.`;
    }

    return {
        applicant_id: applicantId,
        full_name: appData.full_name,
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
            device_count: appData.case_type.includes("SUSPICIOUS") ? 3 : 1,
            email_count: 1,
            phone_count: 1,
            shared_signals: appData.case_type.includes("SUSPICIOUS") ? 2 : 0
        },
        historical_similar: [
            {
                case_id: "hist_2026_0142",
                applicant_name: "Similar High Risk Case",
                similarity_score: 0.87,
                outcome: "Manual Review → Fraud Detected"
            }
        ]
    };
}

// UI Update functions
function loadCase(applicantId) {
    if (!applicantId) {
        clearUI();
        return;
    }

    const result = investigateCase(applicantId);
    if (!result) {
        alert("Case not found");
        return;
    }

    displayApplicantInfo(result);
    displaySignals(result.triggered_signals);
    displayDecision(result);
    displayEntities(result.linked_entities, result.applicant_id);
    displayHistoricalCases(result.historical_similar);
}

function displayApplicantInfo(result) {
    const infoDiv = document.getElementById("applicant-info");
    infoDiv.innerHTML = `
        <h3>${result.full_name}</h3>
        <p><strong>Applicant ID:</strong> ${result.applicant_id}</p>
        <p><strong>Email:</strong> ${result.email}</p>
        <p><strong>Phone:</strong> ${result.phone}</p>
        <p><strong>Device ID:</strong> ${result.device_id}</p>
        <p><strong>IP Address:</strong> ${result.ip_address}</p>
        <p><strong>Country:</strong> ${result.country}</p>
        <p><strong>Submitted:</strong> ${result.submitted_at}</p>
    `;
}

function displaySignals(signals) {
    const signalsDiv = document.getElementById("signals-list");
    
    if (signals.length === 0) {
        signalsDiv.innerHTML = '<p class="placeholder">No risk signals triggered</p>';
        return;
    }

    signalsDiv.innerHTML = signals.map(signal => `
        <div class="signal-item ${signal.severity}">
            <div class="signal-name">${signal.name}</div>
            <div class="signal-code">${signal.code} • ${signal.severity.toUpperCase()}</div>
            <div class="signal-desc">${signal.description}</div>
            <div class="signal-desc"><em>Evidence: ${signal.evidence}</em></div>
        </div>
    `).join('');
}

function displayDecision(result) {
    const decisionDiv = document.getElementById("decision-display");
    decisionDiv.className = `decision-card ${result.recommendationClass}`;
    
    decisionDiv.innerHTML = `
        <div class="recommendation ${result.recommendationClass}">${result.recommendation}</div>
        <div class="risk-score">Risk Score: <span class="risk-${
            result.risk_score >= 7 ? 'high' : result.risk_score >= 4 ? 'medium' : 'low'
        }">${result.risk_score}/20</span></div>
        <div class="explanation">${result.explanation}</div>
    `;
}

function displayEntities(linkedEntities, applicantId) {
    const entitiesDiv = document.getElementById("entities-list");
    
    entitiesDiv.innerHTML = `
        <div class="entity">
            <div class="entity-type">APPLICANT</div>
            <div class="entity-value">${applicantId}</div>
        </div>
        <div class="entity">
            <div class="entity-type">DEVICE</div>
            <div class="entity-value">Usage: ${linkedEntities.device_count} applicant(s)</div>
        </div>
        <div class="entity">
            <div class="entity-type">EMAIL</div>
            <div class="entity-value">Usage: ${linkedEntities.email_count} applicant(s)</div>
        </div>
        <div class="entity">
            <div class="entity-type">PHONE</div>
            <div class="entity-value">Usage: ${linkedEntities.phone_count} applicant(s)</div>
        </div>
        ${linkedEntities.shared_signals > 0 ? `
        <div class="entity">
            <div class="entity-type">SHARED SIGNALS</div>
            <div class="entity-value">${linkedEntities.shared_signals} shared with other applicants</div>
        </div>
        ` : ''}
    `;
}

function displayHistoricalCases(historicalCases) {
    const histDiv = document.getElementById("historical-list");
    
    if (historicalCases.length === 0) {
        histDiv.innerHTML = '<p class="placeholder">No similar historical cases found</p>';
        return;
    }

    histDiv.innerHTML = historicalCases.map(hist => `
        <div class="historical-case">
            <div class="case-name">${hist.case_id}</div>
            <div class="case-meta">${hist.applicant_name}</div>
            <div class="case-meta">Outcome: ${hist.outcome}</div>
            <div class="similarity-badge">Similarity: ${(hist.similarity_score * 100).toFixed(0)}%</div>
        </div>
    `).join('');
}

function clearUI() {
    document.getElementById("applicant-info").innerHTML = '<p class="placeholder">Select a case to begin investigation</p>';
    document.getElementById("signals-list").innerHTML = '<p class="placeholder">Signals will appear here after investigation</p>';
    document.getElementById("decision-display").innerHTML = '<p class="placeholder">Decision pending...</p>';
    document.getElementById("entities-list").innerHTML = '<p class="placeholder">Entity relationships will appear here</p>';
    document.getElementById("historical-list").innerHTML = '<p class="placeholder">Similar cases will appear here</p>';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("SignalKYC dashboard ready");
});
