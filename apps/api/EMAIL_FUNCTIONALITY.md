# Email Functionality Implementation

This document describes the email functionality implemented for the Linea platform, including welcome emails for new users and waitlist confirmation emails with QR codes.

## Features Implemented

### 1. Welcome Email for New Users
- **Trigger**: When a user registers for the first time (either as VISITOR or OWNER)
- **Recipients**: 
  - The new user (welcome email)
  - Admin distribution list (notification email)
- **Content**: Welcome message with platform introduction and next steps

### 2. Waitlist Email with QR Code
- **Trigger**: When a user joins an event waitlist
- **Content**: 
  - Event details (title, date, location)
  - QR code for event arrival tracking
  - Instructions for using the QR code

### 3. QR Code Arrival Tracking
- **Purpose**: Allow event organizers to scan QR codes to mark user arrival
- **Security**: Uses SHA256 hash for secure arrival verification
- **Endpoint**: `/api/events/:eventId/arrival/:hash`

## Technical Implementation

### Email Service (`src/services/emailService.ts`)
- **EmailService Class**: Handles all email operations
- **SendGrid Integration**: Uses SendGrid API for email delivery
- **HTML Templates**: Beautiful, responsive email templates
- **Fallback**: Logs emails to console when SendGrid is not configured

### Arrival Tracker (`src/utils/arrivalTracker.ts`)
- **ArrivalTracker Class**: Manages QR code generation and verification
- **Hash Generation**: Creates unique SHA256 hashes for each waitlist entry
- **Database Storage**: Stores arrival hashes in waitlist entry metadata

### API Endpoints

#### Waitlist with Email
```
POST /api/waitlist
```
- Creates waitlist entry
- Generates QR code
- Sends confirmation email with QR code

#### Arrival Scanning
```
GET /api/events/:eventId/arrival/:hash
```
- Verifies arrival hash
- Marks user as arrived
- Returns success/error status

#### Email Testing (Admin Only)
```
POST /api/admin/test-email
```
- Tests welcome and waitlist emails
- Requires admin authentication

## Configuration

### Environment Variables
```bash
# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@linea.app
SENDGRID_FROM_NAME=Linea
SENDGRID_REPLY_TO=support@linea.app

# Admin Distribution List
ADMIN_EMAIL=admin@linea.app
```

### Database Schema Updates
The `WaitlistStatus` enum includes a new `ARRIVED` status:
```prisma
enum WaitlistStatus {
  PENDING
  CONFIRMED
  CANCELLED
  APPROVED
  REJECTED
  ARRIVED  // New status for arrival tracking
}
```

## Email Templates

### Welcome Email Template
- **Subject**: "Welcome to Linea! 🎉"
- **Features**:
  - Responsive HTML design
  - Platform introduction
  - Next steps for users
  - Professional styling

### Waitlist Email Template
- **Subject**: "You're on the waitlist for [Event Title]! 🎫"
- **Features**:
  - Event details display
  - Embedded QR code image
  - Arrival instructions
  - Event-specific information

## Testing

### Manual Testing
1. **Test Welcome Email**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/test-email \
     -H "Content-Type: application/json" \
     -d '{"type": "welcome", "email": "test@example.com"}'
   ```

2. **Test Waitlist Email**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/test-email \
     -H "Content-Type: application/json" \
     -d '{"type": "waitlist", "email": "test@example.com"}'
   ```

### Automated Testing
Run the test script:
```bash
node test-email.js
```

## Security Considerations

### QR Code Security
- **Unique Hashes**: Each waitlist entry gets a unique SHA256 hash
- **Time-based**: Hashes include timestamp for additional security
- **One-time Use**: Arrival can only be marked once per user per event

### Email Security
- **Rate Limiting**: Built-in rate limiting for email endpoints
- **Validation**: Email format validation before sending
- **Error Handling**: Graceful fallback when email service fails

## Production Deployment

### SendGrid Setup
1. Create SendGrid account
2. Generate API key
3. Set up domain authentication
4. Configure environment variables

### Monitoring
- **Email Delivery**: Monitor SendGrid dashboard for delivery rates
- **Error Logging**: Check application logs for email failures
- **User Feedback**: Monitor user complaints about missing emails

## Troubleshooting

### Common Issues

1. **Emails Not Sending**:
   - Check SendGrid API key configuration
   - Verify environment variables
   - Check application logs for errors

2. **QR Codes Not Working**:
   - Verify arrival hash generation
   - Check database for stored hashes
   - Test arrival endpoint manually

3. **Template Issues**:
   - Check HTML template syntax
   - Verify image embedding
   - Test with different email clients

### Debug Mode
Set `SHOW_MAGIC_LINK=true` to see email content in logs instead of sending.

## Future Enhancements

### Planned Features
- **Email Templates**: Customizable email templates via admin panel
- **Bulk Operations**: Send emails to multiple users
- **Analytics**: Track email open rates and click-through rates
- **A/B Testing**: Test different email templates

### Performance Optimizations
- **Queue System**: Implement email queue for high-volume sending
- **Template Caching**: Cache email templates for better performance
- **Batch Processing**: Process multiple emails in batches

## Support

For issues or questions about the email functionality:
1. Check the application logs
2. Verify SendGrid configuration
3. Test with the admin endpoint
4. Contact the development team
