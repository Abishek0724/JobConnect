package com.jobconnect.backend.service.interf;

public interface SmsService {
    void sendSms(String to, String body);
}
