# walkers/build_graph.jac
# This walker is called by ingest_signup. It ensures all entities are
# represented as nodes and creates edges. It also links to historical data.
walker build_graph {
    has input: dict;   # expected keys: user_id, email, phone, device_fp, ip, doc_metadata?

    # Entry point
    fn execute() -> dict {
        # Get or create nodes
        user_node = get_or_create_user(input.user_id);
        email_node = get_or_create_email(input.email);
        phone_node = get_or_create_phone(input.phone);
        device_node = get_or_create_device(input.device_fp);
        ip_node = get_or_create_ip(input.ip);

        # Create edges from user to each entity
        create_or_update_edge(user_node, email_node, "used_by", 1);
        create_or_update_edge(user_node, phone_node, "used_by", 1);
        create_or_update_edge(user_node, device_node, "used_by", 1);
        create_or_update_edge(user_node, ip_node, "used_by", 1);

        # Check for existing suspicious links
        suspicious_links = detect_suspicious_links(user_node);
        return {
            "user_id": user_node.id,
            "suspicious_links": suspicious_links,
            "graph_updated": true
        };
    }

    fn get_or_create_user(user_id: str) -> node {
        # Search for existing User node with same id
        users = std.get_nodes("User", {"id": user_id});
        if (users.length > 0) return users[0];
        else {
            node new_user : User {
                id = user_id;
                created_at = std.time_now();
            }
            return new_user;
        }
    }

    # Similar functions for email, phone, device, ip (simplified for brevity)
    fn get_or_create_email(email_addr: str) -> node {
        nodes = std.get_nodes("Email", {"address": email_addr});
        if (nodes.length > 0) return nodes[0];
        else {
            node new_email : Email {
                address = email_addr;
                first_seen = std.time_now();
                # Mark suspicious if email domain is in blacklist (simulate)
                if (email_addr.contains("fraudmail.com") || email_addr.contains("tempmail")) {
                    new_email.is_suspicious = true;
                }
            }
            return new_email;
        }
    }

    fn get_or_create_phone(phone_num: str) -> node {
        nodes = std.get_nodes("Phone", {"number": phone_num});
        if (nodes.length > 0) return nodes[0];
        else {
            node new_phone : Phone { number = phone_num; first_seen = std.time_now(); }
            return new_phone;
        }
    }

    fn get_or_create_device(fingerprint: str) -> node {
        nodes = std.get_nodes("Device", {"fingerprint": fingerprint});
        if (nodes.length > 0) return nodes[0];
        else {
            node new_device : Device { fingerprint = fingerprint; first_seen = std.time_now(); }
            return new_device;
        }
    }

    fn get_or_create_ip(ip_addr: str) -> node {
        nodes = std.get_nodes("IP", {"address": ip_addr});
        if (nodes.length > 0) return nodes[0];
        else {
            node new_ip : IP { address = ip_addr; first_seen = std.time_now(); }
            return new_ip;
        }
    }

    fn create_or_update_edge(src: node, tgt: node, edge_type: str, weight: int) {
        # Check if edge already exists
        existing = std.get_edges(src, tgt, edge_type);
        if (existing.length > 0) {
            existing[0].count += 1;
        } else {
            edge e : used_by { first_observed = std.time_now(); count = 1; }
            src -[e]-> tgt;
        }
    }

    fn detect_suspicious_links(user_node: node) -> list {
        suspicious = [];
        # Walk all outgoing edges
        for neighbor in user_node -[used_by]-> node {
            if (neighbor.is_suspicious) {
                suspicious.append({
                    "node_type": neighbor.__class__,
                    "node_id": neighbor.id,
                    "reason": "previously marked suspicious"
                });
            }
            # Also check if neighbor belongs to a fraud cluster
            clusters = std.get_edges(neighbor, "part_of_cluster");
            for cl_edge in clusters {
                suspicious.append({
                    "node_type": neighbor.__class__,
                    "node_id": neighbor.id,
                    "reason": "member of fraud cluster " + cl_edge.target.cluster_id
                });
            }
        }
        return suspicious;
    }
}
