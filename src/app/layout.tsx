import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import FacebookPixel from "@/components/FacebookPixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mocx - AI Creative Studio | Thumbnails, Mockups & AI Art",
  description: "Create professional mockups, viral thumbnails, and stunning AI art in seconds. The all-in-one AI visual studio for creators and brands.",
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    images: ['/meta.png'],
  },
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
          colorPrimary: '#5B8DEF',
          colorBackground: '#0C0C0E',
          colorInputBackground: '#131316', 
          colorText: '#E8E8E8',
          colorTextSecondary: '#6B6B70',
        },
        elements: {
          card: "bg-[#0C0C0E] border border-white/[0.06] shadow-2xl",
          headerTitle: "text-white",
          headerSubtitle: "text-white/50",
          socialButtonsBlockButton: "bg-white/[0.03] border border-white/[0.06] text-white hover:bg-white/[0.06]",
          dividerLine: "bg-white/[0.06]",
          dividerText: "text-white/30",
          formFieldLabel: "text-white/70",
          formFieldInput: "bg-white/[0.03] border-white/[0.06] text-white focus:border-blue-400 transition-colors",
          footerActionLink: "text-blue-400 hover:text-blue-300",
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-[#0C0C0E]`}
        >
          <FacebookPixel />
          {children}
          <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
        </body>
      </html>
    </ClerkProvider>
  );
}
