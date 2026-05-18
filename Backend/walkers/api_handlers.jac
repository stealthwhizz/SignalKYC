# walkers/api_handlers.jac
# Frontend-callable walkers
walker investigate_signup {
    has input: dict;   # expects { user_id, email, phone, device_fp, ip }

    fn execute() -> dict {
        # Step 1: build/update graph
        builder = spawn walker::build_graph(input);
        builder_result = builder.execute();

        # Step 2: get user node
        user_nodes = std.get_nodes("User", {"id": input.user_id});
        if (user_nodes.length == 0) {
            return {"error": "User not found after ingestion"};
        }
        user_node = user_nodes[0];

        # Step 3: launch fraud agent
        agent = spawn agent::FraudInvestigationAgent();
        agent_memory = agent.start_investigation(user_node);

        # Step 4: run decision walker
        decider = spawn walker::decision(agent_memory);
        result = decider.execute();

        # Step 5: update long-term memory asynchronously (don't block)
        mem_updater = spawn walker::update_memory(result, user_node);
        mem_updater.execute();

        return result;
    }
}

walker get_case {
    has case_id: str;  # this is the user_id

    fn execute() -> dict {
        # In a real system, we would store investigation results per user.
        # For simulation, we recompute a lightweight version.
        user_nodes = std.get_nodes("User", {"id": case_id});
        if (user_nodes.length == 0) return {"error": "Case not found"};
        user_node = user_nodes[0];

        # Quick agent run (use same logic but without updating memory again)
        agent = spawn agent::FraudInvestigationAgent();
        agent_memory = agent.start_investigation(user_node);
        decider = spawn walker::decision(agent_memory);
        return decider.execute();
    }
}

walker graph {
    has user_id: str;

    fn execute() -> dict {
        user_nodes = std.get_nodes("User", {"id": user_id});
        if (user_nodes.length == 0) return {"error": "User not found"};
        user_node = user_nodes[0];

        # Build a serializable graph for React Flow
        nodes_list = [];
        edges_list = [];

        # Add user node
        nodes_list.append({
            "id": user_node.id,
            "type": "user",
            "label": user_node.id,
            "suspicious": false,
            "riskScore": user_node.risk_score
        });

        # Traverse neighbors
        for neighbor in user_node -[used_by]-> node {
            nodes_list.append({
                "id": neighbor.id,
                "type": neighbor.__class__.lower(),
                "label": neighbor.address or neighbor.number or neighbor.fingerprint or neighbor.address,
                "suspicious": neighbor.is_suspicious,
                "riskScore": null
            });
            edges_list.append({
                "id": user_node.id + "_" + neighbor.id,
                "source": user_node.id,
                "target": neighbor.id,
                "label": "used_by",
                "suspicious": neighbor.is_suspicious
            });
        }
        return {"nodes": nodes_list, "edges": edges_list};
    }
}

walker simulate_fraud_case {
    fn execute() -> dict {
        # Generate a random high‑risk signup
        fake_id = "fraud_" + std.str_from_int(std.random_int(10000, 99999));
        fake_email = "fraudster" + std.str_from_int(std.random_int(1,999)) + "@darkweb.com";
        fake_phone = "+1555" + std.str_from_int(std.random_int(1000000, 9999999));
        fake_device = "fp_emulator_xyz";  # known suspicious
        fake_ip = "45.33.22." + std.str_from_int(std.random_int(10, 200));

        # Call investigate_signup with these parameters
        inv = spawn walker::investigate_signup({
            "user_id": fake_id,
            "email": fake_email,
            "phone": fake_phone,
            "device_fp": fake_device,
            "ip": fake_ip
        });
        return inv.execute();
    }
}
