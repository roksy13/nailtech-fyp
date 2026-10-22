package com.nailtech.application.usecase;

/**
 * Creates a client profile when one doesn't exist or returns the existing profile
 */

import com.nailtech.domain.model.UserProfile;
import com.nailtech.domain.repository.UserProfileRepository;

import java.time.Instant;

public class EnsureUserProfileUseCase {

    private final UserProfileRepository repository;

    public EnsureUserProfileUseCase(UserProfileRepository repository) {
        this.repository = repository;
    }

    public UserProfile execute(String uid) {
        UserProfile newProfile = new UserProfile(
                uid,
                "",
                "CLIENT",
                Instant.now()
        );

        return repository.createIfAbsent(newProfile);
    }
}