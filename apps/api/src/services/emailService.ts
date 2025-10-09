import crypto from 'crypto';
import { QRCodeGenerator } from '../utils/qrGenerator.js';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WelcomeEmailData {
  email: string;
  name?: string;
  adminListEmail: string;
}

export interface WaitlistEmailData {
  email: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  qrCodeData?: string; // base64 data url (fallback)
  qrImageUrl?: string; // http(s) url (preferred by many email clients)
  arrivalUrl: string;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || '';
    this.fromName = process.env.SENDGRID_FROM_NAME || '';
  }

  /**
   * Send welcome email to new users and add them to admin distribution list
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    try {
      const template = this.generateWelcomeTemplate(data);

      // Send welcome email to user
      await this.sendEmail(
        data.email,
        template.subject,
        template.html,
        template.text
      );

      // Add user to admin distribution list (send notification to admin)
      await this.sendEmail(
        data.adminListEmail,
        `New User Registration: ${data.email}`,
        this.generateAdminNotificationTemplate(data),
        `New user registered: ${data.email}${data.name ? ` (${data.name})` : ''}`
      );

      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Send waitlist confirmation email with QR code for event arrival
   */
  async sendWaitlistEmail(data: WaitlistEmailData): Promise<boolean> {
    try {
      const template = this.generateWaitlistTemplate(data);

      await this.sendEmail(
        data.email,
        template.subject,
        template.html,
        template.text
      );

      return true;
    } catch (error) {
      console.error('Failed to send waitlist email:', error);
      return false;
    }
  }

  /**
   * Generate QR code for event arrival tracking
   */
  async generateArrivalQRCode(
    eventId: string,
    waitlistEntryId: string
  ): Promise<string> {
    // Create a unique hash for this specific waitlist entry
    const arrivalData = {
      eventId,
      waitlistEntryId,
      timestamp: Date.now(),
    };

    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(arrivalData))
      .digest('hex');

    const arrivalUrl = `${process.env.API_URL || 'https://linea-production.up.railway.app'}/api/events/${eventId}/arrival/${hash}`;

    console.log('Generating QR code for URL:', arrivalUrl);

    try {
      const qrCodeData = await QRCodeGenerator.generateEventQR(arrivalUrl, {
        width: 300,
        margin: 3,
      });

      console.log(
        'QR code generated successfully, length:',
        qrCodeData?.length
      );
      console.log('QR code prefix:', qrCodeData?.substring(0, 50));

      return qrCodeData;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  private generateWelcomeTemplate(data: WelcomeEmailData): EmailTemplate {
    const subject = 'Welcome to Linea! 🎉';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Linea</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Linea! 🎉</h1>
            <p>Your gateway to exclusive events and experiences</p>
          </div>
          <div class="content">
            <h2>Hello${data.name ? ` ${data.name}` : ''}!</h2>
            <p>Welcome to Linea, where amazing events and experiences await you!</p>
            
            <h3>What's next?</h3>
            <ul>
              <li>🎫 Browse and join waitlists for exclusive events</li>
              <li>📍 Discover events in your area</li>
              <li>🔔 Get notified about new events that match your interests</li>
              <li>📱 Receive QR codes for easy event check-in</li>
            </ul>
            
            <p>We're excited to have you as part of our community. Get ready for unforgettable experiences!</p>
            
            <a href="${process.env.FRONTEND_URL || 'https://linea-production.up.railway.app'}" class="button">Explore Events</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Linea Team</p>
            <p>This email was sent to ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to Linea! 🎉

Hello${data.name ? ` ${data.name}` : ''}!

Welcome to Linea, where amazing events and experiences await you!

What's next?
- 🎫 Browse and join waitlists for exclusive events
- 📍 Discover events in your area  
- 🔔 Get notified about new events that match your interests
- 📱 Receive QR codes for easy event check-in

We're excited to have you as part of our community. Get ready for unforgettable experiences!

Explore events: ${process.env.FRONTEND_URL || 'https://linea-production.up.railway.app'}

If you have any questions, feel free to reach out to our support team.

Best regards,
The Linea Team

This email was sent to ${data.email}
    `;

    return { subject, html, text };
  }

  private generateWaitlistTemplate(data: WaitlistEmailData): EmailTemplate {
    const subject = `You're on the waitlist for ${data.eventTitle}! 🎫`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Waitlist Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .qr-section { text-align: center; margin: 30px 0; }
          .qr-code { max-width: 300px; border: 2px solid #ddd; border-radius: 8px; display: block; margin: 20px auto; background: white; padding: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're on the waitlist! 🎫</h1>
            <p>Your spot is reserved for this exclusive event</p>
          </div>
          <div class="content">
            <div class="event-info">
              <h2>${data.eventTitle}</h2>
              <p><strong>📅 Date:</strong> ${data.eventDate}</p>
              <p><strong>📍 Location:</strong> ${data.eventLocation}</p>
            </div>
            
            <h3>Your Arrival QR Code</h3>
            <p>When you arrive at the event, show this QR code to the event organizer for quick check-in:</p>
            
            <div class="qr-section">
              <img src="${data.qrImageUrl || data.qrCodeData || ''}" alt="Event Arrival QR Code" class="qr-code" style="display: block; max-width: 300px; height: auto; margin: 20px auto;" />
              <p><small>Scan this QR code when you arrive at the event</small></p>
              <p><strong>Alternative:</strong> If the QR code doesn't display, use this link: <a href="${data.arrivalUrl}">${data.arrivalUrl}</a></p>
            </div>
            
            <h3>What happens next?</h3>
            <ul>
              <li>✅ You're on the waitlist for this event</li>
              <li>📧 You'll receive updates about the event</li>
              <li>🎫 If a spot opens up, you'll be notified immediately</li>
              <li>📱 Bring this QR code to the event for easy check-in</li>
            </ul>
            
            <p><strong>Important:</strong> Keep this email and QR code safe. You'll need it to check in at the event.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Linea Team</p>
            <p>This email was sent to ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
You're on the waitlist for ${data.eventTitle}! 🎫

Event Details:
- Title: ${data.eventTitle}
- Date: ${data.eventDate}
- Location: ${data.eventLocation}

Your Arrival QR Code:
When you arrive at the event, show this QR code to the event organizer for quick check-in.

[QR Code Image: ${data.qrImageUrl || (data.qrCodeData ? data.qrCodeData.substring(0, 50) + '...' : 'embedded') }]

What happens next?
- ✅ You're on the waitlist for this event
- 📧 You'll receive updates about the event  
- 🎫 If a spot opens up, you'll be notified immediately
- 📱 Bring this QR code to the event for easy check-in

Important: Keep this email and QR code safe. You'll need it to check in at the event.

Best regards,
The Linea Team

This email was sent to ${data.email}
    `;

    return { subject, html, text };
  }

  private generateAdminNotificationTemplate(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New User Registration</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .user-info { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New User Registration</h2>
            <p>A new user has joined the Linea platform</p>
          </div>
          <div class="user-info">
            <h3>User Details:</h3>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.name ? `<p><strong>Name:</strong> ${data.name}</p>` : ''}
            <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<void> {
    if (!this.apiKey) {
      console.log('SendGrid API key not configured, logging email instead:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${text.substring(0, 200)}...`);
      return;
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
    }
  }
}

export const emailService = new EmailService();
