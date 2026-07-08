import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';

export const locales = ['en', 'am'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : 'am';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
