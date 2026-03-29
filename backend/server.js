import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Setup email transporter
let transporter;

// Initialize transporter based on environment
if (process.env.NODE_ENV === 'production') {
  // In production, use real email service
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  // In development, use Ethereal Email (fake SMTP for testing)
  transporter = await nodemailer.createTestAccount().then(testAccount => {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Send appointment confirmation email
app.post('/api/appointments/send-confirmation', async (req, res) => {
  try {
    const { 
      customerEmail, 
      customerName, 
      topicName, 
      branchName, 
      dateLabel, 
      timeLabel,
      confirmationNumber 
    } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !topicName || !branchName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'appointments@bank.example.com',
      to: customerEmail,
      subject: `Appointment Confirmation - ${confirmationNumber}`,
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>Your appointment has been successfully scheduled. Here are the details:</p>
        
        <h3>Appointment Details</h3>
        <ul>
          <li><strong>Confirmation Number:</strong> ${confirmationNumber}</li>
          <li><strong>Topic:</strong> ${topicName}</li>
          <li><strong>Branch:</strong> ${branchName}</li>
          <li><strong>Date:</strong> ${dateLabel}</li>
          <li><strong>Time:</strong> ${timeLabel}</li>
        </ul>

        <p>If you need to reschedule or cancel, please contact your branch directly or log into your account.</p>
        
        <p>Thank you for choosing us!</p>
        <p>Best regards,<br>Banking Services Team</p>
      `,
      text: `
Appointment Confirmation - ${confirmationNumber}

Dear ${customerName},

Your appointment has been successfully scheduled.

Appointment Details:
- Confirmation Number: ${confirmationNumber}
- Topic: ${topicName}
- Branch: ${branchName}
- Date: ${dateLabel}
- Time: ${timeLabel}

If you need to reschedule or cancel, please contact your branch directly or log into your account.

Thank you for choosing us!
Best regards,
Banking Services Team
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    res.json({ 
      success: true, 
      message: 'Confirmation email sent successfully',
      previewUrl: nodemailer.getTestMessageUrl(info) // For testing
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send confirmation email',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email API server running on http://localhost:${PORT}`);
  console.log(`📧 CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📝 Using ${process.env.NODE_ENV === 'production' ? 'production' : 'test (Ethereal)'} email service`);
});
