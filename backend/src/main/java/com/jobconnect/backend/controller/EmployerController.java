package com.jobconnect.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobconnect.backend.dto.ApplicationResponseDto;
import com.jobconnect.backend.dto.JobPostDto;
import com.jobconnect.backend.service.interf.EmployerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    @PostMapping("/jobs")
    public ResponseEntity<JobPostDto> postJob(@RequestBody JobPostDto jobPostDto) {
        return ResponseEntity.ok(employerService.postJob(jobPostDto));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPostDto>> getMyJobs() {
        return ResponseEntity.ok(employerService.getMyPostedJobs());
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponseDto>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(employerService.getJobApplications(jobId));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponseDto>> getAllApplicationsForMyJobs() {
        return ResponseEntity.ok(employerService.getAllApplicationsForMyJobs());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        employerService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
