#!/usr/bin/env node

/**
 * Test script for email functionality
 * Run with: node test-email.js
 */

import { emailService } from './src/services/emailService.js';
import { ArrivalTracker } from './src/utils/arrivalTracker.js';

async function testEmailFunctionality() {
  console.log('🧪 Testing Email Functionality...\n');

  try {
    // Test 1: Welcome Email
    console.log('1. Testing Welcome Email...');
    const welcomeResult = await emailService.sendWelcomeEmail({
      email: 'test@example.com',
      name: 'Test User',
      adminListEmail: 'admin@linea.app',
    });
    console.log('✅ Welcome email test:', welcomeResult ? 'SUCCESS' : 'FAILED');

    // Test 2: Waitlist Email
    console.log('\n2. Testing Waitlist Email...');
    const waitlistResult = await emailService.sendWaitlistEmail({
      email: 'test@example.com',
      eventId: 'test-event-123',
      eventTitle: 'Test Event',
      eventDate: new Date().toLocaleDateString(),
      eventLocation: 'Test Location',
      qrCodeData:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      arrivalUrl:
        'https://api.linea.app/api/events/test-event-123/arrival/test-hash',
    });
    console.log(
      '✅ Waitlist email test:',
      waitlistResult ? 'SUCCESS' : 'FAILED'
    );

    // Test 3: QR Code Generation
    console.log('\n3. Testing QR Code Generation...');
    const qrCode = await emailService.generateArrivalQRCode(
      'test-event-123',
      'test-waitlist-456'
    );
    console.log('✅ QR code generated:', qrCode ? 'SUCCESS' : 'FAILED');
    console.log('   QR Code length:', qrCode.length, 'characters');

    // Test 4: Arrival Hash Generation
    console.log('\n4. Testing Arrival Hash Generation...');
    const hash = ArrivalTracker.generateArrivalHash(
      'test-event-123',
      'test-waitlist-456'
    );
    console.log('✅ Arrival hash generated:', hash ? 'SUCCESS' : 'FAILED');
    console.log('   Hash:', hash);

    console.log('\n🎉 All email functionality tests completed!');
    console.log(
      '\nNote: If SendGrid is not configured, emails will be logged to console instead of sent.'
    );
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testEmailFunctionality();
