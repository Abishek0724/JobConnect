package com.jobconnect.backend.mapper;

import org.springframework.stereotype.Component;

import com.jobconnect.backend.dto.JobPostDto;
import com.jobconnect.backend.entity.Job;

@Component
public class JobMapper {

    public JobPostDto toDto(Job job) {
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

    public Job toEntity(JobPostDto dto) {
        return Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .salary(dto.getSalary())
                .category(dto.getCategory())
                .level(dto.getLevel())
                .build();
    }
}