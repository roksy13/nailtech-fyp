package com.nailtech.domain.repository;

/**
 * Defines profile storage operations without exposing details to the application's business logic
 */

import com.nailtech.domain.model.UserProfile;

import java.util.Optional;

public interface UserProfileRepository {

    Optional<UserProfile> findByUid(String uid);

    UserProfile createIfAbsent(UserProfile profile);
}