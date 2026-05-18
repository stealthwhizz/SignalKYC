# walkers/investigate.jac
# Core investigation walker. It orchestrates:
# - Building/updating the graph (via ingest_signup)
# - Running the autonomous fraud agent
# - Generating a decision
# - Updating long-term memory
# Returns the final result dict ready for the frontend.
walker investigate {
    has input: dict;   # same as ingest_signup input

    fn execute() -> dict {
        # Step 1: Ingest the signup and get the user node
        ingester = spawn walker::ingest_signup(input);
        ingest_result = ingester.execute();
        if (!ingest_result.graph_updated) {
            return {"error": "Ingestion failed"};
        }
        user_node = ingest_result.user_node;

        # Step 2: Run the fraud investigation agent
        agent = spawn agent::FraudInvestigationAgent();
        agent_memory = agent.start_investigation(user_node);

        # Step 3: Generate decision and reasoning
        decider = spawn walker::decision(agent_memory);
        decision_result = decider.execute();

        # Step 4: Update long-term memory (asynchronous, but we'll run it synchronously for simplicity)
        memory_updater = spawn walker::update_memory(decision_result, user_node);
        memory_updater.execute();

        # Return the final result (matches frontend contract)
        return {
            "userId": decision_result.userId,
            "riskScore": decision_result.riskScore,
            "decision": decision_result.decision,
            "confidence": decision_result.confidence,
            "reasoningSteps": decision_result.reasoningSteps,
            "graphHighlights": decision_result.graphHighlights,
            "fraudSignals": decision_result.fraudSignals
        };
    }
}
