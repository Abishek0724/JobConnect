package com.jobconnect.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobconnect.backend.entity.Application;
import com.jobconnect.backend.entity.Job;
import com.jobconnect.backend.entity.User;
import com.jobconnect.backend.enums.ApplicationStatus;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidate(User candidate);

    List<Application> findByJob(Job job);

    List<Application> findByJob_Employer(User employer);

    Optional<Application> findByCandidateAndJob(User candidate, Job job);

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByJobId(Long jobId);
}