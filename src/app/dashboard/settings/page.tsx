'use client';

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 relative overflow-x-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
       <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

       <div className="max-w-5xl mx-auto">
          <div className="mb-10">
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Account Settings</h1>
              <p className="text-muted-foreground text-lg">Manage your personal information and security settings.</p>
          </div>

          <div className="flex justify-center w-full">
            <UserProfile 
                appearance={{
                    baseTheme: dark,
                    variables: {
                        colorPrimary: '#ff5400',
                        colorBackground: '#0f0f11', // Matching other cards
                        colorInputBackground: '#1a1a1c',
                        colorText: '#ffffff',
                        colorTextSecondary: '#a1a1aa',
                        borderRadius: '1rem',
                        fontFamily: 'var(--font-geist-sans)',
                    },
                    elements: {
                        rootBox: "w-full",
                        card: "w-full bg-[#0f0f11] border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row",
                        navbar: "bg-white/5 border-r border-white/10 w-full md:w-64 p-4 flex-shrink-0",
                        navbarButton: "text-white/60 hover:text-white hover:bg-white/5 rounded-xl p-3 mb-1 font-medium transition-all",
                        navbarButtonIcon: "text-white/60",
                        navbarButtonActive: "bg-primary/10 text-primary hover:bg-primary/15 shadow-inner",
                        headerTitle: "text-2xl font-bold text-white tracking-tight",
                        headerSubtitle: "text-white/50",
                        pageScrollBox: "p-8",
                        profileSectionTitleText: "text-white font-bold text-lg",
                        accordionTriggerButton: "text-white hover:text-primary transition-colors",
                        formButtonPrimary: "bg-primary hover:brightness-110 text-white shadow-lg shadow-primary/20 rounded-xl py-2.5 transition-all transform active:scale-95",
                        formButtonReset: "text-white/70 hover:text-white hover:bg-white/5 rounded-xl",
                        alert: "bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl",
                        avatarImageActionsUpload: "text-primary hover:text-primary/80",
                        fileDropArea: "border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-xl",
                        formFieldInput: "bg-black/20 border-white/10 focus:border-primary/50 rounded-xl transition-all",
                        formFieldLabel: "text-white/70 font-medium",
                        badge: "bg-primary/20 text-primary border border-primary/20",
                    }
                }}
            />
          </div>
       </div>
    </div>
  );
}
