package com.jobconnect.backend.utils;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    public static String format(LocalDateTime dateTime) {
        return dateTime.format(formatter);
    }

    public static LocalDateTime parse(String dateTimeStr) {
        return LocalDateTime.parse(dateTimeStr, formatter);
    }

    public static String nowFormatted() {
        return LocalDateTime.now().format(formatter);
    }
}
