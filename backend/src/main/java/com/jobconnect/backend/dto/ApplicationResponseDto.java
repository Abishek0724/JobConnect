package com.jobconnect.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDto {
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String jobLocation;
    private String applicationStatus;
    private LocalDateTime appliedAt;
    private String candidateName;
    private String resumeUrl;
}
