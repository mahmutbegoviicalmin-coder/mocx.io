export const PLANS = {
  starter: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_YEARLY || '',
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_YEARLY || '',
  },
  agency: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_AGENCY_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_AGENCY_YEARLY || '',
  },
};

