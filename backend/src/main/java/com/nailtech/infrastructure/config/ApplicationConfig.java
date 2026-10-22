package com.nailtech.infrastructure.config;

/**
 * Registers application use cases as Spring beans and connects them to repository implementations through interfaces
 */

import com.nailtech.application.usecase.EnsureUserProfileUseCase;
import com.nailtech.domain.repository.UserProfileRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    @Bean
    public EnsureUserProfileUseCase ensureUserProfileUseCase(
            UserProfileRepository repository
    ) {
        return new EnsureUserProfileUseCase(repository);
    }
}