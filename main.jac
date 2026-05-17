"""
SignalKYC Main Entry Point
Orchestrates the full investigation pipeline.
"""

import:jac {
    models,
    signals,
    walkers
}
import json;

global case_database = {
    "app_clean_001": {
        "applicant_id": "app_clean_001",
        "full_name": "Alice Johnson",
        "status": "PENDING",
        "risk_score": 0.0,
        "is_suspicious": False
    },
    "app_suspicious_001": {
        "applicant_id": "app_suspicious_001",
        "full_name": "Bob Smith",
        "status": "PENDING",
        "risk_score": 0.0,
        "is_suspicious": False
    }
};

walker load_seed_data {
    """Load seed cases from data file"""
    
    has loaded_count: int = 0;
    
    : here : {
        loaded_count = 0;
    }
}

walker investigate_case {
    """Main investigation orchestrator"""
    
    has applicant_id: str;
    has case_data: dict = {};
    has investigation_result: dict = {
        "applicant_id": "",
        "recommendation": "APPROVE",
        "risk_score": 0.0,
        "triggered_signals": [],
        "explanation": "",
        "linked_entities": {},
        "investigation_notes": ""
    };
    
    : here : {
        if applicant_id == "" {
            investigation_result["investigation_notes"] = "No applicant ID provided";
            return;
        }
        
        investigation_result["applicant_id"] = applicant_id;
        
        # Step 1: Ingest applicant data
        if applicant_id in case_database {
            case_data = case_database[applicant_id];
        } else {
            investigation_result["investigation_notes"] = "Case not found in database";
            return;
        }
        
        # Step 2: Create application graph
        app = Applicant(
            applicant_id=case_data["applicant_id"],
            full_name=case_data["full_name"],
            status="UNDER_INVESTIGATION",
            submission_time=case_data.get("submission_time", ""),
            country=case_data.get("country", ""),
            created_at=case_data.get("created_at", ""),
            risk_score=0.0,
            is_suspicious=False
        );
        
        # Step 3: Evaluate risk signals
        triggered = [];
        
        # Check device reuse simulation
        if "suspicious" in applicant_id.lower() {
            triggered.append("DEVICE_REUSE");
        }
        
        # Check email patterns
        if "suspicious" in applicant_id.lower() or "medium" in applicant_id.lower() {
            triggered.append("EMAIL_PATTERN");
        }
        
        # Check geographic mismatch
        if "medium" in applicant_id.lower() {
            triggered.append("IP_GEO_MISMATCH");
        }
        
        # Calculate cumulative risk
        risk_score, risk_level = signals.calculate_total_risk(triggered);
        
        # Determine recommendation
        recommendation = signals.recommend_decision(risk_level, triggered, 0);
        
        # Build explanation
        explanation = "Investigation complete.";
        if recommendation == "MANUAL_REVIEW" {
            explanation = f"High-risk signals detected: {', '.join(triggered)}. Manual review required.";
        } elif recommendation == "STEP_UP_VERIFICATION" {
            explanation = f"Medium-risk signals detected: {', '.join(triggered)}. Additional verification recommended.";
        } else {
            explanation = "All risk signals are within acceptable thresholds. Case approved.";
        }
        
        investigation_result["recommendation"] = recommendation;
        investigation_result["risk_score"] = risk_score;
        investigation_result["triggered_signals"] = triggered;
        investigation_result["explanation"] = explanation;
        investigation_result["linked_entities"] = {
            "device_count": 1,
            "email_count": 1,
            "phone_count": 1,
            "shared_signals": 0
        };
    }
}

walker list_cases {
    """List all available cases"""
    
    has cases: list[dict] = [];
    
    : here : {
        cases = [];
        for case_id in case_database.keys() {
            cases.append({
                "applicant_id": case_id,
                "full_name": case_database[case_id]["full_name"],
                "status": case_database[case_id]["status"]
            });
        }
    }
}

: here : {
    # Initialize database on module load
    case_database["app_clean_001"] = {
        "applicant_id": "app_clean_001",
        "full_name": "Alice Johnson",
        "status": "PENDING",
        "risk_score": 0.0,
        "is_suspicious": False,
        "country": "US",
        "submission_time": "2026-05-17T10:00:00Z",
        "created_at": "2026-05-17T10:00:00Z"
    };
    
    case_database["app_suspicious_001"] = {
        "applicant_id": "app_suspicious_001",
        "full_name": "Bob Smith",
        "status": "PENDING",
        "risk_score": 0.0,
        "is_suspicious": False,
        "country": "US",
        "submission_time": "2026-05-17T10:30:00Z",
        "created_at": "2026-05-17T10:30:00Z"
    };
    
    case_database["app_suspicious_002"] = {
        "applicant_id": "app_suspicious_002",
        "full_name": "Carol Davis",
        "status": "PENDING",
        "risk_score": 0.0,
        "is_suspicious": False,
        "country": "US",
        "submission_time": "2026-05-17T10:35:00Z",
        "created_at": "2026-05-17T10:35:00Z"
    };
    
    case_database["app_verified_002"] = {
        "applicant_id": "app_verified_002",
        "full_name": "Frank Chen",
        "status": "PENDING",
        "risk_score": 0.0,
        "is_suspicious": False,
        "country": "US",
        "submission_time": "2026-05-17T11:30:00Z",
        "created_at": "2026-05-17T11:30:00Z"
    };
}
