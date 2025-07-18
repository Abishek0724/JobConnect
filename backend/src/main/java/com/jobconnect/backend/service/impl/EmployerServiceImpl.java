package com.jobconnect.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.jobconnect.backend.dto.ApplicationResponseDto;
import com.jobconnect.backend.dto.JobPostDto;
import com.jobconnect.backend.entity.Job;
import com.jobconnect.backend.entity.User;
import com.jobconnect.backend.repository.ApplicationRepository;
import com.jobconnect.backend.repository.JobRepository;
import com.jobconnect.backend.repository.UserRepository;
import com.jobconnect.backend.service.interf.EmployerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {

        private final JobRepository jobRepository;
        private final ApplicationRepository applicationRepository;
        private final UserRepository userRepository;

        private User getCurrentUser() {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                return userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        @Override
        public JobPostDto postJob(JobPostDto dto) {
                User employer = getCurrentUser();
                Job job = Job.builder()
                                .title(dto.getTitle())
                                .description(dto.getDescription())
                                .location(dto.getLocation())
                                .salary(dto.getSalary())
                                .category(dto.getCategory())
                                .level(dto.getLevel())
                                .postedDate(LocalDateTime.now())
                                .employer(employer)
                                .build();

                Job savedJob = jobRepository.save(job);

                return JobPostDto.builder()
                                .id(savedJob.getId())
                                .title(savedJob.getTitle())
                                .description(savedJob.getDescription())
                                .location(savedJob.getLocation())
                                .salary(savedJob.getSalary())
                                .category(savedJob.getCategory())
                                .level(savedJob.getLevel())
                                .postedDate(savedJob.getPostedDate().toLocalDate())
                                .companyName(employer.getCompanyName())
                                .build();
        }

        @Override
        public List<JobPostDto> getMyPostedJobs() {
                User employer = getCurrentUser();
                return jobRepository.findByEmployer(employer).stream()
                                .map(job -> JobPostDto.builder()
                                                .id(job.getId())
                                                .title(job.getTitle())
                                                .description(job.getDescription())
                                                .location(job.getLocation())
                                                .salary(job.getSalary())
                                                .category(job.getCategory())
                                                .level(job.getLevel())
                                                .postedDate(job.getPostedDate().toLocalDate())
                                                .companyName(employer.getCompanyName())
                                                .build())
                                .collect(Collectors.toList());
        }

        @Override
        public List<ApplicationResponseDto> getJobApplications(Long jobId) {
                return applicationRepository.findByJobId(jobId).stream()
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
        public List<ApplicationResponseDto> getAllApplicationsForMyJobs() {
                User recruiter = getCurrentUser();
                List<Job> myJobs = jobRepository.findByEmployer(recruiter);

                return myJobs.stream()
                                .flatMap(job -> applicationRepository.findByJob(job).stream())
                                .map(app -> ApplicationResponseDto.builder()
                                                .applicationId(app.getId())
                                                .jobId(app.getJob().getId())
                                                .jobTitle(app.getJob().getTitle())
                                                .jobLocation(app.getJob().getLocation())
                                                .applicationStatus(app.getStatus().name())
                                                .appliedAt(app.getAppliedAt())

                                                .candidateName(app.getCandidate().getCandidateProfile().getFullName())
                                                .resumeUrl(app.getCandidate().getCandidateProfile().getResumeUrl())

                                                .build())
                                .collect(Collectors.toList());
        }

        @Override
        public JobPostDto updateJob(Long jobId, JobPostDto dto) {
                User employer = getCurrentUser();
                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                if (!job.getEmployer().getId().equals(employer.getId())) {
                        throw new RuntimeException("Unauthorized to update this job");
                }

                job.setTitle(dto.getTitle());
                job.setDescription(dto.getDescription());
                job.setLocation(dto.getLocation());
                job.setSalary(dto.getSalary());
                job.setCategory(dto.getCategory());
                job.setLevel(dto.getLevel());

                Job updatedJob = jobRepository.save(job);

                return JobPostDto.builder()
                                .id(updatedJob.getId())
                                .title(updatedJob.getTitle())
                                .description(updatedJob.getDescription())
                                .location(updatedJob.getLocation())
                                .salary(updatedJob.getSalary())
                                .category(updatedJob.getCategory())
                                .level(updatedJob.getLevel())
                                .postedDate(updatedJob.getPostedDate().toLocalDate())
                                .companyName(employer.getCompanyName())
                                .build();
        }

        @Override
        public void deleteJob(Long jobId) {
                User employer = getCurrentUser();
                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                if (!job.getEmployer().getId().equals(employer.getId())) {
                        throw new RuntimeException("Unauthorized to delete this job");
                }

                jobRepository.delete(job);
        }
}
