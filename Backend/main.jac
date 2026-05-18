# main.jac
# Load all modules and optionally start a web server (using Jaseci's built-in serve)
import "models/nodes.jac";
import "models/edges.jac";
import "data/seed.jac";
import "walkers/build_graph.jac";
import "walkers/decision.jac";
import "walkers/memory.jac";
import "walkers/api_handlers.jac";
import "agents/fraud_agent.jac";

# Seed the graph with historical data if not already done
if (std.get_nodes("FraudCluster").length == 0) {
    seeder = spawn walker::init_seed();
    seeder.execute();
}

# Expose the API walkers as HTTP actions (assuming jaseci server)
# The actual exposure is done via `jsctl` command, but we'll just note.
