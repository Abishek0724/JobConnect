package com.jobconnect.backend.service.interf;

import java.util.List;

import com.jobconnect.backend.dto.ApplicationResponseDto;
import com.jobconnect.backend.dto.JobPostDto;

public interface EmployerService {

    JobPostDto postJob(JobPostDto jobPostDto);

    List<JobPostDto> getMyPostedJobs();

    List<ApplicationResponseDto> getJobApplications(Long jobId);

    List<ApplicationResponseDto> getAllApplicationsForMyJobs();

    void deleteJob(Long jobId);

    JobPostDto updateJob(Long jobId, JobPostDto jobPostDto);
}
