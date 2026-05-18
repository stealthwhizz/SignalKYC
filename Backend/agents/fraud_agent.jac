# agents/fraud_agent.jac
# Agent that maintains internal memory (a dict) and performs graph exploration.
agent FraudInvestigationAgent {
    has memory: dict = {};   # stores findings, current hypothesis, visited nodes

    # Called to start a new investigation for a given user node.
    fn start_investigation(user_node: node) -> dict {
        memory = {
            "user_id": user_node.id,
            "steps": [],
            "visited_entities": [],
            "suspicious_findings": [],
            "current_hypothesis": null,
            "investigation_complete": false
        };
        # Step 1: collect immediate neighbors
        step1 = collect_neighbors(user_node);
        memory.steps.append(step1);
        memory.visited_entities.extend(step1.node_ids);

        # Step 2: if suspicious neighbor found, expand deeper
        if (step1.suspicious_found) {
            memory.current_hypothesis = "possible fraud ring";
            step2 = expand_suspicious_cluster(step1.suspicious_nodes);
            memory.steps.append(step2);
            memory.visited_entities.extend(step2.node_ids);
        }

        # Step 3: check for historical clusters (using memory from previous cases)
        step3 = check_cluster_matches(user_node);
        memory.steps.append(step3);
        if (step3.cluster_match) {
            memory.suspicious_findings.append({
                "type": "historical_cluster",
                "cluster_id": step3.cluster_id,
                "risk_increase": step3.risk_increase
            });
        }

        # Step 4: final synthesis and decision (to be done by decision walker)
        memory.investigation_complete = true;
        return memory;
    }

    # Helper walker inside agent (simulated as methods)
    fn collect_neighbors(user_node: node) -> dict {
        neighbors = [];
        suspicious_nodes = [];
        for neighbor in user_node -[used_by]-> node {
            neighbors.append(neighbor.id);
            if (neighbor.is_suspicious) {
                suspicious_nodes.append(neighbor.id);
            }
        }
        return {
            "step_name": "collect_neighbors",
            "node_ids": neighbors,
            "suspicious_found": suspicious_nodes.length > 0,
            "suspicious_nodes": suspicious_nodes,
            "reasoning": "Examining email, phone, device, IP linked to applicant."
        };
    }

    fn expand_suspicious_cluster(suspicious_node_ids: list) -> dict {
        # For each suspicious node, find its other connections
        extra_nodes = [];
        for sid in suspicious_node_ids {
            node n = std.get_node(sid);
            # Walk all outgoing edges (to find other users that share this entity)
            for other_user in n <-[used_by]- node(User) {
                if (other_user.id != memory.user_id) {
                    extra_nodes.append(other_user.id);
                }
            }
        }
        return {
            "step_name": "expand_suspicious_cluster",
            "node_ids": extra_nodes,
            "suspicious_found": true,
            "reasoning": "Suspicious device/email is used by other accounts – potential fraud ring."
        };
    }

    fn check_cluster_matches(user_node: node) -> dict {
        # Look for any of the user's entities that belong to a FraudCluster
        cluster_match = false;
        matched_cluster = null;
        risk_increase = 0.0;
        for neighbor in user_node -[used_by]-> node {
            clusters = std.get_edges(neighbor, "part_of_cluster");
            for cl_edge in clusters {
                cluster_match = true;
                matched_cluster = cl_edge.target.cluster_id;
                risk_increase = cl_edge.target.risk_level / 100.0;
                break;
            }
            if (cluster_match) break;
        }
        return {
            "step_name": "check_cluster_matches",
            "cluster_match": cluster_match,
            "cluster_id": matched_cluster,
            "risk_increase": risk_increase,
            "reasoning": "Applicant's device/email appears in historical fraud cluster."
        };
    }
}
