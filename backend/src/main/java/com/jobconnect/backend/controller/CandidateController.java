package com.jobconnect.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobconnect.backend.dto.ApplicationRequestDto;
import com.jobconnect.backend.dto.ApplicationResponseDto;
import com.jobconnect.backend.dto.CandidateProfileDto;
import com.jobconnect.backend.dto.JobPostDto;
import com.jobconnect.backend.service.interf.CandidateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping("/jobs/search")
    public ResponseEntity<List<JobPostDto>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(candidateService.searchJobs(title, location));
    }

    @PostMapping("/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApplicationResponseDto> applyToJob(
            @Valid @RequestBody ApplicationRequestDto dto) {
        return ResponseEntity.ok(candidateService.applyToJob(dto));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobPostDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getJobById(id));
    }

    @GetMapping("/my-profile")
    public ResponseEntity<CandidateProfileDto> getMyProfile() {
        CandidateProfileDto profile = candidateService.getMyProfile();
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidateProfileDto> updateProfile(
            @RequestPart("fullName") String fullName,
            @RequestPart("email") String email,
            @RequestPart("phone") String phone,
            @RequestPart("education") String education,
            @RequestPart("experience") String experience,
            @RequestPart("skills") String skills,
            @RequestPart(value = "resume", required = false) MultipartFile resumeFile) {

        CandidateProfileDto updatedProfile = candidateService.updateProfile(
                fullName, email, phone, education, experience, skills, resumeFile);

        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponseDto>> getMyApplications() {
        return ResponseEntity.ok(candidateService.getMyApplications());
    }
}
