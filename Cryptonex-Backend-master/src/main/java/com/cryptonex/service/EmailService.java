package com.cryptonex.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;


    public void sendVerificationOtpEmail(String userEmail, String otp) throws MessagingException, MailSendException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");


        String subject = "Account verification";
        String text = "your account verification code is : " + otp;

        helper.setSubject(subject);
        helper.setText(text, true);
        helper.setTo(userEmail);

        if (fromEmail != null && !fromEmail.isEmpty()) {
            helper.setFrom(fromEmail);
        }

        System.out.println("📬 [EMAIL SERVICE] Verification OTP for " + userEmail + " is: " + otp);

        try {
            javaMailSender.send(mimeMessage);
            System.out.println("📧 Email sent successfully to " + userEmail);
        } catch (Exception e) {
            System.err.println("⚠️ WARNING: Could not send email to " + userEmail);
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
            System.err.println("👉 Real OTP printed to logs: " + otp);
            // Do NOT rethrow the exception, so the user can use the printed OTP and the UI flow does not crash.
        }
    }
}
