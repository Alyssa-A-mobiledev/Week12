const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    const data = await resend.emails.send({
      from: 'Leslie Auto Repair <onboarding@resend.dev>',
      to: email,
      subject: 'Appointment Request Received – Leslie Auto Repair',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #1a365d; padding: 24px 32px;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Leslie Auto Repair</h1>
          </div>

          <div style="padding: 32px;">
            <h2 style="color: #1a365d;">Thanks, ${name || 'there'}!</h2>

            <p>We've received your appointment request and will contact you within one business day.</p>

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
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error('Resend error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};