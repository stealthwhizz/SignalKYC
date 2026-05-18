# models/edges.jac
edge used_by {
    has first_observed: str;
    has count: int = 1;
}

edge linked_to {
    has relationship_type: str;   # "same_person", "household", "fraud_ring"
    has strength: float = 0.5;
}

edge flagged_as {
    has reason: str;
    has timestamp: str;
}

edge part_of_cluster {
    has confidence: float;
}
