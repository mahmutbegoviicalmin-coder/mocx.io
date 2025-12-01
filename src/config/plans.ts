export const PLANS = {
  starter: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL_STARTER_MONTHLY || 'https://mocx.lemonsqueezy.com/buy/fd64b852-2e20-4b68-96c3-0faf003a0056?embed=1&media=0&logo=0&desc=0&enabled=1122925',
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL_STARTER_YEARLY || 'https://mocx.lemonsqueezy.com/buy/0bb38bd2-afe5-4884-be35-32f99c9dc604?embed=1&media=0&logo=0&desc=0&enabled=1122931',
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL_PRO_MONTHLY || 'https://mocx.lemonsqueezy.com/buy/45b9afac-a03d-4e9d-ba04-369cbda55532?embed=1&media=0&logo=0&desc=0&enabled=1122927',
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL_PRO_YEARLY || 'https://mocx.lemonsqueezy.com/buy/6d2824ac-2fc5-4468-9c3c-9d2195206d66?embed=1&media=0&logo=0&desc=0&enabled=1122932',
  },
  agency: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL_AGENCY_MONTHLY || 'https://mocx.lemonsqueezy.com/buy/9021c96c-6e28-4935-be06-cac71d80730a?embed=1&media=0&logo=0&desc=0&enabled=1122929',
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL_AGENCY_YEARLY || 'https://mocx.lemonsqueezy.com/buy/af8bb6ff-89b2-4338-9dd4-ecb2f559a112?embed=1&media=0&logo=0&desc=0&enabled=1122933',
  },
};
