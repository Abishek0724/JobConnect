package com.jobconnect.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double salary;
    private String level;
    private LocalDate postedDate;
    private String category;
    private String companyName;

}