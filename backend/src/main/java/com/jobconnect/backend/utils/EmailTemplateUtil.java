package com.jobconnect.backend.utils;

public class EmailTemplateUtil {

  public static String generateJobApplicationTemplate(String candidateName, String jobTitle) {
    return """
            <html>
              <body>
                <h2>Hello %s,</h2>
                <p>Thank you for applying to the position: <strong>%s</strong>.</p>
                <p>Our team will review your application and get back to you shortly.</p>
                <br>
                <p>Best regards,<br>GUVI Jobs Team</p>
              </body>
            </html>
        """.formatted(candidateName, jobTitle);
  }

  public static String generateInterviewInvitationTemplate(String candidateName, String jobTitle, String mode,
      String datetime) {
    return """
            <html>
              <body>
                <h2>Dear %s,</h2>
                <p>You have been invited for an interview for the job <strong>%s</strong>.</p>
                <p>Mode: <strong>%s</strong><br>Date & Time: <strong>%s</strong></p>
                <p>Please be prepared accordingly.</p>
                <br>
                <p>Best of luck!<br>GUVI HR</p>
              </body>
            </html>
        """.formatted(candidateName, jobTitle, mode, datetime);
  }
}
