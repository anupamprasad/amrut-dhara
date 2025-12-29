import {supabase} from './supabase';
import {
  RESEND_API_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
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
      // Get user email from current session
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user?.email) {
        console.warn('User email not found, skipping notifications');
        return;
      }

      const notificationData: NotificationData = {
        orderId,
        userEmail: user.email,
        contactName: orderData.contact_name,
        companyName: orderData.company_name,
        mobileNumber: orderData.mobile_number,
        bottleType: orderData.bottle_type,
        quantity: orderData.quantity,
        deliveryAddress: orderData.delivery_address,
        deliveryDate: orderData.delivery_date,
        notes: orderData.notes,
      };

      // Send email and SMS in parallel (non-blocking)
      Promise.all([
        this.sendEmail(notificationData),
        this.sendSMS(notificationData),
      ]).catch(error => {
        console.error('Notification error:', error);
        // Don't throw - notifications failing shouldn't break order creation
      });
    } catch (error) {
      console.error('Failed to send notifications:', error);
      // Silently fail - notifications are not critical
    }
  },

  /**
   * Send email notification via Resend
   */
  async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Order Confirmation - Amrut Dhara</h2>
          <p>Dear ${data.contactName},</p>
          <p>Your order has been successfully placed!</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0;">${data.orderId.slice(0, 8)}...</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Company:</strong></td>
                <td style="padding: 8px 0;">${data.companyName}</td>
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
          
          <p>We will notify you when your order status changes.</p>
          <p>Thank you for your business!</p>
          <p style="color: #6b7280;"><em>Amrut Dhara Team</em></p>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Amrut Dhara <orders@amrutdhara.com>', // Update with your verified domain
          to: [data.userEmail],
          subject: `Order Confirmation - Order #${data.orderId.slice(0, 8)}`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully');
        return true;
      } else {
        const error = await response.json();
        console.error('Email sending failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Email error:', error);
      return false;
    }
  },

  /**
   * Send SMS notification via Twilio
   */
  async sendSMS(data: NotificationData): Promise<boolean> {
    try {
      const smsMessage = `Amrut Dhara: Your order for ${data.quantity} x ${data.bottleType} bottles has been confirmed! Delivery on ${new Date(data.deliveryDate).toLocaleDateString()}. Order ID: ${data.orderId.slice(0, 8)}`;

      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.warn('Twilio credentials not configured');
        return false;
      }

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
            To: data.mobileNumber,
            From: TWILIO_PHONE_NUMBER,
            Body: smsMessage,
          }).toString(),
        },
      );

      if (response.ok) {
        console.log('SMS sent successfully');
        return true;
      } else {
        const error = await response.json();
        console.error('SMS sending failed:', error);
        return false;
      }
    } catch (error) {
      console.error('SMS error:', error);
      return false;
    }
  },
};
