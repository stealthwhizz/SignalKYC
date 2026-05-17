"""
Risk signal detection engine for SignalKYC.
All signals are deterministic, rule-based, and non-LLM.
Each signal produces structured evidence for explainability.
"""

global signal_definitions = {
    "DEVICE_REUSE": {
        "name": "Device Reused",
        "severity": "high",
        "description": "Device has been used by multiple applicants"
    },
    "SHARED_PHONE": {
        "name": "Shared Phone",
        "severity": "high",
        "description": "Phone number linked to prior flagged case"
    },
    "SHARED_EMAIL": {
        "name": "Suspicious Email",
        "severity": "medium",
        "description": "Email shows disposable or high-risk pattern"
    },
    "IP_BURST": {
        "name": "IP Submission Burst",
        "severity": "high",
        "description": "IP address has many submissions in short time window"
    },
    "IP_GEO_MISMATCH": {
        "name": "Geographic Mismatch",
        "severity": "medium",
        "description": "IP country differs from phone/document country"
    },
    "DOCUMENT_REUSE": {
        "name": "Document Reused",
        "severity": "high",
        "description": "Document has been used by multiple applicants"
    },
    "EMAIL_PATTERN": {
        "name": "Email Pattern Risk",
        "severity": "low",
        "description": "Email format suggests disposable or temporary service"
    },
    "SESSION_BURST": {
        "name": "Session Burst",
        "severity": "medium",
        "description": "Unusual rapid session activity detected"
    },
    "SIGNAL_STACKING": {
        "name": "Signal Stacking",
        "severity": "medium",
        "description": "Multiple weak signals combine into meaningful risk"
    },
    "HISTORICAL_SIMILARITY": {
        "name": "Similar to Escalated Case",
        "severity": "high",
        "description": "Applicant shares risk profile with prior manual review"
    }
};

global disposable_domains = [
    "10minutemail.com",
    "tempmail.com",
    "throwaway.email",
    "mailinator.com",
    "yopmail.com",
    "temp-mail.org",
    "sharklasers.com",
    "spam4.me"
];

def is_disposable_email(email: str) -> bool {
    domain = email.split("@")[1] if "@" in email else "";
    return domain.lower() in disposable_domains;
}

def check_device_reuse(device) -> tuple[bool, dict] {
    """Flag if device used by multiple applicants"""
    incoming_edges = device.get_incoming_edges();
    applicant_count = 0;
    for edge in incoming_edges {
        if edge.edge_type() == "uses_device" {
            applicant_count += 1;
        }
    }
    
    is_risky = applicant_count > 1;
    evidence = {
        "applicant_count": applicant_count,
        "rule_code": "DEVICE_REUSE",
        "device_id": device.device_id,
        "threshold": 1
    };
    
    return [is_risky, evidence];
}

def check_shared_phone(phone) -> tuple[bool, dict] {
    """Flag if phone linked to prior flagged case"""
    incoming_edges = phone.get_incoming_edges();
    flagged_count = 0;
    linked_cases = [];
    
    for edge in incoming_edges {
        if edge.edge_type() == "uses_phone" {
            source = edge.source();
            if source.node_type() == "HistoricalCase" {
                if source.review_outcome == "MANUAL_REVIEW" or source.original_recommendation == "MANUAL_REVIEW" {
                    flagged_count += 1;
                    linked_cases.append(source.case_id);
                }
            }
        }
    }
    
    is_risky = flagged_count > 0;
    evidence = {
        "flagged_case_count": flagged_count,
        "linked_cases": linked_cases,
        "rule_code": "SHARED_PHONE",
        "phone": phone.phone
    };
    
    return [is_risky, evidence];
}

def check_shared_email(email) -> tuple[bool, dict] {
    """Flag if email is disposable or has suspicious pattern"""
    is_disposable = is_disposable_email(email.email);
    
    incoming_edges = email.get_incoming_edges();
    usage_count = 0;
    for edge in incoming_edges {
        if edge.edge_type() == "uses_email" {
            usage_count += 1;
        }
    }
    
    is_risky = is_disposable or usage_count > 2;
    evidence = {
        "is_disposable": is_disposable,
        "usage_count": usage_count,
        "rule_code": "SHARED_EMAIL",
        "email": email.email,
        "domain": email.email_domain
    };
    
    return [is_risky, evidence];
}

def check_ip_burst(ip_addr) -> tuple[bool, dict] {
    """Flag if IP has many submissions in short time window"""
    submission_count = ip_addr.submission_count;
    is_risky = submission_count > 5;
    
    evidence = {
        "submission_count": submission_count,
        "threshold": 5,
        "rule_code": "IP_BURST",
        "ip_address": ip_addr.ip_address
    };
    
    return [is_risky, evidence];
}

