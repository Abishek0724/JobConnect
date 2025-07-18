package com.jobconnect.backend.mapper;

import org.springframework.stereotype.Component;

import com.jobconnect.backend.dto.CandidateProfileDto;
import com.jobconnect.backend.entity.CandidateProfile;

@Component
public class CandidateProfileMapper {

    public CandidateProfileDto toDto(CandidateProfile profile) {
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

    public CandidateProfile toEntity(CandidateProfileDto dto) {
        return CandidateProfile.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .education(dto.getEducation())
                .experience(dto.getExperience())
                .skills(dto.getSkills())
                .resumeUrl(dto.getResumeUrl())
                .build();
    }
}