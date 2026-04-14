import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { FilterProvider } from "@/hooks/use-filters";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gold Loan Voice Analytics Dashboard",
  description: "AI-powered call analytics dashboard for Chola Gold Loan operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full bg-white" suppressHydrationWarning>
        <FilterProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </FilterProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
