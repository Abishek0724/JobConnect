package com.jobconnect.backend.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jobconnect.backend.dto.ApplicationRequestDto;
import com.jobconnect.backend.dto.ApplicationResponseDto;
import com.jobconnect.backend.dto.CandidateProfileDto;
import com.jobconnect.backend.dto.JobPostDto;
import com.jobconnect.backend.entity.Application;
import com.jobconnect.backend.entity.CandidateProfile;
import com.jobconnect.backend.entity.Job;
import com.jobconnect.backend.entity.User;
import com.jobconnect.backend.enums.ApplicationStatus;
import com.jobconnect.backend.repository.ApplicationRepository;
import com.jobconnect.backend.repository.CandidateProfileRepository;
import com.jobconnect.backend.repository.JobRepository;
import com.jobconnect.backend.repository.UserRepository;
import com.jobconnect.backend.service.interf.CandidateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateProfileRepository profileRepo;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepo;
    private final Cloudinary cloudinary;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ApplicationResponseDto applyToJob(ApplicationRequestDto dto) {
        User candidate = getCurrentUser();
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepo.findByCandidateAndJob(candidate, job).isPresent()) {
            throw new RuntimeException("Already applied to this job");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .appliedAt(LocalDateTime.now())
                .status(ApplicationStatus.APPLIED)
                .build();

        Application savedApplication = applicationRepo.save(application);

        return ApplicationResponseDto.builder()
                .applicationId(savedApplication.getId())
                .jobId(savedApplication.getJob().getId())
                .jobTitle(savedApplication.getJob().getTitle())
                .applicationStatus(savedApplication.getStatus().name())
                .appliedAt(savedApplication.getAppliedAt())
                .build();
    }

    @Override
    public List<JobPostDto> searchJobs(String title, String location) {
        List<Job> jobs;

        if (title != null && location != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(title, location);
        } else if (title != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(title);
        } else if (location != null) {
            jobs = jobRepository.findByLocationContainingIgnoreCase(location);
        } else {
            jobs = jobRepository.findAll();
        }

        return jobs.stream()
                .map(job -> JobPostDto.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .description(job.getDescription())
                        .location(job.getLocation())
                        .salary(job.getSalary())
                        .category(job.getCategory())
                        .level(job.getLevel())
                        .postedDate(job.getPostedDate().toLocalDate())
                        .companyName(job.getEmployer().getCompanyName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public CandidateProfileDto getMyProfile() {
        User user = getCurrentUser();
        CandidateProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return CandidateProfileDto.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .education(profile.getEducation())
                .experience(profile.getExperience())
                .skills(profile.getSkills())
                .resumeUrl(profile.getResumeUrl())
                .build();
    }

    @Override
    public CandidateProfileDto updateProfile(String fullName,
            String email,
            String phone,
            String education,
            String experience,
            String skills,
            MultipartFile resumeFile) {

        User user = getCurrentUser();
        CandidateProfile profile = profileRepo.findByUser(user)
                .orElse(new CandidateProfile());

        profile.setUser(user);
        profile.setFullName(fullName);
        profile.setEmail(email);
        profile.setPhone(phone);
        profile.setEducation(education);
        profile.setExperience(experience);
        profile.setSkills(skills);

        if (resumeFile != null && !resumeFile.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(resumeFile.getBytes(), ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", "resumes"));
                String resumeUrl = uploadResult.get("secure_url").toString();
                profile.setResumeUrl(resumeUrl);
            } catch (IOException e) {
                throw new RuntimeException("Resume upload failed", e);
            }
        }

        CandidateProfile saved = profileRepo.save(profile);

        return CandidateProfileDto.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .education(saved.getEducation())
                .experience(saved.getExperience())
                .skills(saved.getSkills())
                .resumeUrl(saved.getResumeUrl())
                .build();
    }

    @Override
    public List<ApplicationResponseDto> getMyApplications() {
        User candidate = getCurrentUser();
        return applicationRepo.findByCandidate(candidate).stream()
                .map(app -> ApplicationResponseDto.builder()
                        .applicationId(app.getId())
                        .jobId(app.getJob().getId())
                        .jobTitle(app.getJob().getTitle())
                        .jobLocation(app.getJob().getLocation())
                        .applicationStatus(app.getStatus().name())
                        .appliedAt(app.getAppliedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public JobPostDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        return JobPostDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .category(job.getCategory())
                .level(job.getLevel())
                .postedDate(job.getPostedDate().toLocalDate())
                .companyName(job.getEmployer().getCompanyName())
                .build();
    }

}
