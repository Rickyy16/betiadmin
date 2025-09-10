import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ClientAuthWrapper from "@/Wrapper/ClientAuthWrapper";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <ClientAuthWrapper
            childComponent={
              <>
                <SidebarProvider>{children}</SidebarProvider>
                <Toaster position="top-center" reverseOrder={false} />
              </>
            }
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
