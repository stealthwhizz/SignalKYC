# utils/helpers.jac
# Utility functions used across walkers and agents.

fn calculate_risk_from_findings(findings: list) -> float {
    """
    findings: list of dicts, each with 'severity' (0-1) and 'weight' (default 1).
    Returns a risk score 0-100.
    """
    total_risk = 0.0
    for f in findings {
        severity = f.get('severity', 0.5);
        weight = f.get('weight', 1.0);
        total_risk += severity * weight * 20.0;
    }
    if (total_risk > 100.0) total_risk = 100.0;
    return total_risk;
}

fn get_suspicious_links(node: node) -> list {
    """Return list of suspicious entities directly connected to the given node."""
    suspicious = [];
    for neighbor in node -[used_by]-> node {
        if (neighbor.is_suspicious) {
            suspicious.append({
                "node_id": neighbor.id,
                "node_type": neighbor.__class__,
                "reason": "entity marked suspicious"
            });
        }
        # also check if neighbor belongs to fraud cluster
        clusters = std.get_edges(neighbor, "part_of_cluster");
        for c in clusters {
            suspicious.append({
                "node_id": neighbor.id,
                "node_type": neighbor.__class__,
                "reason": "member of fraud cluster: " + c.target.cluster_id
            });
        }
    }
    return suspicious;
}

fn format_timestamp(ts: str) -> str {
    """Format ISO timestamp for display (no-op, just returns as is for now)."""
    return ts;
}

fn now_iso() -> str {
    """Return current time in ISO format."""
    return std.time_now();
}

fn generate_case_id() -> str {
    """Generate a random case ID."""
    return "case_" + std.str_from_int(std.random_int(10000, 99999));
}
