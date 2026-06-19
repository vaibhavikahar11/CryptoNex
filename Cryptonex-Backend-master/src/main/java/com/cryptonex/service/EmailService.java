package com.cryptonex.service;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.MailSendException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * EmailService — sends transactional OTP emails via Brevo HTTP API.
 *
 * WHY NOT SMTP?
 * Render's free tier blocks ALL outbound TCP on SMTP ports (25, 465, 587).
 * Any JavaMailSender / SMTP approach will time out with "Connection timed out".
 *
 * WHY BREVO HTTP API?
 * The Brevo REST API (https://api.brevo.com) uses HTTPS port 443 which is
 * never blocked by Render. No new Maven dependencies required — RestTemplate
 * is already available via spring-boot-starter-web.
 *
 * SETUP (one-time):
 *   1. Go to https://app.brevo.com → Settings → API Keys → Generate a new API key
 *   2. Add BREVO_API_KEY=<your-api-key> as an environment variable on Render
 *   3. Add MAIL_FROM_EMAIL=<your-verified-sender-email> on Render
 *   4. Add MAIL_FROM_NAME=CryptoNex on Render (optional, defaults to "CryptoNex")
 */
@Service
public class EmailService {

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${mail.from.name:CryptoNex}")
    private String fromName;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    public void sendVerificationOtpEmail(String userEmail, String otp) throws MessagingException, MailSendException {

        // Always print OTP to logs as a fallback (visible in Render logs)
        System.out.println("📬 [EMAIL SERVICE] Verification OTP for " + userEmail + " is: " + otp);

        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            System.err.println("⚠️ BREVO_API_KEY is not configured. OTP printed to logs above. " +
                    "Add BREVO_API_KEY env var on Render to enable email delivery.");
            return;
        }

        String effectiveFromEmail = (fromEmail != null && !fromEmail.isEmpty()) ? fromEmail : "noreply@cryptonex.app";
        String effectiveFromName = (fromName != null && !fromName.isEmpty()) ? fromName : "CryptoNex";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            // Build the Brevo transactional email payload
            Map<String, Object> body = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("email", effectiveFromEmail);
            sender.put("name", effectiveFromName);
            body.put("sender", sender);

            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", userEmail);
            body.put("to", List.of(recipient));

            body.put("subject", "CryptoNex — Account Verification OTP");
            body.put("htmlContent",
                    "<div style='font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f172a;border-radius:12px;color:#e2e8f0;'>" +
                    "<h2 style='color:#a78bfa;margin-bottom:8px;'>🔐 Account Verification</h2>" +
                    "<p style='color:#94a3b8;'>Use the code below to verify your CryptoNex account.</p>" +
                    "<div style='background:#1e293b;border-radius:8px;padding:24px;text-align:center;margin:24px 0;border:1px solid #334155;'>" +
                    "<span style='font-size:36px;font-weight:bold;letter-spacing:12px;color:#a78bfa;'>" + otp + "</span>" +
                    "</div>" +
                    "<p style='color:#64748b;font-size:12px;'>This code expires in 10 minutes. Do not share it with anyone.</p>" +
                    "</div>");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("📧 Email sent successfully to " + userEmail + " via Brevo API. Status: " + response.getStatusCode());
            } else {
                System.err.println("⚠️ Brevo API returned non-2xx status: " + response.getStatusCode() + " — " + response.getBody());
                System.err.println("👉 OTP is available in logs above.");
            }

        } catch (Exception e) {
            System.err.println("⚠️ Failed to send email via Brevo API to " + userEmail);
            System.err.println("Error: " + e.getMessage());
            System.err.println("👉 OTP is still available in logs above: " + otp);
        }
    }
}
