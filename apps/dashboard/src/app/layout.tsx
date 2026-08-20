import type { Metadata } from 'next';
  import { Inter } from 'next/font/google';
// @ts-ignore
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { UploadProvider } from '@/contexts/UploadContext';
import UploadProgressIndicator from '@/components/admin/storage/files/UploadProgressIndicator';
import { baseMetadata } from '@/lib/metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TooltipProvider>
              <UploadProvider>
                {children}
                <UploadProgressIndicator />
              </UploadProvider>
            </TooltipProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
