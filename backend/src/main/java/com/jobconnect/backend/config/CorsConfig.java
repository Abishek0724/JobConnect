package com.jobconnect.backend.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow frontend origin
        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));

        // ✅ Allow common methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // ✅ Allow all headers
        config.setAllowedHeaders(Collections.singletonList("*"));

        // ✅ Allow sending cookies / Authorization headers
        config.setAllowCredentials(true);

        // ✅ Expose Authorization header
        config.setExposedHeaders(Collections.singletonList("Authorization"));

        // ✅ Preflight cache
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
