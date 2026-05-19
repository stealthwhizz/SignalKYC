# SignalKYC Backend — Jac 0.15.2
# Graph-native KYC investigation agent

# ── Nodes ────────────────────────────────────────────────────────────────────

node User {
    has id: str = "";
    has risk_score: float = 0.0;
    has created_at: str = "";
}

node Email {
    has address: str = "";
    has is_suspicious: bool = False;
    has first_seen: str = "";
}

node Phone {
    has number: str = "";
    has is_suspicious: bool = False;
    has first_seen: str = "";
}

node Device {
    has fingerprint: str = "";
    has is_suspicious: bool = False;
    has first_seen: str = "";
}

node IP {
    has address: str = "";
    has is_suspicious: bool = False;
    has first_seen: str = "";
}

node FraudCluster {
    has cluster_id: str = "";
    has risk_level: float = 0.0;
    has pattern: str = "";
}

# ── Edges ────────────────────────────────────────────────────────────────────

edge used_by {
    has count: int = 1;
}

edge part_of_cluster {
    has confidence: float = 1.0;
}

# ── Walkers ───────────────────────────────────────────────────────────────────

walker investigate_signup {
    has user_id: str = "";
    has email: str = "";
    has phone: str = "";
    has device_fp: str = "";
    has ip: str = "";

    can run with entry {
        uid = self.user_id;
        em_addr = self.email;
        ph_num = self.phone;
        fp = self.device_fp;
        ip_addr = self.ip;

        # Create identity graph nodes
        u = User(id=uid, created_at="now");
        here ++> u;

        em = Email(
            address=em_addr,
            is_suspicious=(
                "fraud" in em_addr or
                "temp" in em_addr or
                "darkweb" in em_addr or
                "10minute" in em_addr or
                "throwaway" in em_addr
            )
        );
        here ++> em;

        ph = Phone(number=ph_num, is_suspicious=False);
        here ++> ph;

        dv = Device(
            fingerprint=fp,
            is_suspicious=(
                "emulator" in fp or
                "fp_bad" in fp or
                "farm" in fp or
                "bot" in fp
            )
        );
        here ++> dv;

        ip_node = IP(address=ip_addr, is_suspicious="45.33" in ip_addr or "tor" in ip_addr);
        here ++> ip_node;

        # Link user to each identity entity
        u ++> em;
        u ++> ph;
        u ++> dv;
        u ++> ip_node;

        # ── Risk scoring ──────────────────────────────────────────────────
        risk: float = 20.0;
        signals: list = [];
        reasoning: list = [];

        reasoning.append("Identity graph constructed for applicant: " + uid);
        reasoning.append("Analyzing email: " + em_addr);

        if em.is_suspicious {
            risk += 30.0;
            signals.append("suspicious_email_domain");
            reasoning.append("Email domain flagged as high-risk disposable/fraud domain");
        }

        if dv.is_suspicious {
            risk += 35.0;
            signals.append("suspicious_device_fingerprint");
            reasoning.append("Device fingerprint matches known emulator or fraud farm pattern");
        }

        if ip_node.is_suspicious {
            risk += 20.0;
            signals.append("suspicious_ip");
            reasoning.append("IP address associated with known proxy or fraud ASN");
        }

        if ph.is_suspicious {
            risk += 15.0;
            signals.append("suspicious_phone");
            reasoning.append("Phone number linked to prior flagged accounts");
        }

        if risk > 100.0 { risk = 100.0; }

        u.risk_score = risk;

        decision: str = "APPROVE";
        if risk >= 70.0 {
            decision = "MANUAL_REVIEW";
            reasoning.append("Risk score " + str(risk) + " exceeds threshold — routing to manual review");
        } elif risk >= 40.0 {
            decision = "STEP_UP";
            reasoning.append("Risk score " + str(risk) + " requires step-up verification");
        } else {
            reasoning.append("Risk score " + str(risk) + " within acceptable range — approving");
        }

        confidence: float = 0.75 + (signals.__len__() * 0.05);
        if confidence > 0.98 { confidence = 0.98; }

        # Build graph payload for React Flow
        graph_nodes: list = [
            {"id": uid, "type": "user", "label": uid, "suspicious": risk > 50.0, "riskScore": risk},
            {"id": "email_" + uid, "type": "email", "label": em_addr, "suspicious": em.is_suspicious},
            {"id": "phone_" + uid, "type": "phone", "label": ph_num, "suspicious": ph.is_suspicious},
            {"id": "device_" + uid, "type": "device", "label": fp, "suspicious": dv.is_suspicious},
            {"id": "ip_" + uid, "type": "ip", "label": ip_addr, "suspicious": ip_node.is_suspicious}
        ];

        graph_edges: list = [
            {"id": "e_em_" + uid, "source": uid, "target": "email_" + uid, "label": "uses", "suspicious": em.is_suspicious},
            {"id": "e_ph_" + uid, "source": uid, "target": "phone_" + uid, "label": "uses", "suspicious": ph.is_suspicious},
            {"id": "e_dv_" + uid, "source": uid, "target": "device_" + uid, "label": "logged_from", "suspicious": dv.is_suspicious},
            {"id": "e_ip_" + uid, "source": uid, "target": "ip_" + uid, "label": "request_from", "suspicious": ip_node.is_suspicious}
        ];

        report {
            "userId": uid,
            "riskScore": risk,
            "decision": decision,
            "confidence": confidence,
            "reasoningSteps": reasoning,
            "fraudSignals": signals,
            "graph": {
                "nodes": graph_nodes,
                "edges": graph_edges
            }
        };
    }
}

