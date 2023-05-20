
import type { MyLocale } from "@/i18n";
import { useI18n } from "@/i18n/localisation";

function DynamicText() {
  const { t } = useI18n<MyLocale>(['dynamic-text']);
  return (
    <p>dynamic: {t('dynamic-text')}</p>
  )
}

export default DynamicText