import type { AppProps } from 'next/app'
import { useRouter } from "next/router";
import { I18nProvider } from "@/i18n/localisation";
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const { dictionary, ...restPageProps } = pageProps
  const { locale = "en", defaultLocale = "en" } = useRouter();

  return (
    <>
      <I18nProvider table={dictionary} locale={locale || defaultLocale} >
      <Component {...restPageProps} />
      </I18nProvider>
    </>
  );
}

export default MyApp;