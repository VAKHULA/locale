
import type { MyLocale } from "@/i18n";
import { useI18n } from "@/i18n/localisation";

function HiddenText() {
  const { t } = useI18n<MyLocale>([]);
  return (
    <p>{t('hidden-text')}</p>
  )
}

export  { HiddenText }