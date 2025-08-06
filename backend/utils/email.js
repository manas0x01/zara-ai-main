const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Check if we have valid email credentials
  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your-app-password') {
    console.log('⚠️  Email credentials not configured - emails will not be sent');
    return null;
  }

  // Use configured email service
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email verification
const sendVerificationEmail = async (user, verificationToken) => {
  const transporter = createTransporter();
  
  // If no transporter (email not configured), skip sending email
  if (!transporter) {
    console.log(`📧 Email verification would be sent to: ${user.email}`);
    console.log(`🔗 Verification URL: ${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`);
    return { success: true, messageId: 'email-not-configured' };
  }
  
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Zara AI" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Verify Your Zara AI Account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Welcome to Zara AI!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.firstName},</h2>
              <p>Thank you for creating your Zara AI account! To get started, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify My Account</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create this account, please ignore this email.</p>
              
              <p>Welcome aboard!<br>The Zara AI Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Zara AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Zara AI" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Reset Your Zara AI Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.firstName},</h2>
              <p>We received a request to reset your Zara AI account password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This password reset link will expire in 10 minutes for security reasons.
              </div>
              
              <p>If you didn't request a password reset, please ignore this email. Your account remains secure.</p>
              
              <p>Best regards,<br>The Zara AI Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Zara AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Zara AI" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Welcome to Zara AI! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Zara AI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Zara AI!</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.firstName}!</h2>
              <p>Your account has been successfully verified! You're now part of the Zara AI community and ready to experience the future of AI conversation.</p>
              
              <h3>What you can do with Zara AI:</h3>
              
              <div class="feature">
                <h4>💬 Natural Conversations</h4>
                <p>Chat naturally with our advanced AI that understands context and provides intelligent responses.</p>
              </div>
              
              <div class="feature">
                <h4>🖼️ Image Analysis</h4>
                <p>Upload images and get detailed analysis, insights, and creative interpretations.</p>
              </div>
              
              <div class="feature">
                <h4>📊 Data Insights</h4>
                <p>Analyze charts, documents, and data visualizations with expert-level understanding.</p>
              </div>
              
              <div class="feature">
                <h4>🎨 Creative Assistance</h4>
                <p>Get help with writing, brainstorming, and creative problem-solving.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL}" class="button">Start Chatting Now</a>
              </div>
              
              <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
              
              <p>Happy chatting!<br>The Zara AI Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Zara AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email failure
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
