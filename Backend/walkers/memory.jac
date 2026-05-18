# walkers/memory.jac
walker update_memory {
    has investigation_result: dict;  # final output from decision walker
    has user_node: node;

    fn execute() {
        # If decision was MANUAL_REVIEW and risk > 80, mark all entities as suspicious
        if (investigation_result.decision == "MANUAL_REVIEW" && investigation_result.riskScore > 80) {
            # Mark each linked entity as suspicious
            for neighbor in user_node -[used_by]-> node {
                neighbor.is_suspicious = true;
            }
            # Optionally create a new fraud cluster
            node new_cluster : FraudCluster {
                cluster_id = "cluster_" + user_node.id;
                risk_level = investigation_result.riskScore;
                pattern = "high_risk_manual_review";
                created_at = std.time_now();
            }
            # Link all entities to this cluster
            for neighbor in user_node -[used_by]-> node {
                edge e : part_of_cluster { confidence = 0.9; }
                neighbor -[e]-> new_cluster;
            }
        }
    }
}
