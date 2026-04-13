import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceIQ Call Analytics Dashboard",
  description: "AI-powered call analytics dashboard for retail stores across India.",
};

import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { Toaster } from 'sonner';
import { FilterProvider } from "@/hooks/use-filters";
import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="font-sans min-h-full bg-white" suppressHydrationWarning>
        <FilterProvider>
          <QueryProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </QueryProvider>
        </FilterProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
