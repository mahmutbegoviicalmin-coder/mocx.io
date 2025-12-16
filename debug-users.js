require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
    console.error('Error: CLERK_SECRET_KEY is missing from environment variables.');
    process.exit(1);
}

async function checkUsers() {
    console.log('Fetching users from Clerk...');
    
    try {
        const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
            headers: {
                'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Clerk API Error: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();
        console.log(`Found ${users.length} users.\n`);

        let paidCount = 0;
        let freeCount = 0;
        let unknownCount = 0;

        users.forEach(user => {
            const email = user.email_addresses[0]?.email_address;
            const publicMeta = user.public_metadata || {};
            const privateMeta = user.private_metadata || {};
            
            const planName = publicMeta.planName || 'N/A';
            const credits = publicMeta.credits;
            const subStatus = publicMeta.subscriptionStatus || privateMeta.status || 'N/A';

            console.log(`User: ${email}`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Plan: ${planName}`);
            console.log(`  Credits: ${credits}`);
            console.log(`  Sub Status: ${subStatus}`);
            console.log('---');

            if (planName === 'Free Plan' || planName === 'N/A') {
                freeCount++;
            } else if (planName.includes('Starter') || planName.includes('Pro') || planName.includes('Agency')) {
                paidCount++;
            } else {
                unknownCount++;
            }
        });

        console.log('\nSummary:');
        console.log(`Free: ${freeCount}`);
        console.log(`Paid: ${paidCount}`);
        console.log(`Unknown/Other: ${unknownCount}`);

    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
}

checkUsers();

