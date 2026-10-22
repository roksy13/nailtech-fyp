package com.nailtech.infrastructure.persistence.firestore;

import com.google.cloud.NoCredentials;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.nailtech.application.usecase.EnsureUserProfileUseCase;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@EnabledIfEnvironmentVariable(
        named = "FIRESTORE_EMULATOR_HOST",
        matches = ".+"
)
class FirestoreUserProfileRepositoryTest {

    private static Firestore firestore;

    private FirestoreUserProfileRepository repository;
    private EnsureUserProfileUseCase useCase;
    private String uid;

    @BeforeAll
    static void connectToEmulator() {
        String host = System.getenv("FIRESTORE_EMULATOR_HOST");

        if (!host.matches("(localhost|127\\.0\\.0\\.1):\\d+")) {
            throw new IllegalStateException(
                    "These tests require a local Firestore emulator."
            );
        }

        firestore = FirestoreOptions.newBuilder()
                .setProjectId("demo-nailhq-tests")
                .setEmulatorHost(host)
                .setCredentials(NoCredentials.getInstance())
                .build()
                .getService();
    }

    @AfterAll
    static void closeFirestore() throws Exception {
        if (firestore != null) {
            firestore.close();
        }
    }

    @BeforeEach
    void setUp() {
        uid = "test-" + UUID.randomUUID();
        repository = new FirestoreUserProfileRepository(firestore);
        useCase = new EnsureUserProfileUseCase(repository);
    }

    @AfterEach
    void removeTestProfile() throws Exception {
        firestore.collection("users")
                .document(uid)
                .delete()
                .get(10, TimeUnit.SECONDS);
    }

    @Test
    void createsClientProfileInFirestore() throws Exception {
        var result = useCase.execute(uid);

        var document = firestore.collection("users")
                .document(uid)
                .get()
                .get(10, TimeUnit.SECONDS);

        assertTrue(document.exists());
        assertEquals(uid, result.uid());
        assertEquals("CLIENT", document.getString("role"));
        assertNotNull(document.getTimestamp("createdAt"));
    }

    @Test
    void repeatedCreationKeepsOriginalCreationDate() throws Exception {
        useCase.execute(uid);

        var reference = firestore.collection("users").document(uid);
        var first = reference.get().get(10, TimeUnit.SECONDS);

        useCase.execute(uid);

        var second = reference.get().get(10, TimeUnit.SECONDS);

        assertEquals(
                first.getTimestamp("createdAt"),
                second.getTimestamp("createdAt")
        );
    }

    @Test
    void existingOwnerRoleAndProfileArePreserved() throws Exception {
        Timestamp originalCreatedAt =
                Timestamp.ofTimeSecondsAndNanos(1_700_000_000L, 0);

        var reference = firestore.collection("users").document(uid);

        reference.set(Map.of(
                "displayName", "Business owner",
                "phone", "",
                "role", "OWNER",
                "createdAt", originalCreatedAt
        )).get(10, TimeUnit.SECONDS);

        var result = useCase.execute(uid);
        var document = reference.get().get(10, TimeUnit.SECONDS);

        assertEquals("OWNER", result.role());
        assertEquals("Business owner", result.displayName());
        assertEquals("OWNER", document.getString("role"));
        assertEquals(
                originalCreatedAt,
                document.getTimestamp("createdAt")
        );
    }
}