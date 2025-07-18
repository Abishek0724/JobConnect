package com.jobconnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String education;
    private String experience;
    private String skills;
    private String resumeUrl;
}