import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/css/globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "./providers";
import { Toaster } from "sonner";

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "매치마이듀오",
  description: "게임 플레이어들이 쉽고 빠르게 듀오를 찾을 수 있는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${pretendard.className} bg-bg-secondary scrollbar-hide overflow-auto font-medium`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Providers>
            <Toaster position="top-center" richColors />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
