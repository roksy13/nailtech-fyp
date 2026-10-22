package com.nailtech.domain.model;

/**
 * Represents a NailHQ user profile
 */

import java.time.Instant;

public record UserProfile(
        String uid,
        String displayName,
        String role,
        Instant createdAt
) {
}
