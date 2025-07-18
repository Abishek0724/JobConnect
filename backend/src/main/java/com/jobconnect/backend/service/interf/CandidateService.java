package com.jobconnect.backend.service.interf;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jobconnect.backend.dto.ApplicationRequestDto;
import com.jobconnect.backend.dto.ApplicationResponseDto;
import com.jobconnect.backend.dto.CandidateProfileDto;
import com.jobconnect.backend.dto.JobPostDto;

public interface CandidateService {

    CandidateProfileDto updateProfile(String fullName,
            String email,
            String phone,
            String education,
            String experience,
            String skills,
            MultipartFile resumeFile);

    CandidateProfileDto getMyProfile();

    List<JobPostDto> searchJobs(String title, String location);

    ApplicationResponseDto applyToJob(ApplicationRequestDto dto);

    List<ApplicationResponseDto> getMyApplications();

    JobPostDto getJobById(Long id);

}
