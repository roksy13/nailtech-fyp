//Identity check endpoint

package com.nailtech.presentation.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public IdentityResponse me(Authentication authentication) {
        return new IdentityResponse(authentication.getName());
    }

    public record IdentityResponse(String uid) {
    }
}