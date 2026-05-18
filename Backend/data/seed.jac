# data/seed.jac
# Simulates historical fraud clusters, suspicious devices, etc.
walker init_seed {
    # Create 3 fraud clusters with different patterns
    cluster1 : FraudCluster {
        cluster_id = "cluster_phone_reuse";
        risk_level = 85.0;
        pattern = "multiple accounts same phone";
        created_at = "2025-01-01T00:00:00Z";
    }
    cluster2 : FraudCluster {
        cluster_id = "cluster_device_farm";
        risk_level = 95.0;
        pattern = "device shared across 50+ accounts";
        created_at = "2025-02-15T00:00:00Z";
    }
    cluster3 : FraudCluster {
        cluster_id = "cluster_ip_rotation";
        risk_level = 70.0;
        pattern = "fast IP switching from same ASN";
        created_at = "2025-03-10T00:00:00Z";
    }

    # Add a few suspicious devices (known bad fingerprints)
    device "fp_bad_android_123" : Device {
        fingerprint = "fp_bad_android_123";
        is_suspicious = true;
        first_seen = "2025-01-10T00:00:00Z";
    }
    device "fp_emulator_xyz" : Device {
        fingerprint = "fp_emulator_xyz";
        is_suspicious = true;
        first_seen = "2025-02-20T00:00:00Z";
    }

    # Link one device to cluster2
    .[device "fp_emulator_xyz"] --> part_of_cluster(cluster2, confidence=1.0);
}
