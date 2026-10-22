package com.nailtech.infrastructure.security;

//Verifies the token rather than trusting a user id from react. firebase's admin sdk checks the id token's validity

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import com.nailtech.domain.repository.UserProfileRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;

public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;
    private final UserProfileRepository profiles;

    public FirebaseAuthenticationFilter(
            FirebaseAuth firebaseAuth,
            UserProfileRepository profiles
    ) {
        this.firebaseAuth = firebaseAuth;
        this.profiles = profiles;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!header.regionMatches(true, 0, "Bearer ", 0, 7)
                || header.substring(7).isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid authentication header"
            );
            return;
        }

        FirebaseToken token;

        try {
            token = firebaseAuth.verifyIdToken(header.substring(7).trim());
        } catch (FirebaseAuthException exception) {
            SecurityContextHolder.clearContext();

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired token"
            );
            return;
        }

        List<GrantedAuthority> authorities = List.of();

        try {
            var profile = profiles.findByUid(token.getUid());

            if (profile.isPresent()) {
                authorities = switch (profile.get().role()) {
                    case "OWNER" ->
                            List.of(new SimpleGrantedAuthority("ROLE_OWNER"));
                    case "CLIENT" ->
                            List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
                    default -> List.of();
                };
            }
        } catch (IllegalStateException exception) {
            SecurityContextHolder.clearContext();
            response.sendError(
                    HttpServletResponse.SC_SERVICE_UNAVAILABLE,
                    "Unable to check account permissions"
            );
            return;
        }

        var authentication =
                new UsernamePasswordAuthenticationToken(
                        token.getUid(),
                        null,
                        authorities
                );

        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        filterChain.doFilter(request, response);
    }
}
