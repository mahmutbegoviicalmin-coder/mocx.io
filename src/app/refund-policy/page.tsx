"use client";

import { Navbar } from "@/components/Navbar";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container max-w-4xl mx-auto py-32 px-4 space-y-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
            
            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">1. Overview</h3>
                <p>
                  Mocx is a subscription-based service that provides access to AI-powered mockup generation and related features.
                </p>
                <p>
                  Because our product is digital and usage-based, we generally do not offer refunds once a subscription payment has been processed and the Service has been used.
                </p>
                <p>
                  However, we understand that technical issues can occur. This policy explains when a refund may be granted.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">2. Payments via Paddle</h3>
                <p>
                  All purchases and subscription payments for Mocx are processed by our online reseller and Merchant of Record, Paddle.com.
                </p>
                <p>
                  Paddle handles billing, payment security, invoices and applicable taxes.
                </p>
                <p>
                  In many cases, refunds will be processed by Paddle on our behalf, subject to both this Refund Policy and Paddle’s buyer terms.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">3. Non-Refundable Situations</h3>
                <p>You are not eligible for a refund in the following situations:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>You changed your mind or no longer need the Service.</li>
                    <li>You forgot to cancel before your subscription renewed.</li>
                    <li>You did not use Mocx during the billing period.</li>
                    <li>You used credits, generated images or mockups, but later decided you do not like the results.</li>
                    <li>Your account was terminated due to a breach of our Terms of Service (e.g. abuse or prohibited content).</li>
                </ul>
                <p className="mt-2">
                  Subscription fees, once charged and where the Service is functioning as described, are non-refundable.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">4. When Refunds May Be Granted (Service Not Working)</h3>
                <p>We may issue a partial or full refund only if:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>The Mocx Service was not available or not functioning as described for you due to a technical issue on our side, and</li>
                    <li>You contacted us at <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a> within a reasonable time (typically 7 days from the charge or from when you noticed the issue), and</li>
                    <li>Our support team was unable to resolve the problem or provide a suitable workaround.</li>
                </ul>
                <p className="mt-4 mb-2 font-medium text-white">Examples include:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>continuous server errors preventing you from generating any mockups;</li>
                    <li>billing charged but you had no access to your plan due to our error.</li>
                </ul>
                <p className="mt-2">
                  We reserve the right to investigate each case and request additional information (logs, screenshots, etc.) to verify the issue before deciding on a refund.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">5. How to Request a Refund</h3>
                <p>To request a refund:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Email <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a> from the email associated with your Mocx account;</li>
                    <li>Include:
                        <ul className="list-disc pl-5 mt-1">
                            <li>your name,</li>
                            <li>the email used for purchase,</li>
                            <li>date and amount of the charge,</li>
                            <li>a description of the issue and any relevant screenshots or error messages.</li>
                        </ul>
                    </li>
                </ul>
                <p className="mt-2">
                  If your payment was processed by Paddle (most cases), we may coordinate with Paddle to review your request. If a refund is approved, it will be processed back to the original payment method used at checkout.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">6. Subscription Cancellations</h3>
                <p>
                  You can cancel your subscription at any time from your account settings or by contacting support.
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Cancellation stops future renewals.</li>
                    <li>You will keep access to Mocx until the end of your current billing period.</li>
                    <li>Cancellation does not automatically entitle you to a refund for the current or past billing periods.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">7. Chargebacks and Disputes</h3>
                <p>
                  If you initiate a chargeback or payment dispute with your bank or payment provider, we may:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>suspend or terminate your Mocx account, and</li>
                    <li>treat the dispute as a violation of these Terms if the charge is found to be valid.</li>
                </ul>
                <p className="mt-2">
                  If you experience an issue, please contact us first at <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a> so we can help resolve it.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">8. Changes to This Policy</h3>
                <p>
                  We may update this Refund Policy from time to time. When we do, we will update the “Last updated” date and, where appropriate, notify you.
                </p>
            </section>
        </div>
      </div>
    </main>
  );
}
