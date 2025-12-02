import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock send if API key is missing (for development without keys)
    if (!process.env.RESEND_API_KEY) {
        console.log('RESEND_API_KEY missing. Contact form submission:', { name, email, message });
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return NextResponse.json({ success: true, mode: 'mock' });
    }

    const data = await resend.emails.send({
      from: 'Mocx Contact <onboarding@resend.dev>', // Use your verified domain in production
      to: ['mocxsup@gmail.com'],
      subject: `New Contact: ${name}`,
      replyTo: email,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
    });

    if (data.error) {
        console.error('Resend error:', data.error);
        return NextResponse.json({ error: 'Failed to send email via provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

