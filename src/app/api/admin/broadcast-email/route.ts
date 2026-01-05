import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (email !== ADMIN_EMAIL) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const { subject, message, testMode } = await req.json();

    if (!subject || !message) {
        return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // 1. Fetch Users
    const users = await client.users.getUserList({ limit: 500 });
    
    // 2. Filter Free Users
    const targetUsers = users.data.filter(u => {
        const plan = (u.publicMetadata.planName as string) || 'Free Plan';
        return plan === 'Free Plan';
    });

    const emails = targetUsers
        .map(u => u.emailAddresses[0]?.emailAddress)
        .filter(e => e && e.includes('@')); // Basic validation

    if (emails.length === 0) {
        return NextResponse.json({ message: 'No free users found.' });
    }

    // 3. Send Emails
    // If test mode, send only to admin
    const recipients = testMode ? [ADMIN_EMAIL] : emails;

    // Resend Batch Limit is usually 50-100. For safety, we send one by one or in small batches via BCC.
    // Best practice for marketing is individual sends or BCC if list is small.
    // For < 100 users, BCC is okay. For more, loop.
    
    // Let's use BCC to save API calls for now (Limit is usually 50 recipients per call on free tier)
    // We will split into chunks of 40
    
    const chunkSize = 40;
    for (let i = 0; i < recipients.length; i += chunkSize) {
        const chunk = recipients.slice(i, i + chunkSize);
        
        await resend.emails.send({
            from: 'Mocx Team <team@mocx.io>', // CHANGE THIS TO YOUR VERIFIED DOMAIN
            to: ['mahmutbegoviic.almin@gmail.com'], // Always send "to" admin, BCC everyone else for privacy
            bcc: chunk,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    ${message.replace(/\n/g, '<br>')}
                    <br><br>
                    <hr>
                    <p style="font-size: 12px; color: #888;">
                        You received this email because you signed up for Mocx.io.
                        <a href="https://mocx.io">Unsubscribe</a>
                    </p>
                </div>
            `
        });
    }

    return NextResponse.json({ 
        success: true, 
        count: recipients.length, 
        mode: testMode ? 'TEST' : 'LIVE' 
    });

  } catch (error) {
    console.error('Email broadcast error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}


