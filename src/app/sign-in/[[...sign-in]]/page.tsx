import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff5400]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <SignIn 
        fallbackRedirectUrl="/dashboard" 
        forceRedirectUrl="/dashboard"
        appearance={{
            baseTheme: dark,
            variables: {
                colorPrimary: '#ff5400',
                colorBackground: '#0a0a0a', // Slightly darker card
                colorInputBackground: '#1a1a1a',
                colorInputText: 'white',
                borderRadius: '1rem',
            },
            elements: {
                rootBox: "shadow-2xl shadow-black/50 w-full",
                card: "border border-white/10 bg-black/40 backdrop-blur-md w-full",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
                socialButtonsBlockButtonText: "text-white font-medium",
                formButtonPrimary: "bg-[#ff5400] hover:bg-[#ff5400]/90 transition-all shadow-[0_0_30px_-10px_rgba(255,84,0,0.5)] text-white font-bold",
                footerActionLink: "text-[#ff5400] hover:text-[#ff5400]/80 font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-white/30",
                formFieldLabel: "text-gray-300",
                formFieldInput: "border-white/10 focus:border-[#ff5400] transition-colors",
                identityPreviewText: "text-gray-300",
                identityPreviewEditButtonIcon: "text-[#ff5400]"
            }
        }}
      />
    </div>
  );
}
