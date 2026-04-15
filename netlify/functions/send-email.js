const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, service } = JSON.parse(event.body || '{}');

  if (!email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email address is required' }),
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Leslie Auto Repair',
      },
      subject: 'Appointment Request Received – Leslie Auto Repair',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #1a365d; padding: 24px 32px;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Leslie Auto Repair</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1a365d;">Thanks, ${name || 'there'}!</h2>
            <p>We've received your appointment request and will be in touch within one business day to confirm.</p>

            <div style="background: #f7f7f7; border-left: 4px solid #ed8936; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0 0 8px;"><strong>Service Requested:</strong> ${service || 'Auto Repair Service'}</p>
              <p style="margin: 0;"><strong>Status:</strong> Pending Confirmation</p>
            </div>

            <p>Questions? Call us at <strong>(954) 816-2450</strong>.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
            <p style="color: #888; font-size: 0.85rem; margin: 0;">
              Leslie Auto Repair &bull; 8455 Oakland Park Blvd, Sunrise, FL 33351
            </p>
          </div>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('SendGrid error:', JSON.stringify(error.response?.body || error.message));
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