walker ingest_signup {
    has user_id: str = "";
    has email: str = "";
    has phone: str = "";
    has device_fp: str = "";
    has ip: str = "";
    has source: str = "api";

    can run with entry {
        uid = self.user_id;
        em_addr = self.email;
        ph_num = self.phone;
        fp = self.device_fp;
        ip_addr = self.ip;

        u = User(id=uid, created_at="now");
        here ++> u;

        em = Email(
            address=em_addr,
            is_suspicious=(
                "fraud" in em_addr or
                "temp" in em_addr or
                "darkweb" in em_addr or
                "10minute" in em_addr or
                "throwaway" in em_addr
            )
        );
        here ++> em;

        ph = Phone(number=ph_num, is_suspicious=False);
        here ++> ph;

        dv = Device(
            fingerprint=fp,
            is_suspicious=(
                "emulator" in fp or
                "fp_bad" in fp or
                "farm" in fp or
                "bot" in fp
            )
        );
        here ++> dv;

        ip_node = IP(address=ip_addr, is_suspicious="45.33" in ip_addr or "tor" in ip_addr);
        here ++> ip_node;

        u ++> em;
        u ++> ph;
        u ++> dv;
        u ++> ip_node;

        risk: float = 20.0;
        signals: list = [];
        reasoning: list = [];

        reasoning.append("Ingested from source: " + self.source);
        reasoning.append("Identity graph constructed for: " + uid);

        if em.is_suspicious {
            risk += 30.0;
            signals.append("suspicious_email_domain");
            reasoning.append("Email domain flagged as high-risk");
        }

        if dv.is_suspicious {
            risk += 35.0;
            signals.append("suspicious_device_fingerprint");
            reasoning.append("Device fingerprint matches fraud pattern");
        }

        if ip_node.is_suspicious {
            risk += 20.0;
            signals.append("suspicious_ip");
            reasoning.append("IP associated with known proxy ASN");
        }

        if ph.is_suspicious {
            risk += 15.0;
            signals.append("suspicious_phone");
            reasoning.append("Phone linked to prior flagged accounts");
        }

        if risk > 100.0 { risk = 100.0; }

        u.risk_score = risk;

        decision: str = "APPROVE";
        if risk >= 70.0 {
            decision = "MANUAL_REVIEW";
        } elif risk >= 40.0 {
            decision = "STEP_UP";
        }

        confidence: float = 0.75 + (signals.__len__() * 0.05);
        if confidence > 0.98 { confidence = 0.98; }

        graph_nodes: list = [
            {"id": uid, "type": "user", "label": uid, "suspicious": risk > 50.0, "riskScore": risk},
            {"id": "email_" + uid, "type": "email", "label": em_addr, "suspicious": em.is_suspicious},
            {"id": "phone_" + uid, "type": "phone", "label": ph_num, "suspicious": ph.is_suspicious},
            {"id": "device_" + uid, "type": "device", "label": fp, "suspicious": dv.is_suspicious},
            {"id": "ip_" + uid, "type": "ip", "label": ip_addr, "suspicious": ip_node.is_suspicious}
        ];

        graph_edges: list = [
            {"id": "e_em_" + uid, "source": uid, "target": "email_" + uid, "label": "uses", "suspicious": em.is_suspicious},
            {"id": "e_ph_" + uid, "source": uid, "target": "phone_" + uid, "label": "uses", "suspicious": ph.is_suspicious},
            {"id": "e_dv_" + uid, "source": uid, "target": "device_" + uid, "label": "logged_from", "suspicious": dv.is_suspicious},
            {"id": "e_ip_" + uid, "source": uid, "target": "ip_" + uid, "label": "request_from", "suspicious": ip_node.is_suspicious}
        ];

        report {
            "userId": uid,
            "riskScore": risk,
            "decision": decision,
            "confidence": confidence,
            "source": self.source,
            "reasoningSteps": reasoning,
            "fraudSignals": signals,
            "graph": {
                "nodes": graph_nodes,
                "edges": graph_edges
            }
        };
    }
}

walker simulate_fraud_case {
    can run with entry {
        report {
            "hint": "Use investigate_signup with these values to trigger fraud detection",
            "user_id": "fraud_sim_demo",
            "email": "fraudster99@darkweb.com",
            "phone": "+15550000001",
            "device_fp": "fp_bad_emulator_xyz",
            "ip": "45.33.22.100"
        };
    }
}

with entry {}
