package com.nailtech.infrastructure.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.nailtech.HealthController;
import com.nailtech.domain.model.UserProfile;
import com.nailtech.domain.repository.UserProfileRepository;
import com.nailtech.presentation.controller.AuthController;
import com.nailtech.presentation.controller.OwnerDashboardController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

@SpringJUnitConfig(SecurityIntegrationTest.TestConfig.class)
@WebAppConfiguration
class SecurityIntegrationTest {

    @Configuration
    @EnableWebMvc
    @EnableWebSecurity
    @Import({
            SecurityConfig.class,
            HealthController.class,
            AuthController.class,
            OwnerDashboardController.class
    })
    static class TestConfig {
    }

    @MockitoBean
    private FirebaseAuth firebaseAuth;

    @MockitoBean
    private UserProfileRepository profiles;

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void healthCheckIsPublic() throws Exception {
        mvc.perform(get("/api/health"))
                .andExpect(status().isOk());

        verifyNoInteractions(firebaseAuth, profiles);
    }

    @Test
    void protectedEndpointRejectsMissingToken() throws Exception {
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidTokenIsRejected() throws Exception {
        when(firebaseAuth.verifyIdToken("invalid-token"))
                .thenThrow(mock(FirebaseAuthException.class));

        mvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(profiles);
    }

    @Test
    void malformedHeaderIsRejected() throws Exception {
        mvc.perform(get("/api/auth/me")
                        .header("Authorization", "Basic something"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(firebaseAuth, profiles);
    }

    @Test
    void verifiedUidComesFromTokenNotRequestParameters() throws Exception {
        authenticate("client-token", "real-client", "CLIENT");

        mvc.perform(get("/api/auth/me")
                        .param("uid", "someone-else")
                        .header("Authorization", "Bearer client-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uid").value("real-client"));

        verify(profiles).findByUid("real-client");
        verify(profiles, never()).findByUid("someone-else");
    }

    @Test
    void clientCannotAccessOwnerEndpoint() throws Exception {
        authenticate("client-token", "client-123", "CLIENT");

        mvc.perform(get("/api/owner/dashboard")
                        .header("Authorization", "Bearer client-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void ownerCanAccessOwnerEndpoint() throws Exception {
        authenticate("owner-token", "owner-123", "OWNER");

        mvc.perform(get("/api/owner/dashboard")
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Owner access verified."));
    }

    @Test
    void missingProfileDoesNotGrantOwnerAccess() throws Exception {
        authenticate("new-user-token", "new-user", null);

        mvc.perform(get("/api/owner/dashboard")
                        .header("Authorization", "Bearer new-user-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unknownRoleDoesNotGrantOwnerAccess() throws Exception {
        authenticate("unknown-role-token", "user-123", "ADMIN");

        mvc.perform(get("/api/owner/dashboard")
                        .header("Authorization", "Bearer unknown-role-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void repositoryFailureDoesNotGrantAccess() throws Exception {
        authenticate("owner-token", "owner-123", "OWNER");

        when(profiles.findByUid("owner-123"))
                .thenThrow(new IllegalStateException("Database unavailable"));

        mvc.perform(get("/api/owner/dashboard")
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isServiceUnavailable());
    }

    private void authenticate(
            String tokenValue,
            String uid,
            String role
    ) throws FirebaseAuthException {

        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getUid()).thenReturn(uid);
        when(firebaseAuth.verifyIdToken(tokenValue)).thenReturn(token);

        if (role == null) {
            when(profiles.findByUid(uid)).thenReturn(Optional.empty());
            return;
        }

        UserProfile profile = mock(UserProfile.class);
        when(profile.role()).thenReturn(role);
        when(profiles.findByUid(uid)).thenReturn(Optional.of(profile));
    }
}