import {supabase} from './supabase';
import {
  RESEND_API_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  ADMIN_EMAIL,
  ADMIN_PHONE_NUMBER,
} from '@env';

// Notification service for sending emails and SMS
// This service calls external APIs directly from the app

interface NotificationData {
  orderId: string;
  userEmail: string;
  contactName: string;
  companyName: string;
  mobileNumber: string;
  bottleType: string;
  quantity: number;
  deliveryAddress: string;
  deliveryDate: string;
  notes?: string;
}

export const notificationService = {
  /**
   * Send email and SMS notifications after order is placed successfully
   */
  async sendOrderNotifications(
    orderId: string,
    orderData: any,
  ): Promise<void> {
    try {
      console.log('🔔 Starting notification process for order:', orderId);

      // Use admin email and phone from environment variables
      const adminEmail = ADMIN_EMAIL || 'anupam200@gmail.com';
      const adminPhone = ADMIN_PHONE_NUMBER || '+919810554738';

      const notificationData: NotificationData = {
        orderId,
        userEmail: adminEmail, // Send to admin
        contactName: orderData.contact_name,
        companyName: orderData.company_name,
        mobileNumber: adminPhone, // Send SMS to admin instead of customer
        bottleType: orderData.bottle_type,
        quantity: orderData.quantity,
        deliveryAddress: orderData.delivery_address,
        deliveryDate: orderData.delivery_date,
        notes: orderData.notes,
      };

      console.log('📧 Sending notifications to admin:', {
        email: notificationData.userEmail,
        phone: notificationData.mobileNumber,
      });
      console.log('📦 Customer details:', {
        company: orderData.company_name,
        contact: orderData.contact_name,
      });

      // Send email and SMS to admin in parallel
      const [emailResult, smsResult] = await Promise.allSettled([
        this.sendEmail(notificationData),
        this.sendSMS(notificationData),
      ]);

      console.log('📊 Notification results:', {
        email: emailResult.status === 'fulfilled' ? emailResult.value : 'failed',
        sms: smsResult.status === 'fulfilled' ? smsResult.value : 'failed',
      });
    } catch (error) {
      console.error('❌ Failed to send notifications:', error);
      // Silently fail - notifications are not critical
    }
  },

  /**
   * Send email notification via Resend
   */
  async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      console.log('📧 Attempting to send email to:', data.userEmail);
      console.log('📧 Using API key:', RESEND_API_KEY ? 'API key present' : 'API key MISSING');

      if (!RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY is not configured');
        return false;
      }

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Order Received - Amrut Dhara</h2>
          <p>A new order has been placed:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0;">${data.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Company:</strong></td>
                <td style="padding: 8px 0;">${data.companyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Contact Person:</strong></td>
                <td style="padding: 8px 0;">${data.contactName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Mobile Number:</strong></td>
                <td style="padding: 8px 0;">${data.mobileNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Bottle Type:</strong></td>
                <td style="padding: 8px 0;">${data.bottleType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Quantity:</strong></td>
                <td style="padding: 8px 0;">${data.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Delivery Date:</strong></td>
                <td style="padding: 8px 0;">${new Date(data.deliveryDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Delivery Address:</strong></td>
                <td style="padding: 8px 0;">${data.deliveryAddress}</td>
              </tr>
            </table>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          </div>
          
          <p>Please process this order at your earliest convenience.</p>
          <p style="color: #6b7280;"><em>Amrut Dhara Admin System</em></p>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Amrut Dhara <onboarding@resend.dev>',
          to: [data.userEmail],
          subject: `New Order #${data.orderId.slice(0, 8)} - ${data.companyName}`,
          html: emailHtml,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ Email sent successfully:', responseData);
        return true;
      } else {
        console.error('❌ Email sending failed:', responseData);
        return false;
      }
    } catch (error) {
      console.error('❌ Email error:', error);
      return false;
    }
  },

  /**
   * Send SMS notification via Twilio
   */
  async sendSMS(data: NotificationData): Promise<boolean> {
    try {
      console.log('📱 Attempting to send SMS to:', data.mobileNumber);
      console.log('📱 Twilio config:', {
        accountSid: TWILIO_ACCOUNT_SID ? 'present' : 'MISSING',
        authToken: TWILIO_AUTH_TOKEN ? 'present' : 'MISSING',
        phoneNumber: TWILIO_PHONE_NUMBER || 'MISSING',
      });

      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.error('❌ Twilio credentials not configured');
        return false;
      }

      const smsMessage = `New Order! ${data.companyName} - ${data.contactName}. ${data.quantity}x ${data.bottleType}. Delivery: ${new Date(data.deliveryDate).toLocaleDateString()}. ID: ${data.orderId.slice(0, 8)}`;

      const auth = Buffer.from(
        `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
      ).toString('base64');

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`,
          },
          body: new URLSearchParams({
            To: data.mobileNumber.startsWith('+') ? data.mobileNumber : `+91${data.mobileNumber}`,
            From: TWILIO_PHONE_NUMBER,
            Body: smsMessage,
          }).toString(),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ SMS sent successfully:', responseData);
        return true;
      } else {
        console.error('❌ SMS sending failed:', responseData);
        return false;
      }
    } catch (error) {
      console.error('❌ SMS error:', error);
      return false;
    }
  },
};
