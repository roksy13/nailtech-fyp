package com.nailtech.application.usecase;

import com.nailtech.domain.model.UserProfile;
import com.nailtech.domain.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnsureUserProfileUseCaseTest {

    @Mock
    private UserProfileRepository repository;

    private EnsureUserProfileUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new EnsureUserProfileUseCase(repository);
    }

    @Test
    void newProfileUsesSuppliedUidAndClientRole() {
        when(repository.createIfAbsent(any(UserProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Instant before = Instant.now();

        UserProfile result = useCase.execute("client-123");

        Instant after = Instant.now();

        assertEquals("client-123", result.uid());
        assertEquals("CLIENT", result.role());
        assertEquals("", result.displayName());
        assertNotNull(result.createdAt());
        assertFalse(result.createdAt().isBefore(before));
        assertFalse(result.createdAt().isAfter(after));

        var captor = ArgumentCaptor.forClass(UserProfile.class);
        verify(repository).createIfAbsent(captor.capture());

        assertEquals("client-123", captor.getValue().uid());
        assertEquals("CLIENT", captor.getValue().role());
    }

    @Test
    void returnsExistingProfileProvidedByRepository() {
        UserProfile existingOwner = mock(UserProfile.class);

        when(repository.createIfAbsent(any(UserProfile.class)))
                .thenReturn(existingOwner);

        UserProfile result = useCase.execute("owner-123");

        assertSame(existingOwner, result);
    }
}