"use client";

import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container max-w-4xl mx-auto py-32 px-4 space-y-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">1. Agreement to Terms</h3>
                <p>
                  These Terms of Service (“Terms”) govern your access to and use of the Mocx website, app and related services (collectively, “Mocx”, the “Service”).
                </p>
                <p>
                  By creating an account, starting a subscription, or using Mocx in any way, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">2. Eligibility</h3>
                <p>You may use Mocx only if you:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>are at least 18 years old (or the age of legal majority in your jurisdiction), and</li>
                    <li>have the authority to enter into a binding agreement with us.</li>
                </ul>
                <p className="mt-2">
                  If you use Mocx on behalf of a company or organization, you represent that you are authorized to accept these Terms on its behalf.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">3. Accounts</h3>
                <p>
                  To use Mocx, you may need to create an account and provide a valid email address and password or use a third-party authentication provider.
                </p>
                <p className="mt-2">You are responsible for:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>keeping your login credentials confidential,</li>
                    <li>all activity that occurs under your account, and</li>
                    <li>notifying us promptly at <a href="mailto:mocxsup@gmail.com" className="text-primary hover:underline">mocxsup@gmail.com</a> of any unauthorized access or security issue.</li>
                </ul>
                <p className="mt-2">
                  We may suspend or terminate your account if we suspect any breach of these Terms.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">4. Subscriptions, Billing & Lemon Squeezy as Merchant of Record</h3>
                
                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">1. Plans and billing</h4>
                <p>
                  Mocx is offered on a subscription basis, including monthly and yearly (discounted) plans.
                  Current prices, features and limits of each plan are displayed on our Pricing page.
                  By starting a paid subscription, you authorize our payment provider, Lemon Squeezy, to charge the applicable fees in the currency shown at checkout, plus any applicable taxes.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">2. Lemon Squeezy as Merchant of Record</h4>
                <p>
                  All orders and payments for Mocx are handled by our online reseller and Merchant of Record, Lemon Squeezy.
                </p>
                <p>
                  Lemon Squeezy is responsible for processing your payment, billing, and invoicing.
                  We do not handle or store your full payment card details on our servers.
                  Your purchase is subject to Lemon Squeezy’s buyer terms and privacy policy in addition to these Terms.
                  For questions related to your payment, invoice or VAT, you may be directed to Lemon Squeezy’s support.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">3. Auto-renewal</h4>
                <p>
                  Subscriptions automatically renew at the end of each billing period (monthly or yearly), unless you cancel before the renewal date.
                  By subscribing, you authorize Lemon Squeezy to charge the recurring subscription fee using your chosen payment method until you cancel.
                  You can cancel at any time via your account or by contacting support, but cancellation will apply to the next billing period and does not automatically entitle you to a refund (see Refund Policy).
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">4. Changes to pricing and plans</h4>
                <p>
                  We may change subscription prices, features or plan structure from time to time. Any change will be communicated in advance where required by law, and will apply on your next renewal. If you do not agree to the new price or features, you may cancel before the change takes effect.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">5. License and Acceptable Use</h3>
                
                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">1. License to use Mocx</h4>
                <p>
                  Subject to these Terms and your subscription, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use Mocx for your own business or personal purposes, in accordance with the features of your plan.
                </p>
                <p className="mt-2">You may not:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>resell, sublicense or share your account with third parties;</li>
                    <li>attempt to reverse engineer, decompile or otherwise access the source code of Mocx;</li>
                    <li>bypass or interfere with security or usage limits;</li>
                    <li>abuse the Service in a way that harms our systems or other users.</li>
                </ul>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">2. Prohibited content</h4>
                <p>
                  You agree not to upload, provide prompts for, or otherwise use Mocx to generate or process content that is:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>illegal, infringing, or violates any third-party intellectual property or privacy rights;</li>
                    <li>hateful, harassing, abusive, or discriminatory;</li>
                    <li>pornographic or sexually explicit;</li>
                    <li>related to fraud, scams, malware, or other malicious activity.</li>
                </ul>
                <p className="mt-2">
                  We reserve the right to suspend or terminate accounts that violate these rules.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">6. AI-Generated Content & Intellectual Property</h3>
                
                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">1. Your content</h4>
                <p>
                  You retain any rights you have in the images, screenshots, logos and other materials (“Input Content”) that you upload or provide to Mocx. You are solely responsible for ensuring that you have the necessary rights to use such content with Mocx.
                </p>
                <p>
                  By using Mocx, you grant us a limited, worldwide, non-exclusive license to host, process and display your Input Content and generated mockups (“Output Content”) solely for the purpose of providing the Service to you, improving our models, preventing abuse, and maintaining logs and backups.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">2. AI-generated output</h4>
                <p>
                  Subject to the rights of any third parties in your Input Content and applicable law, we grant you a license to use the Output Content for your own business or personal purposes, including commercial use, in accordance with your subscription plan and these Terms.
                </p>
                <p>
                  You are responsible for reviewing and using the Output Content in a manner that complies with all applicable laws and third-party rights.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">3. Mocx IP</h4>
                <p>
                  Mocx, including its software, design, branding, models, and all related intellectual property, is owned or licensed by us and is protected by copyright and other laws.
                </p>
                <p>
                  Nothing in these Terms transfers ownership of Mocx to you. You may not use our trademarks, logos or branding without our prior written consent.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">7. Third-Party Services</h3>
                <p>
                  Mocx may integrate with or rely on third-party services (such as authentication providers, analytics tools or payment processors like Lemon Squeezy). Your use of those services is subject to the third party’s own terms and privacy policy.
                </p>
                <p>
                  We are not responsible for any third-party services and do not control how they operate.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">8. Service Availability and Modifications</h3>
                <p>
                  We aim to keep Mocx available and functioning smoothly, but we do not guarantee 100% uptime.
                </p>
                <p>
                  We may modify, suspend or discontinue parts of the Service at any time (for example, to improve performance, address security issues or comply with law). Where a change has a material impact on your use of Mocx, we will give reasonable notice when practicable.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">9. Refunds</h3>
                <p>
                  Our refund rules are described in more detail in our separate Refund Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  In summary: subscriptions are generally non-refundable, except where the Service does not function as described and we are unable to resolve the issue after you contact support within a reasonable time.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">10. Disclaimer of Warranties</h3>
                <p>
                  Mocx is provided on an “as is” and “as available” basis.
                </p>
                <p>
                  To the maximum extent permitted by law, we disclaim all warranties, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
                <p className="mt-2">We do not warrant that:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Mocx will be uninterrupted, secure or error-free;</li>
                    <li>the Output Content will be accurate, free from defects, or suitable for any specific use;</li>
                    <li>any particular result or commercial outcome will be achieved by using Mocx.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">11. Limitation of Liability</h3>
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>We shall not be liable for any indirect, incidental, consequential, special, or punitive damages, or any loss of profits, revenue, data, or business opportunities, arising out of or in connection with your use of Mocx.</li>
                    <li>Our total aggregate liability for any claims arising out of or relating to the Service or these Terms shall not exceed the amount you paid for Mocx in the three (3) months preceding the event giving rise to the claim.</li>
                </ul>
                <p className="mt-2">
                  Some jurisdictions do not allow certain limitations of liability, so some of the above may not apply to you.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">12. Indemnification</h3>
                <p>
                  You agree to indemnify and hold harmless Mocx from and against any claims, damages, losses, liabilities, costs and expenses (including reasonable attorneys’ fees) arising out of or related to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>your use of Mocx;</li>
                    <li>your Input Content or Output Content;</li>
                    <li>your breach of these Terms or violation of any law or third-party rights.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">13. Termination</h3>
                <p>
                  You may stop using Mocx and cancel your subscription at any time.
                </p>
                <p className="mt-2">We may suspend or terminate your access to Mocx, with or without notice, if:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>you breach these Terms;</li>
                    <li>your subscription is not paid when due;</li>
                    <li>we are required to do so by law or by our payment provider.</li>
                </ul>
                <p className="mt-2">
                  Upon termination, your right to access Mocx will cease. Some provisions of these Terms will survive termination, including intellectual property, limitations of liability and indemnification.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">14. Changes to These Terms</h3>
                <p>
                  We may update these Terms from time to time. When we do, we will update the “Last updated” date at the top of this page and, where appropriate, notify you by email or in-app.
                </p>
                <p>
                  If you continue using Mocx after changes take effect, you agree to the updated Terms.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">15. Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the jurisdiction in which we operate, without regard to conflict of law principles.
                </p>
                <p>
                  Where legally allowed, any disputes arising out of or relating to these Terms or the Service shall be resolved by the competent courts in that jurisdiction.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">16. Contact</h3>
                <p>
                  If you have any questions about these Terms, you can contact us at:
                </p>
                <p className="mt-2">
                  Email: <a href="mailto:mocxsup@gmail.com" className="text-primary hover:underline">mocxsup@gmail.com</a>
                </p>
            </section>
        </div>
      </div>
    </main>
  );
}
