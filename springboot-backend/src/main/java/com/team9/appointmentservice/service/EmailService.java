package com.team9.appointmentservice.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${app.sendgrid.enabled:false}")
    private boolean sendgridEnabled;

    @Value("${sendgrid.api.key:}")
    private String apiKey;

    @Value("${sendgrid.from.email:no-reply@example.com}")
    private String fromEmail;

    @Value("${sendgrid.from.name:Commerce Bank}")
    private String fromName;

    public void sendEmail(String to, String subject, String body) throws Exception {
        if (!sendgridEnabled) {
            log.info("SendGrid disabled; skipping email to {} with subject {}", to, subject);
            return;
        }

        Email from = (fromName == null || fromName.isBlank())
                ? new Email(fromEmail)
                : new Email(fromEmail, fromName);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", body);

        Mail mail = new Mail(from, subject, toEmail, content);
        SendGrid sg = new SendGrid(apiKey);

        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        sg.api(request);
    }
}
