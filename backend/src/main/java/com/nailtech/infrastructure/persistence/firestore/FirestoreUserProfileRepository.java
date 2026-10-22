package com.nailtech.infrastructure.persistence.firestore;

//Implements profile persistence in Firestore, uses transaction to create missing profiles without overwriting existing profiles

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.nailtech.domain.model.UserProfile;
import com.nailtech.domain.repository.UserProfileRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Repository
public class FirestoreUserProfileRepository
        implements UserProfileRepository {

    private final Firestore firestore;

    public FirestoreUserProfileRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public Optional<UserProfile> findByUid(String uid) {
        try {
            var document = firestore.collection("users")
                    .document(uid)
                    .get()
                    .get(10, TimeUnit.SECONDS);

            return document.exists()
                    ? Optional.of(toProfile(document))
                    : Optional.empty();

        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Profile lookup interrupted", exception
            );
        } catch (ExecutionException | TimeoutException exception) {
            throw new IllegalStateException(
                    "Unable to load profile", exception
            );
        }
    }

    @Override
    public UserProfile createIfAbsent(UserProfile profile) {
        var reference = firestore.collection("users")
                .document(profile.uid());

        try {
            return firestore.runTransaction(transaction -> {
                var existing = transaction.get(reference).get();

                if (existing.exists()) {
                    return toProfile(existing);
                }

                var createdAt = Timestamp.ofTimeSecondsAndNanos(
                        profile.createdAt().getEpochSecond(),
                        profile.createdAt().getNano()
                );

                transaction.create(reference, Map.of(
                        "displayName", profile.displayName(),
                        "role", profile.role(),
                        "createdAt", createdAt
                ));

                return profile;
            }).get(10, TimeUnit.SECONDS);

        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Profile creation interrupted", exception
            );
        } catch (ExecutionException | TimeoutException exception) {
            throw new IllegalStateException(
                    "Unable to create profile", exception
            );
        }
    }

    private UserProfile toProfile(DocumentSnapshot document) {
        Timestamp createdAt = document.getTimestamp("createdAt");
        String displayName = document.getString("displayName");
        String role = document.getString("role");

        if (createdAt == null || displayName == null || role == null) {
            throw new IllegalStateException("Invalid stored profile");
        }

        return new UserProfile(
                document.getId(),
                displayName,
                role,
                Instant.ofEpochSecond(
                        createdAt.getSeconds(),
                        createdAt.getNanos()
                )
        );
    }
}