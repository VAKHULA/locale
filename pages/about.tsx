import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { MyLocale } from "@/i18n";
import { useI18n, collectLocales } from "@/i18n/localisation";

export default function AboutHome() {
  const router = useRouter();
  const i18n = useI18n<MyLocale>(["locale","about.title","about.subtitle"]);
  const { t } = i18n;

  return (
    <div>
      <Head>
        <title>{t("locale")}</title>
      </Head>
      <main>
        <h1>{t("about.title")}</h1>
        <p>{t("about.subtitle")}</p>
        <ul>
          {router.locales?.map((loc) => (
            <li key={loc}>
              <Link href={router.asPath} locale={loc} className={loc === router.locale ? "is-active" : ""}>
                {loc}
              </Link>
            </li>
          ))}
        </ul>
        <hr />
        <Link href="/">Home</Link>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale;
  const dictionary = await collectLocales(AboutHome, locale)
  return { props: { dictionary } };
};