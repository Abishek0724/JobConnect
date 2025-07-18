package com.jobconnect.backend.service.interf;

public interface MailService {
    void sendEmail(String to, String subject, String body);
}
