Project Overview:
This project add on the real-world functionallity to the auto repair website by integrating
payment processing and email notification. Customers can now book an appointment and pay a $100 deposite through Stripe.
Secondly Users can Fill out the appointment service form and will now recieve an confirmation email using Resend.


API Services Used
- Stripe API: Through the Stripe testing, the auto repair website now handles secure payment processing through a hosted checkout session
- Resend API: Send automated email confirmation after users fills out form and an appointmen it then submitted

How To Run Project
1. First you Clone the Repo
2. Install the dependencies: npm install and npm install resend so that it can connect to the Resend account
3. Have a .env file created: This contains the environmental variables in Netlify
example: of environmental variables
- STRIPE_SECRET_KEY=your_stripe_key
- RESEND_API_KEY=your_resend_key

When Testing the website in the browser
- Fill out the appointment form, this will trigger the email notification
- Click the "Pay Deposite" this will redirect you to the Stripe Checkout
