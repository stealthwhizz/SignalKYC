"""
Graph model for SignalKYC.
Defines all node types, edges, and core attributes.
"""

node Applicant {
    applicant_id: str,
    full_name: str,
    status: str,
    submission_time: str,
    country: str,
    created_at: str,
    risk_score: float = 0.0,
    is_suspicious: bool = False
}

node Email {
    email: str,
    email_domain: str,
    is_disposable: bool = False,
    usage_count: int = 0,
    created_at: str
}

node Phone {
    phone: str,
    country_code: str,
    usage_count: int = 0,
    created_at: str
}

node Device {
    device_id: str,
    device_type: str,
    device_fingerprint: str,
    usage_count: int = 0,
    created_at: str
}

node IPAddress {
    ip_address: str,
    country: str,
    isp: str,
    submission_count: int = 0,
    last_seen: str,
    created_at: str
}

node Document {
    document_id: str,
    doc_type: str,
    doc_country: str,
    usage_count: int = 0,
    created_at: str
}

node Session {
    session_id: str,
    user_agent: str,
    timestamp: str
}

node RiskEvent {
    event_id: str,
    event_type: str,
    severity: str,
    rule_code: str,
    explanation: str,
    evidence: str,
    timestamp: str
}

node Decision {
    decision_id: str,
    recommendation: str,
    confidence: float,
    risk_score: float,
    explanation: str,
    triggered_signals: list[str],
    timestamp: str
}

node HistoricalCase {
    case_id: str,
    original_recommendation: str,
    applicant_id: str,
    risk_score: float,
    signals: list[str],
    created_at: str,
    review_outcome: str
}

edge uses_email {
    relationship_type: str = "uses_email",
    discovered_at: str
}

edge uses_phone {
    relationship_type: str = "uses_phone",
    discovered_at: str
}

edge uses_device {
    relationship_type: str = "uses_device",
    discovered_at: str
}

edge seen_from_ip {
    relationship_type: str = "seen_from_ip",
    request_count: int = 1,
    discovered_at: str
}

edge submitted_document {
    relationship_type: str = "submitted_document",
    discovered_at: str
}

edge triggered_event {
    relationship_type: str = "triggered_event",
    severity: str,
    discovered_at: str
}

edge shares_signal_with {
    relationship_type: str = "shares_signal_with",
    signal_type: str,
    strength: float,
    discovered_at: str
}

edge similar_to {
    relationship_type: str = "similar_to",
    similarity_score: float,
    matching_signals: list[str],
    discovered_at: str
}

edge decided_as {
    relationship_type: str = "decided_as",
    timestamp: str
}

edge references_historical {
    relationship_type: str = "references_historical",
    similarity_score: float,
    discovered_at: str
}
