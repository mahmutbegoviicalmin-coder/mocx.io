"use client";

import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container max-w-4xl mx-auto py-32 px-4 space-y-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
            
            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">1. Introduction</h3>
                <p>
                  This Privacy Policy explains how Mocx (“Mocx”, “we”, “us”, “our”) collects, uses and protects your personal data when you visit our website, create an account, use our Service or interact with us.
                </p>
                <p>
                  We are committed to protecting your privacy and handling your information in a transparent and secure way.
                </p>
                <p>
                  By using Mocx, you agree to the practices described in this Privacy Policy.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">2. Who We Are</h3>
                <p>
                  Mocx is an online service that generates mockups and visuals from screenshots, websites and images.
                </p>
                <p>
                  Mocx is operated from Sarajevo, Bosnia and Herzegovina.
                </p>
                <p>
                  If you have any questions about this Policy, you can contact us at <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a>.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">3. Scope</h3>
                <p>This Privacy Policy applies to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>visitors to our website,</li>
                    <li>users who create an account and use Mocx,</li>
                    <li>subscribers to our newsletters or marketing,</li>
                    <li>people who contact us via email or support.</li>
                </ul>
                <p className="mt-2">
                  It does not apply to third-party websites or services linked to from Mocx (including Paddle), which have their own privacy policies.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">4. Data We Collect</h3>
                <p>We collect the following categories of personal data:</p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">1. Account and profile information</h4>
                <p>When you sign up for Mocx, we may collect:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>name (if you choose to provide it)</li>
                    <li>email address</li>
                    <li>password or authentication token</li>
                    <li>account settings and preferences</li>
                </ul>
                <p className="mt-2">
                  If you sign in via a third-party authentication provider, we may receive basic profile information from that provider (e.g. email).
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">2. Subscription and billing information</h4>
                <p>
                  Payments for Mocx are processed by our reseller and Merchant of Record, Paddle. When you start a subscription:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Paddle collects your payment details (e.g. card number, billing address, VAT number) and processes the transaction on our behalf.</li>
                    <li>We receive limited information from Paddle, such as payment status, plan type, country, and partial billing information needed for account management and tax reporting.</li>
                    <li>We do not store or process your full payment card information on our servers.</li>
                </ul>
                <p className="mt-2">
                  For details on how Paddle handles your data, please refer to Paddle’s own privacy policy.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">3. Usage data</h4>
                <p>When you use Mocx, we may automatically collect:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>log data (IP address, browser type, device information, referring URLs, date and time of access)</li>
                    <li>interactions with the interface (e.g. clicks, pages viewed, features used)</li>
                    <li>prompt text and generation metadata (for troubleshooting and abuse prevention)</li>
                </ul>
                <p className="mt-2">
                  We use this information to operate, secure and improve the Service.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">4. Content you upload or generate</h4>
                <p>
                  We process the images, screenshots, website URLs, prompts and output mockups (“Content”) that you use with Mocx. This may include personal data if it appears in the content you upload.
                </p>
                <p className="mt-2">We use this Content to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>generate results for you;</li>
                    <li>maintain backups and logs;</li>
                    <li>improve our models and features (where allowed by law and our agreements);</li>
                    <li>prevent abuse and misuse of the Service.</li>
                </ul>
                <p className="mt-2">
                  You should avoid uploading sensitive personal data unless it is strictly necessary.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">5. Cookies and similar technologies</h4>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>remember your preferences;</li>
                    <li>keep you logged in;</li>
                    <li>measure website traffic and performance;</li>
                    <li>support marketing and analytics (e.g. Google Analytics, Meta Pixel if implemented).</li>
                </ul>
                <p className="mt-2">
                  You can control cookies through your browser settings, but some features of the Service may not function properly if you disable them.
                </p>

                <h4 className="text-foreground font-medium text-lg mt-4 mb-2">6. Communications</h4>
                <p>
                  If you contact us by email, support form or in-app chat, we collect your contact details and any information you choose to share, so we can respond to your request.
                </p>
                <p>
                  If you subscribe to our newsletter, we collect your email address and track open/click rates to improve our communication.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">5. How We Use Your Data</h3>
                <p>We use your personal data for the following purposes:</p>
                
                <div className="space-y-4 mt-4">
                    <div>
                        <strong className="text-white">To operate and provide the Service</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Create and manage your account</li>
                            <li>Generate mockups based on your inputs</li>
                            <li>Provide customer support and technical assistance</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white">To process payments and subscriptions</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Manage billing through Paddle</li>
                            <li>Notify you of subscription status, renewals or changes</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white">To improve Mocx</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Analyze usage patterns</li>
                            <li>Debug and enhance performance</li>
                            <li>Develop new features and capabilities</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white">To maintain security and prevent abuse</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Detect and prevent fraud, spam, or misuse</li>
                            <li>Enforce our Terms of Service</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white">To communicate with you</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Send service-related emails (e.g. account, billing, security)</li>
                            <li>Send optional product updates, tips or marketing emails (you can unsubscribe at any time)</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white">To comply with legal obligations</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Tax, accounting, and regulatory requirements</li>
                            <li>Responding to lawful requests from authorities where required</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">6. Legal Bases (for users in the EU/EEA/UK)</h3>
                <p>Where applicable data protection laws (like GDPR) apply, we process your personal data on the following legal bases:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li><strong>Contract</strong> – to provide the Service you requested and manage your subscription;</li>
                    <li><strong>Legitimate interests</strong> – to secure and improve Mocx, analyze usage, and prevent abuse;</li>
                    <li><strong>Consent</strong> – for certain cookies, marketing emails and optional analytics;</li>
                    <li><strong>Legal obligation</strong> – to comply with tax, accounting or regulatory requirements.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">7. How We Share Your Data</h3>
                <p>We do not sell your personal data.</p>
                <p className="mt-2">We may share your information with:</p>
                
                <div className="space-y-4 mt-4">
                    <div>
                        <strong className="text-white">Service providers</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Payment processing (Paddle)</li>
                            <li>Authentication, hosting, logging, analytics, email delivery and customer support tools</li>
                        </ul>
                        <p className="mt-1 text-sm">These providers only process your data on our behalf and under appropriate data protection agreements.</p>
                    </div>

                    <div>
                        <strong className="text-white">Legal and compliance</strong>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>If required by law, court order, or governmental authority</li>
                            <li>To protect our rights, property, or safety, or that of our users and the public</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-white">Business transfers</strong>
                        <p className="mt-1">
                            In connection with a merger, acquisition, sale of assets or similar transaction, your data may be transferred as part of the business, subject to appropriate safeguards.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">8. International Transfers</h3>
                <p>
                  Because we and our service providers (including Paddle) may operate globally, your information may be transferred to and processed in countries outside your own, including countries that may not provide the same level of data protection.
                </p>
                <p className="mt-2">
                  Where required by law, we implement appropriate safeguards (such as standard contractual clauses) to ensure your data remains protected.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">9. Data Retention</h3>
                <p>We retain your personal data only for as long as necessary to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>provide Mocx to you;</li>
                    <li>comply with legal, tax and accounting obligations;</li>
                    <li>resolve disputes and enforce our agreements.</li>
                </ul>
                <p className="mt-4 mb-2 font-medium text-white">In general:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Account information is kept for as long as your account is active.</li>
                    <li>Certain log and billing data may be retained for a longer period where required by law.</li>
                    <li>Content you upload or generate may be deleted when you delete it or close your account, subject to backups and legal obligations.</li>
                </ul>
                <p className="mt-4">
                  You can request deletion of your account and associated data by contacting <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a>. Some information may remain in backups for a limited time.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">10. Your Rights</h3>
                <p>Depending on your location and applicable law, you may have the right to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>access the personal data we hold about you;</li>
                    <li>correct inaccurate or incomplete data;</li>
                    <li>request deletion of your data;</li>
                    <li>restrict or object to certain processing;</li>
                    <li>withdraw consent where processing is based on consent;</li>
                    <li>receive a copy of your data in a portable format.</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a>.
                </p>
                <p className="mt-2">
                  We may ask you to verify your identity before responding.
                </p>
                <p className="mt-2">
                  If you believe your rights have been violated, you may also lodge a complaint with your local data protection authority.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">11. Children’s Privacy</h3>
                <p>
                  Mocx is not directed to children under 18, and we do not knowingly collect personal data from children.
                </p>
                <p>
                  If you believe a child has provided us with personal data, please contact us and we will take steps to remove the information.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">12. Security</h3>
                <p>
                  We use reasonable technical and organizational measures to protect your personal data against loss, misuse and unauthorized access, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>encryption in transit (HTTPS),</li>
                    <li>access controls and authentication,</li>
                    <li>regular monitoring and logging.</li>
                </ul>
                <p className="mt-2">
                  However, no system is completely secure, and we cannot guarantee absolute security.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">13. Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. When we make changes, we will update the “Last updated” date at the top and, where appropriate, notify you by email or through the Service.
                </p>
                <p>
                  Your continued use of Mocx after the updated Policy becomes effective means you accept the changes.
                </p>
            </section>

            <section>
                <h3 className="text-foreground font-semibold text-xl mb-4">14. Contact</h3>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, you can contact us at:
                </p>
                <p className="mt-2">
                  Email: <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a>
                </p>
                <p>
                  Location: Sarajevo, Bosnia and Herzegovina
                </p>
            </section>
        </div>
      </div>
    </main>
  );
}
