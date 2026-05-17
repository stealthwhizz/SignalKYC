"""
Walkers for SignalKYC investigation flow.
Each walker handles a specific phase of the investigation.
"""

import:jac {
    models,
    signals
}

walker ingestion_walker {
    """Ingest new applicant case, create/update graph entities"""
    
    has app_data: dict;
    
    : here : {
        applicant = app_data["applicant"];
        
        if not applicant {
            return;
        }
        
        applicant_id = applicant["applicant_id"];
        app_node = applicant_node;
        
        if not app_node {
            app_node = Applicant(
                applicant_id=applicant_id,
                full_name=applicant["full_name"],
                status="PENDING",
                submission_time=applicant.get("submission_time", ""),
                country=applicant.get("country", ""),
                created_at=applicant.get("created_at", ""),
                risk_score=0.0,
                is_suspicious=False
            );
        }
        
        if "email" in applicant {
            email_addr = applicant["email"];
            email_node = Email(
                email=email_addr,
                email_domain=email_addr.split("@")[1] if "@" in email_addr else "",
                is_disposable=signals.is_disposable_email(email_addr),
                usage_count=0,
                created_at=applicant.get("created_at", "")
            );
            app_node --[uses_email(discovered_at=applicant.get("created_at", ""))]-> email_node;
        }
        
        if "phone" in applicant {
            phone = applicant["phone"];
            phone_node = Phone(
                phone=phone,
                country_code=applicant.get("phone_country", ""),
                usage_count=0,
                created_at=applicant.get("created_at", "")
            );
            app_node --[uses_phone(discovered_at=applicant.get("created_at", ""))]-> phone_node;
        }
        
        if "device_id" in applicant {
            device_id = applicant["device_id"];
            device_node = Device(
                device_id=device_id,
                device_type=applicant.get("device_type", "unknown"),
                device_fingerprint=applicant.get("device_fingerprint", ""),
                usage_count=0,
                created_at=applicant.get("created_at", "")
            );
            app_node --[uses_device(discovered_at=applicant.get("created_at", ""))]-> device_node;
        }
        
        if "ip_address" in applicant {
            ip_addr = applicant["ip_address"];
            ip_node = IPAddress(
                ip_address=ip_addr,
                country=applicant.get("ip_country", ""),
                isp=applicant.get("isp", "unknown"),
                submission_count=0,
                last_seen=applicant.get("created_at", ""),
                created_at=applicant.get("created_at", "")
            );
            app_node --[seen_from_ip(request_count=1, discovered_at=applicant.get("created_at", ""))]-> ip_node;
        }
        
        if "document_id" in applicant {
            doc_id = applicant["document_id"];
            doc_node = Document(
                document_id=doc_id,
                doc_type=applicant.get("doc_type", ""),
                doc_country=applicant.get("doc_country", ""),
                usage_count=0,
                created_at=applicant.get("created_at", "")
            );
            app_node --[submitted_document(discovered_at=applicant.get("created_at", ""))]-> doc_node;
        }
    }
}

walker linking_walker {
    """Link related entities and identify shared signals"""
    
    : here : {
        if here.node_type() == "Applicant" {
            app = here;
            
            outgoing_edges = app.get_outgoing_edges();
            
            for edge in outgoing_edges {
                target = edge.target();
                
                if target.node_type() == "Email" {
                    other_apps = target.get_incoming_edges();
                    for other_edge in other_apps {
                        if other_edge.source().node_type() == "Applicant" and other_edge.source() != app {
                            app --[shares_signal_with(
                                signal_type="email",
                                strength=0.8,
                                discovered_at=""
                            )]--> other_edge.source();
                        }
                    }
                }
                
                if target.node_type() == "Device" {
                    other_apps = target.get_incoming_edges();
                    for other_edge in other_apps {
                        if other_edge.source().node_type() == "Applicant" and other_edge.source() != app {
                            app --[shares_signal_with(
                                signal_type="device",
                                strength=0.9,
                                discovered_at=""
                            )]--> other_edge.source();
                        }
                    }
                }
                
                if target.node_type() == "Phone" {
                    other_apps = target.get_incoming_edges();
                    for other_edge in other_apps {
                        if other_edge.source().node_type() == "Applicant" and other_edge.source() != app {
                            app --[shares_signal_with(
                                signal_type="phone",
                                strength=0.9,
                                discovered_at=""
                            )]--> other_edge.source();
                        }
                    }
                }
            }
        }
    }
}

