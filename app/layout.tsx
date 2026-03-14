import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "RID Academy — Reducing Insurance Dependence for Dental Practices",
  description:
    "The #1 resource for dental practices reducing PPO insurance dependence. Free calculators, courses, expert guidance, and 10,000+ dentist community.",
  keywords:
    "drop PPO plans, dental insurance dependence, fee for service dentistry, dental membership plans, PPO write-offs",
  openGraph: {
    type: "website",
    title: "RID Academy — Practice on Your Terms",
    description:
      "The #1 resource for dental practice owners reducing PPO insurance dependence.",
    url: "https://rid.academy",
    siteName: "RID Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "RID Academy — Practice on Your Terms",
    description:
      "Free tools and guidance for dental practices dropping PPO plans.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmMono.variable} antialiased`}>
        <div className="grid-overlay" />
        {children}
      </body>
    </html>
  );
}