def check_ip_geo_mismatch(applicant, ip_addr, phone, document) -> tuple[bool, dict] {
    """Flag if IP country differs from phone/document country"""
    ip_country = ip_addr.country;
    applicant_country = applicant.country;
    phone_country = phone.country_code if phone else "";
    doc_country = document.doc_country if document else "";
    
    is_risky = (ip_country != applicant_country) and (ip_country != phone_country);
    
    evidence = {
        "ip_country": ip_country,
        "applicant_country": applicant_country,
        "phone_country": phone_country,
        "doc_country": doc_country,
        "rule_code": "IP_GEO_MISMATCH"
    };
    
    return [is_risky, evidence];
}

def check_document_reuse(document) -> tuple[bool, dict] {
    """Flag if document used by multiple applicants"""
    incoming_edges = document.get_incoming_edges();
    applicant_count = 0;
    for edge in incoming_edges {
        if edge.edge_type() == "submitted_document" {
            applicant_count += 1;
        }
    }
    
    is_risky = applicant_count > 1;
    evidence = {
        "applicant_count": applicant_count,
        "rule_code": "DOCUMENT_REUSE",
        "document_id": document.document_id,
        "threshold": 1
    };
    
    return [is_risky, evidence];
}

def check_email_pattern(email) -> tuple[bool, dict] {
    """Check for suspicious email patterns"""
    email_str = email.email.lower();
    
    risky_patterns = ["+", "test", "admin", "demo", "fake", "spam"];
    pattern_matches = [];
    
    for pattern in risky_patterns {
        if pattern in email_str {
            pattern_matches.append(pattern);
        }
    }
    
    is_risky = len(pattern_matches) > 0;
    evidence = {
        "matching_patterns": pattern_matches,
        "rule_code": "EMAIL_PATTERN",
        "email": email.email
    };
    
    return [is_risky, evidence];
}

def check_session_burst(applicant) -> tuple[bool, dict] {
    """Flag unusual rapid session activity"""
    outgoing_edges = applicant.get_outgoing_edges();
    session_count = 0;
    
    for edge in outgoing_edges {
        if edge.edge_type() == "submits_session" {
            session_count += 1;
        }
    }
    
    is_risky = session_count > 3;
    evidence = {
        "session_count": session_count,
        "threshold": 3,
        "rule_code": "SESSION_BURST",
        "applicant_id": applicant.applicant_id
    };
    
    return [is_risky, evidence];
}

def check_signal_stacking(signal_count: int) -> tuple[bool, dict] {
    """Weak signals stack into meaningful risk"""
    is_risky = signal_count >= 3;
    
    evidence = {
        "signal_count": signal_count,
        "threshold": 3,
        "rule_code": "SIGNAL_STACKING"
    };
    
    return [is_risky, evidence];
}

def check_historical_similarity(applicant, historical_cases: list) -> tuple[bool, dict] {
    """Compare applicant to escalated historical cases"""
    matching_count = 0;
    
    for hist_case in historical_cases {
        if hist_case.original_recommendation == "MANUAL_REVIEW" {
            if len(hist_case.signals) > 0 {
                matching_count += 1;
            }
        }
    }
    
    is_risky = matching_count > 0;
    evidence = {
        "matching_escalated_cases": matching_count,
        "rule_code": "HISTORICAL_SIMILARITY",
        "applicant_id": applicant.applicant_id
    };
    
    return [is_risky, evidence];
}

def calculate_signal_severity(signal_code: str) -> str {
    """Get severity level for a signal"""
    if signal_code in signal_definitions {
        return signal_definitions[signal_code]["severity"];
    }
    return "low";
}

def calculate_total_risk(triggered_signals: list) -> tuple[float, str] {
    """Calculate cumulative risk score from triggered signals"""
    severity_weights = {
        "high": 3.0,
        "medium": 2.0,
        "low": 1.0
    };
    
    risk_score = 0.0;
    for signal_code in triggered_signals {
        severity = calculate_signal_severity(signal_code);
        weight = severity_weights.get(severity, 1.0);
        risk_score += weight;
    }
    
    if risk_score >= 7.0 {
        return [risk_score, "high"];
    } elif risk_score >= 4.0 {
        return [risk_score, "medium"];
    } else {
        return [risk_score, "low"];
    }
}

def recommend_decision(risk_level: str, triggered_signals: list, historical_matches: int) -> str {
    """Deterministic decision logic"""
    
    if risk_level == "high" {
        return "MANUAL_REVIEW";
    } elif risk_level == "medium" {
        if historical_matches > 0 {
            return "MANUAL_REVIEW";
        } else {
            return "STEP_UP_VERIFICATION";
        }
    } else {
        return "APPROVE";
    }
}