walker risk_evaluation_walker {
    """Fire all risk signals and accumulate evidence"""
    
    has triggered_signals: list[str] = [];
    has signal_evidence: dict = {};
    has risk_score: float = 0.0;
    
    : here : {
        if here.node_type() == "Applicant" {
            app = here;
            
            outgoing_edges = app.get_outgoing_edges();
            
            for edge in outgoing_edges {
                target = edge.target();
                
                if target.node_type() == "Device" {
                    is_risky, evidence = signals.check_device_reuse(target);
                    if is_risky {
                        triggered_signals.append("DEVICE_REUSE");
                        signal_evidence["DEVICE_REUSE"] = evidence;
                    }
                }
                
                if target.node_type() == "Phone" {
                    is_risky, evidence = signals.check_shared_phone(target);
                    if is_risky {
                        triggered_signals.append("SHARED_PHONE");
                        signal_evidence["SHARED_PHONE"] = evidence;
                    }
                }
                
                if target.node_type() == "Email" {
                    is_risky_email, evidence_email = signals.check_shared_email(target);
                    is_risky_pattern, evidence_pattern = signals.check_email_pattern(target);
                    
                    if is_risky_email {
                        triggered_signals.append("SHARED_EMAIL");
                        signal_evidence["SHARED_EMAIL"] = evidence_email;
                    }
                    
                    if is_risky_pattern {
                        triggered_signals.append("EMAIL_PATTERN");
                        signal_evidence["EMAIL_PATTERN"] = evidence_pattern;
                    }
                }
                
                if target.node_type() == "IPAddress" {
                    is_risky, evidence = signals.check_ip_burst(target);
                    if is_risky {
                        triggered_signals.append("IP_BURST");
                        signal_evidence["IP_BURST"] = evidence;
                    }
                }
                
                if target.node_type() == "Document" {
                    is_risky, evidence = signals.check_document_reuse(target);
                    if is_risky {
                        triggered_signals.append("DOCUMENT_REUSE");
                        signal_evidence["DOCUMENT_REUSE"] = evidence;
                    }
                }
            }
            
            is_risky, evidence = signals.check_session_burst(app);
            if is_risky {
                triggered_signals.append("SESSION_BURST");
                signal_evidence["SESSION_BURST"] = evidence;
            }
            
            if len(triggered_signals) >= 3 {
                is_risky, evidence = signals.check_signal_stacking(len(triggered_signals));
                if is_risky {
                    triggered_signals.append("SIGNAL_STACKING");
                    signal_evidence["SIGNAL_STACKING"] = evidence;
                }
            }
            
            risk_score, risk_level = signals.calculate_total_risk(triggered_signals);
            app.risk_score = risk_score;
        }
    }
}

walker investigation_walker {
    """Traverse suspicious relationships to find connected risks"""
    
    has visited: set[str] = set();
    has connected_risks: list[dict] = [];
    
    : here : {
        if here.node_type() == "Applicant" {
            app_id = here.applicant_id;
            
            if app_id in visited {
                return;
            }
            visited.add(app_id);
            
            outgoing_edges = here.get_outgoing_edges();
            
            for edge in outgoing_edges {
                if edge.edge_type() == "shares_signal_with" {
                    other_app = edge.target();
                    if other_app.node_type() == "Applicant" {
                        connected_risks.append({
                            "applicant_id": other_app.applicant_id,
                            "risk_score": other_app.risk_score,
                            "shared_signal": edge.signal_type,
                            "strength": edge.strength
                        });
                    }
                }
            }
        }
    }
}

walker memory_walker {
    """Find similar historical cases"""
    
    has similar_cases: list[dict] = [];
    
    : here : {
        if here.node_type() == "Applicant" {
            app = here;
            
            app_risk_signals = [];
            outgoing_edges = app.get_outgoing_edges();
            for edge in outgoing_edges {
                if edge.edge_type() == "triggered_event" {
                    target = edge.target();
                    if target.node_type() == "RiskEvent" {
                        app_risk_signals.append(target.rule_code);
                    }
                }
            }
            
            # In a real system, would query historical database
            # For MVP, this demonstrates the memory lookup concept
        }
    }
}

walker decision_walker {
    """Final decision maker"""
    
    has recommendation: str = "APPROVE";
    has confidence: float = 0.0;
    has explanation: str = "";
    
    : here : {
        if here.node_type() == "Applicant" {
            app = here;
            
            triggered_signals = [];
            outgoing_edges = app.get_outgoing_edges();
            
            for edge in outgoing_edges {
                if edge.edge_type() == "triggered_event" {
                    target = edge.target();
                    if target.node_type() == "RiskEvent" {
                        triggered_signals.append(target.rule_code);
                    }
                }
            }
            
            risk_score, risk_level = signals.calculate_total_risk(triggered_signals);
            
            # Simplified historical matching for MVP
            historical_matches = 0;
            
            recommendation = signals.recommend_decision(risk_level, triggered_signals, historical_matches);
            confidence = min(0.5 + (risk_score / 20.0), 1.0);
            
            if recommendation == "APPROVE" {
                explanation = "All risk signals are within acceptable thresholds.";
            } elif recommendation == "STEP_UP_VERIFICATION" {
                explanation = "Medium risk detected. Additional verification recommended.";
            } else {
                explanation = "High-risk signals triggered. Manual review required.";
            }
            
            decision = Decision(
                decision_id="dec_" + app.applicant_id,
                recommendation=recommendation,
                confidence=confidence,
                risk_score=risk_score,
                explanation=explanation,
                triggered_signals=triggered_signals,
                timestamp=""
            );
            
            app --[decided_as(timestamp="")]-> decision;
        }
    }
}
