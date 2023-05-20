import type { GetStaticProps } from "next";
import Head from 'next/head'
import Link from "next/link";
import { useRouter } from "next/router";
import type { MyLocale } from "../i18n";
import { useI18n, collectLocales } from "@/i18n/localisation";

import {Text} from '@/components/Text'

function LocaleSelector() {
  const { locale, locales, asPath, ...rest } = useRouter(); // Get current locale and locale list
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
  const { t } = useI18n<MyLocale>(["locale", "title", "subtitle", "welcome"]);
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
        <Text />
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale;
  const dictionary = await collectLocales(HomePage, locale)
  return { props: { dictionary } };
};