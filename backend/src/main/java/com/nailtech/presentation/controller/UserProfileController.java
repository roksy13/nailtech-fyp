package com.nailtech.presentation.controller;

/**
 * Exposes endpoints for creating and retrieving the authenticated user's profile.
 * Uses verified identity
 */

import com.nailtech.application.usecase.EnsureUserProfileUseCase;
import com.nailtech.domain.model.UserProfile;
import com.nailtech.domain.repository.UserProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@RestController
@RequestMapping("/api/me")
public class UserProfileController {

    private final EnsureUserProfileUseCase ensureProfile;
    private final UserProfileRepository repository;

    public UserProfileController(
            EnsureUserProfileUseCase ensureProfile,
            UserProfileRepository repository
    ) {
        this.ensureProfile = ensureProfile;
        this.repository = repository;
    }

    @PostMapping("/profile")
    public ProfileResponse createProfile(Authentication authentication) {
        return ProfileResponse.from(
                ensureProfile.execute(authentication.getName())
        );
    }

    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {
        UserProfile profile = repository
                .findByUid(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Profile not created"
                ));

        return ProfileResponse.from(profile);
    }

    public record ProfileResponse(
            String uid,
            String displayName,
            String role,
            Instant createdAt
    ) {
        static ProfileResponse from(UserProfile profile) {
            return new ProfileResponse(
                    profile.uid(),
                    profile.displayName(),
                    profile.role(),
                    profile.createdAt()
            );
        }
    }
}