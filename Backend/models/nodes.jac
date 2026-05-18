# models/nodes.jac
node User {
    has id: str;
    has risk_score: float = 0.0;
    has created_at: str;  # ISO timestamp
}

node Email {
    has address: str;
    has is_suspicious: bool = false;
    has first_seen: str;
}

node Phone {
    has number: str;
    has is_suspicious: bool = false;
    has first_seen: str;
}

node Device {
    has fingerprint: str;
    has is_suspicious: bool = false;
    has first_seen: str;
}

node IP {
    has address: str;
    has is_suspicious: bool = false;
    has first_seen: str;
}

node FraudCluster {
    has cluster_id: str;
    has risk_level: float;       # 0-100
    has pattern: str;            # e.g., "device_reuse", "ip_rotation"
    has created_at: str;
}
