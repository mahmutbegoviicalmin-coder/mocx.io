import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C0C0E] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5B8DEF]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#7BA4F7]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="mb-8 transition-opacity hover:opacity-80">
        <Image 
          src="/light.png" 
          alt="Mocx Logo" 
          width={140} 
          height={50} 
          className="object-contain"
          priority
        />
      </Link>

      <SignUp 
        fallbackRedirectUrl="/dashboard/billing" 
        forceRedirectUrl="/dashboard/billing"
        appearance={{
            baseTheme: dark,
            variables: {
                colorPrimary: '#5B8DEF',
                colorBackground: '#131316',
                colorInputBackground: '#1A1A1E',
                colorInputText: '#E8E8E8',
                colorText: '#E8E8E8',
                colorTextSecondary: '#6B6B70',
                borderRadius: '0.75rem',
            },
            elements: {
                rootBox: "shadow-2xl shadow-black/50 w-full max-w-md",
                card: "border border-white/[0.06] bg-[#131316]/90 backdrop-blur-xl w-full",
                headerTitle: "text-white text-2xl font-semibold",
                headerSubtitle: "text-[#6B6B70]",
                socialButtonsBlockButton: "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] text-white transition-all duration-200",
                socialButtonsBlockButtonText: "text-white font-medium",
                formButtonPrimary: "bg-gradient-to-r from-[#5B8DEF] to-[#4A7DE0] hover:from-[#6B9DF0] hover:to-[#5B8DEF] transition-all duration-300 shadow-[0_4px_20px_rgba(91,141,239,0.25)] hover:shadow-[0_8px_30px_rgba(91,141,239,0.35)] text-white font-semibold",
                footerActionLink: "text-[#5B8DEF] hover:text-[#7BA4F7] font-medium transition-colors",
                dividerLine: "bg-white/[0.06]",
                dividerText: "text-[#6B6B70]",
                formFieldLabel: "text-[#E8E8E8]/70",
                formFieldInput: "bg-[#1A1A1E] border-white/[0.06] focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF]/20 transition-all duration-200 text-white",
                identityPreviewText: "text-[#E8E8E8]",
                identityPreviewEditButtonIcon: "text-[#5B8DEF]",
                formFieldSuccessText: "text-emerald-400",
                formFieldInputShowPasswordButton: "text-[#6B6B70] hover:text-white",
                otpCodeFieldInput: "border-white/[0.06] focus:border-[#5B8DEF]",
                formResendCodeLink: "text-[#5B8DEF] hover:text-[#7BA4F7]",
                alert: "bg-[#1A1A1E] border-white/[0.06]",
                alertText: "text-[#E8E8E8]"
            }
        }}
      />
    </div>
  );
}
