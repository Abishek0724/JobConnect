package com.jobconnect.backend.service.interf;

public interface ApplicationService {
    void applyForJob(Long jobId, String candidateEmail);

    void updateApplicationStatus(Long applicationId, String status);
}
