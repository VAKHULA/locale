import type { GetStaticProps } from "next";
import Head from 'next/head'
import Link from "next/link";
import { useRouter } from "next/router";
import type { MyLocale } from "../i18n";
import { useI18n, I18nProps } from "@/i18n/localisation";

function LocaleSelector() {
  const { locale, locales, asPath } = useRouter(); // Get current locale and locale list
  const { t } = useI18n<MyLocale>();
  return (
  <ul>
    {locales?.map((loc) => (
      <li key={loc}>
        <Link href={asPath} locale={loc} className={loc === locale ? "is-active" : ""}>
          {loc}
        </Link>
      </li>
    ))}
  </ul>
 )
}

export default function HomePage() {
  const { t } = useI18n<MyLocale>();
  return (
    <div>
      <Head>
        <title>{t("locale")}</title>
      </Head>
      <main>
        <h1>{t("title")}</h1>
        <p>{t("subtitle")}</p>
        <p>{t("welcome", { name: "John" })}</p>

        <LocaleSelector/>
      </main>
    </div>
  )
}

// You can use I18nProps<T> for type-safety (optional)
export const getStaticProps: GetStaticProps<I18nProps<MyLocale>> = async (context) => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../i18n/${locale}`); // Import locale
  return { props: { table } }; // Passed to `/pages/_app.tsx`
};