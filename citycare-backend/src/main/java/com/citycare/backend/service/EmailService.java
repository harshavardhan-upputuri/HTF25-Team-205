package com.citycare.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class EmailService {
    @Value("${BREVO_API_KEY}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", "City Care", "email", "harshaupputuri123@gmail.com"),
                "to", new Map[] { Map.of("email", userEmail) },
                "subject", subject,
                "htmlContent", text + "<br><b>OTP:</b> " + otp);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    entity,
                    String.class);
            System.out.println("Email sent: " + response.getStatusCode());
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public void sendLoginCredentialsEmail(String userEmail, String password, String role) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        String subject = "Your City Care Account Credentials";
        String text = "Dear " + role + ",<br><br>"
                + "Your account has been created successfully.<br>"
                + "<b>Email:</b> " + userEmail + "<br>"
                + "<b>Password:</b> " + password + "<br><br>"
                + "Please change your password after your first login.<br><br>"
                + "Best Regards,<br>City Care Team";

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", "City Care", "email", "harshaupputuri123@gmail.com"),
                "to", new Map[] { Map.of("email", userEmail) },
                "subject", subject,
                "htmlContent", text);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    entity,
                    String.class);
            System.out.println("Credentials email sent: " + response.getStatusCode());
        } catch (Exception e) {
            throw new RuntimeException("Failed to send credentials email: " + e.getMessage(), e);
        }
    }

}

// MimeMessage mimeMessage = javaMailSender.createMimeMessage();
// MimeMessageHelper mimeMessageHelper=new
// MimeMessageHelper(mimeMessage,"utf-8");
// mimeMessageHelper.setSubject(subject);
// mimeMessageHelper.setText(text);
// mimeMessageHelper.setTo(userEmail);
// javaMailSender.send(mimeMessage);