import type { Metadata } from "next";
import { notoSansEthiopic, lora } from "@/lib/fonts";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መንፈሳዊ መዝሙራት",
  description:
    "Ethiopian Orthodox Tewahedo Church spiritual songs collection — የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መንፈሳዊ መዝሙራት",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${notoSansEthiopic.variable} ${lora.variable} antialiased`}>
      <body className="min-h-screen bg-bg-deep text-text-primary font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
