import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { I18nProvider } from "@/i18n/localisation";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider table={pageProps.table}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}

export default MyApp;