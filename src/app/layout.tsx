import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mocx - Next-Gen AI Mockups",
  description: "Create professional mockups in seconds with our advanced AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { 
          colorPrimary: '#ff5400',
          colorBackground: '#0F0F0F',
          colorInputBackground: '#1E1E1E', 
          colorText: '#F7F7F7',
          colorTextSecondary: '#A3A3A3',
        },
        elements: {
          card: "bg-[#0F0F0F] border border-white/10 shadow-2xl",
          headerTitle: "text-white",
          headerSubtitle: "text-white/60",
          socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
          dividerLine: "bg-white/10",
          dividerText: "text-white/40",
          formFieldLabel: "text-white/80",
          formFieldInput: "bg-white/5 border-white/10 text-white focus:border-[#ff5400] transition-colors",
          footerActionLink: "text-[#ff5400] hover:text-[#e64d00]",
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
        </body>
      </html>
    </ClerkProvider>
  );
}
