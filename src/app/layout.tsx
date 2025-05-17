import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed to Inter
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Added Toaster

const inter = Inter({ // Changed to Inter
  variable: '--font-inter', // Changed variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QuizWhiz', // Updated title
  description: 'An engaging quiz application', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use Inter variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
