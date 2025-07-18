package com.jobconnect.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobconnect.backend.entity.Job;
import com.jobconnect.backend.entity.User;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployer(User employer);

    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(String title, String location);

    List<Job> findByTitleContainingIgnoreCase(String title);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByCategory(String category);
}