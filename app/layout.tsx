import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp, ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { antdTheme } from "@/theme";
import "./globals.css";
import "../styles.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Nuvemed",
  description: "Controle de estoque em nuvem para insumos de saúde",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <AntdRegistry>
            <ConfigProvider theme={antdTheme} locale={ptBR}>
              <AntdApp>{children}</AntdApp>
            </ConfigProvider>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
