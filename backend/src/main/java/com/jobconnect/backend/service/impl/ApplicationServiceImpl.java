package com.jobconnect.backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.jobconnect.backend.entity.Application;
import com.jobconnect.backend.entity.CandidateProfile;
import com.jobconnect.backend.entity.Job;
import com.jobconnect.backend.entity.User;
import com.jobconnect.backend.enums.ApplicationStatus;
import com.jobconnect.backend.repository.ApplicationRepository;
import com.jobconnect.backend.repository.JobRepository;
import com.jobconnect.backend.repository.UserRepository;
import com.jobconnect.backend.service.interf.ApplicationService;
import com.jobconnect.backend.service.interf.MailService;
import com.jobconnect.backend.service.interf.SmsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final SmsService smsService;

    @Override
    public void applyForJob(Long jobId, String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .build();

        applicationRepository.save(application);

        CandidateProfile profile = candidate.getCandidateProfile();
        if (profile == null) {
            log.error("Candidate profile not found for user: {}", candidate.getUsername());
            return;
        }

        String email = profile.getEmail();
        String phone = profile.getPhone();
        String name = profile.getFullName();

        log.info("Notifying candidate {} via email and SMS", name);

        try {
            if (email != null && !email.isBlank()) {
                mailService.sendEmail(
                        email,
                        "Application Submitted",
                        "Hi " + name + ",\n\nYou have successfully applied for the job: " + job.getTitle());
            } else {
                log.warn("Email is null or empty for user: {}", candidate.getUsername());
            }
        } catch (Exception e) {
            log.error("Email failed to {}: {}", email, e.getMessage());
        }

        try {
            if (phone != null && !phone.isBlank()) {
                smsService.sendSms(
                        phone,
                        "JobConnect: You've applied to " + job.getTitle());
            } else {
                log.warn("Phone is null or empty for user: {}", candidate.getUsername());
            }
        } catch (Exception e) {
            log.error("SMS failed to {}: {}", phone, e.getMessage());
        }
    }

    @Override
    public void updateApplicationStatus(Long applicationId, String statusStr) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        ApplicationStatus status = ApplicationStatus.valueOf(statusStr.toUpperCase());
        app.setStatus(status);
        applicationRepository.save(app);

        User candidate = app.getCandidate();
        CandidateProfile profile = candidate.getCandidateProfile();

        if (profile == null) {
            log.error("Candidate profile missing for status update: user {}", candidate.getUsername());
            return;
        }

        String email = profile.getEmail();
        String phone = profile.getPhone();
        String name = profile.getFullName();
        String jobTitle = app.getJob().getTitle();

        String subject = "Application Status Update";
        String emailBody;
        String smsText;

        switch (status) {
            case SELECTED:
                emailBody = "Hi " + name + ",\n\nCongratulations! You have been SELECTED for the job: " + jobTitle;
                smsText = "JobConnect: You’ve been SELECTED for " + jobTitle;
                break;
            case REJECTED:
                emailBody = "Hi " + name + ",\n\nWe regret to inform you that you have been REJECTED for the job: "
                        + jobTitle;
                smsText = "JobConnect: Your application for " + jobTitle + " was REJECTED.";
                break;
            default:
                return;
        }

        try {
            if (email != null && !email.isBlank()) {
                mailService.sendEmail(email, subject, emailBody);
            } else {
                log.warn("Cannot send email: missing email for {}", name);
            }
        } catch (Exception e) {
            log.error("Email failed to {}: {}", email, e.getMessage());
        }

        try {
            if (phone != null && !phone.isBlank()) {
                smsService.sendSms(phone, smsText);
            } else {
                log.warn("Cannot send SMS: missing phone for {}", name);
            }
        } catch (Exception e) {
            log.error("SMS failed to {}: {}", phone, e.getMessage());
        }
    }
}
