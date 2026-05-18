# walkers/decision.jac
# Produces final risk score, decision, and reasoning traces for frontend.
walker decision {
    has agent_memory: dict;   # output from FraudInvestigationAgent

    fn execute() -> dict {
        risk_score = compute_risk_score(agent_memory);
        decision = map_risk_to_decision(risk_score);
        confidence = compute_confidence(agent_memory);

        # Build reasoning steps and fraud signals
        reasoning_steps = [];
        fraud_signals = [];
        graph_highlights = [];

        for step in agent_memory.steps {
            reasoning_steps.append(step.reasoning);
            if (step.suspicious_found) {
                fraud_signals.append(step.step_name);
            }
            graph_highlights.extend(step.node_ids);
        }
        for finding in agent_memory.suspicious_findings {
            fraud_signals.append(finding.type);
        }

        return {
            "userId": agent_memory.user_id,
            "riskScore": risk_score,
            "decision": decision,
            "confidence": confidence,
            "reasoningSteps": reasoning_steps,
            "graphHighlights": graph_highlights,
            "fraudSignals": fraud_signals
        };
    }

    fn compute_risk_score(memory: dict) -> float {
        base = 20.0;  # starting low risk
        # Increase based on suspicious findings
        for step in memory.steps {
            if (step.suspicious_found) {
                base += 15.0;
            }
        }
        for finding in memory.suspicious_findings {
            if (finding.type == "historical_cluster") {
                base += finding.risk_increase * 30.0;
            }
        }
        # Cap at 100
        if (base > 100) base = 100;
        return base;
    }

    fn map_risk_to_decision(risk: float) -> str {
        if (risk < 40) return "APPROVE";
        elif (risk < 70) return "STEP_UP";
        else return "MANUAL_REVIEW";
    }

    fn compute_confidence(memory: dict) -> float {
        # Simple heuristic: more steps = more confidence?
        conf = 0.7 + (memory.steps.length * 0.05);
        if (conf > 0.98) conf = 0.98;
        return conf;
    }
}
