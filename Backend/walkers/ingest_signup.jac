# walkers/ingest_signup.jac
# Dedicated walker to take raw signup data, create/update graph nodes and edges.
# Returns the user node and any suspicious links found.
walker ingest_signup {
    has input: dict;   # expects user_id, email, phone, device_fp, ip, [optional doc_metadata]

    fn execute() -> dict {
        # Helper functions (same as in build_graph.jac but self-contained for clarity)
        user_node = get_or_create_user(input.user_id);
        email_node = get_or_create_email(input.email);
        phone_node = get_or_create_phone(input.phone);
        device_node = get_or_create_device(input.device_fp);
        ip_node = get_or_create_ip(input.ip);

        # Create edges from user to each entity
        create_or_update_edge(user_node, email_node, "used_by");
        create_or_update_edge(user_node, phone_node, "used_by");
        create_or_update_edge(user_node, device_node, "used_by");
        create_or_update_edge(user_node, ip_node, "used_by");

        # Optional: handle KYC document metadata if provided
        if (input.has("doc_metadata")) {
            # For hackathon, just store as attribute on user node
            user_node.doc_metadata = input.doc_metadata;
        }

        # Detect suspicious links
        suspicious_links = get_suspicious_links(user_node);

        return {
            "user_id": user_node.id,
            "user_node": user_node,   # return the node object for further processing
            "suspicious_links": suspicious_links,
            "graph_updated": true
        };
    }

    # ---- Node getters (identical to build_graph) ----
    fn get_or_create_user(user_id: str) -> node {
        nodes = std.get_nodes("User", {"id": user_id});
        if (nodes.length > 0) return nodes[0];
        else {
            node new_user : User {
                id = user_id;
                created_at = std.time_now();
            }
            return new_user;
        }
    }

    fn get_or_create_email(email_addr: str) -> node {
        nodes = std.get_nodes("Email", {"address": email_addr});
        if (nodes.length > 0) return nodes[0];
        else {
            node new_email : Email {
                address = email_addr;
                first_seen = std.time_now();
                if (email_addr.contains("fraudmail.com") || email_addr.contains("tempmail") || email_addr.contains("10minutemail")) {
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

    fn create_or_update_edge(src: node, tgt: node, edge_type: str) {
        existing = std.get_edges(src, tgt, edge_type);
        if (existing.length > 0) {
            existing[0].count += 1;
        } else {
            edge e : used_by { first_observed = std.time_now(); count = 1; }
            src -[e]-> tgt;
        }
    }

    fn get_suspicious_links(user_node: node) -> list {
        suspicious = [];
        for neighbor in user_node -[used_by]-> node {
            if (neighbor.is_suspicious) {
                suspicious.append({
                    "node_type": neighbor.__class__,
                    "node_id": neighbor.id,
                    "reason": "previously marked suspicious"
                });
            }
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
