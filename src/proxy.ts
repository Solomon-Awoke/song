import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'am'];
const defaultLocale = 'am';

export function proxy(request: NextRequest) {
  const cookieName = 'NEXT_LOCALE';
  const existing = request.cookies.get(cookieName)?.value;

  // If cookie exists and is valid, just ensure the header is set
  if (existing && locales.includes(existing)) {
    const response = NextResponse.next();
    response.headers.set('x-next-intl-locale', existing);
    return response;
  }

  // Detect from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .find((lang) => locales.includes(lang));

    if (preferred) {
      locale = preferred;
    }
  }

  const response = NextResponse.next();
  response.cookies.set(cookieName, locale, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  response.headers.set('x-next-intl-locale', locale);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
