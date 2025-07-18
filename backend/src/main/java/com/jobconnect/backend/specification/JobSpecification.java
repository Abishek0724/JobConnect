package com.jobconnect.backend.specification;

import com.jobconnect.backend.entity.Job;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class JobSpecification {

    public static Specification<Job> hasTitle(String title) {
        return (root, query, cb) -> title == null ? null
                : cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Job> hasLocation(String location) {
        return (root, query, cb) -> location == null ? null
                : cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
    }

    public static Specification<Job> hasSkill(String skill) {
        return (root, query, cb) -> {
            if (skill == null)
                return null;
            return cb.like(cb.lower(root.get("skillsRequired")), "%" + skill.toLowerCase() + "%");
        };
    }
}
