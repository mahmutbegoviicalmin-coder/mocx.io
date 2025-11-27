import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto py-32 px-4 space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Legal Documentation</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Terms of Service */}
        <section id="terms" className="space-y-4">
          <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Terms of Service</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p>
              Welcome to Mocx. By accessing our website and using our AI mockup generation services, you agree to these Terms of Service.
            </p>
            
            <h3 className="text-foreground font-semibold mt-4">1. Service Description</h3>
            <p>
              Mocx provides an AI-powered platform that transforms text prompts and reference images into professional product mockups. We utilize advanced third-party AI models (specifically the NanoBanana/Gemini ecosystem) to process your requests.
            </p>

            <h3 className="text-foreground font-semibold mt-4">2. User Responsibilities</h3>
            <p>
              You are responsible for all content you upload or generate. You agree NOT to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate illegal, harmful, sexually explicit, or violent content.</li>
              <li>Upload images that violate the intellectual property rights of others.</li>
              <li>Use the service to harass, defame, or defraud anyone.</li>
            </ul>
            <p>
              We reserve the right to suspend your account without notice if you violate these rules.
            </p>

            <h3 className="text-foreground font-semibold mt-4">3. Intellectual Property</h3>
            <p>
              <strong>Your Inputs:</strong> You retain ownership of the images and prompts you upload to Mocx.
              <br />
              <strong>Generated Outputs:</strong> Subject to the terms of our AI providers, you own the commercial rights to the images you generate on Mocx, provided you have a paid subscription. Free tier generations may be subject to Creative Commons licenses or public display.
            </p>

            <h3 className="text-foreground font-semibold mt-4">4. Limitation of Liability</h3>
            <p>
              Mocx is provided "as is". We do not guarantee that the service will be uninterrupted or error-free. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Privacy Policy</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p>
              Your privacy is critical. This section explains how we handle your data.
            </p>

            <h3 className="text-foreground font-semibold mt-4">1. Data Collection</h3>
            <p>
              We collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Info:</strong> Email address and authentication details (via Clerk).</li>
              <li><strong>Usage Data:</strong> Text prompts, uploaded images, and generated outputs.</li>
              <li><strong>Technical Data:</strong> IP addresses and browser cookies for security and analytics.</li>
            </ul>

            <h3 className="text-foreground font-semibold mt-4">2. How We Use Your Data</h3>
            <p>
              We use your data solely to provide and improve the Mocx service. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your prompts and uploaded images are sent to our AI partners (NanoBanana/Google) strictly for the purpose of generating your result.</li>
              <li>We do NOT sell your personal data to third parties.</li>
              <li>We may store your generated images to display in your personal dashboard history.</li>
            </ul>

            <h3 className="text-foreground font-semibold mt-4">3. Third-Party Processors</h3>
            <p>
              We trust the following third parties to help operate Mocx:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Vercel:</strong> For hosting and serverless infrastructure.</li>
              <li><strong>Clerk:</strong> For secure user authentication.</li>
              <li><strong>NanoBanana / Google AI:</strong> For image generation processing.</li>
            </ul>
          </div>
        </section>

        {/* Refund Policy */}
        <section id="refund" className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Refund Policy</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p>
              Since Mocx offers immediate access to digital goods and high-cost compute resources, our refund policy is as follows:
            </p>

            <h3 className="text-foreground font-semibold mt-4">1. Subscription Refunds</h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing cycle. We generally do not offer refunds for partial months or unused credits.
            </p>

            <h3 className="text-foreground font-semibold mt-4">2. Technical Failures</h3>
            <p>
              If a technical error on our end (e.g., API failure, server crash) results in a failed generation where you were charged or lost credits, we will happily refund the specific charge or restore your credits. Please contact support with the Task ID.
            </p>

            <h3 className="text-foreground font-semibold mt-4">3. Satisfaction</h3>
            <p>
              Due to the subjective nature of AI art, we cannot offer refunds simply because you do not like the aesthetic style of a generated image. We encourage you to use our free trials or "Starter" tiers to test the quality before committing to larger plans.
            </p>
          </div>
        </section>

        <div className="pt-12 border-t border-border text-center">
          <p className="text-muted-foreground">
            Contact us at <a href="mailto:support@mocx.io" className="text-primary hover:underline">support@mocx.io</a>
          </p>
        </div>
      </div>
    </main>
  );
}

