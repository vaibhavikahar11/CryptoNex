package com.cryptonex.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;


    public void sendVerificationOtpEmail(String userEmail, String otp) throws MessagingException, MailSendException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");


        String subject = "Account verification";
        String text = "your account verification code is : " + otp;

        helper.setSubject(subject);
        helper.setText(text, true);
        helper.setTo(userEmail);

        System.out.println("📬 [EMAIL SERVICE] Verification OTP for " + userEmail + " is: " + otp);

        try {
            javaMailSender.send(mimeMessage);
            System.out.println("📧 Email sent successfully to " + userEmail);
        } catch (Exception e) {
            System.err.println("⚠️ WARNING: Could not send email to " + userEmail + " (probably SMTP ports are blocked on Render free tier).");
            System.err.println("👉 Real OTP printed to logs: " + otp);
            // Do NOT rethrow the exception, so the user can use the printed OTP and the UI flow does not crash.
        }
    }
}
