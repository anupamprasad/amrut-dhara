// Test script to verify Resend and Twilio credentials
require('dotenv').config({ path: '.env' });

const testEmail = async () => {
  console.log('\n📧 Testing Email (Resend)...');
  console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Amrut Dhara <onboarding@resend.dev>',
        to: [process.env.ADMIN_EMAIL || 'anupam200@gmail.com'],
        subject: 'Test Email - Amrut Dhara',
        html: '<h1>Test Email</h1><p>This is a test email from Amrut Dhara app.</p>',
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully:', data);
    } else {
      console.log('❌ Email failed:', data);
    }
  } catch (error) {
    console.log('❌ Email error:', error.message);
  }
};

const testSMS = async () => {
  console.log('\n📱 Testing SMS (Twilio)...');
  console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Present' : '❌ Missing');
  console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN ? '✅ Present' : '❌ Missing');
  console.log('From Number:', process.env.TWILIO_PHONE_NUMBER || '❌ Missing');
  console.log('To Number:', process.env.ADMIN_PHONE_NUMBER || '❌ Missing');

  try {
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`,
        },
        body: new URLSearchParams({
          To: process.env.ADMIN_PHONE_NUMBER || '+919810554738',
          From: process.env.TWILIO_PHONE_NUMBER,
          Body: 'Test SMS from Amrut Dhara app',
        }).toString(),
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SMS sent successfully:', data);
    } else {
      console.log('❌ SMS failed:', data);
    }
  } catch (error) {
    console.log('❌ SMS error:', error.message);
  }
};

const runTests = async () => {
  console.log('🧪 Testing Notification Services\n');
  console.log('Environment Variables:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅' : '❌');
  console.log('- ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'anupam200@gmail.com');
  console.log('- TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅' : '❌');
  console.log('- TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅' : '❌');
  console.log('- TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || '❌');
  console.log('- ADMIN_PHONE_NUMBER:', process.env.ADMIN_PHONE_NUMBER || '❌');
  
  await testEmail();
  await testSMS();
  
  console.log('\n✅ Tests completed!\n');
};

runTests();
