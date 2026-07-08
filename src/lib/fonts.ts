import { Noto_Sans_Ethiopic, Lora } from 'next/font/google';

export const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-noto-ethiopic',
  display: 'swap',
});

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lora',
  display: 'swap',
});
