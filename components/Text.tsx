import { useState } from "react";
import dynamic from 'next/dynamic'
import type { MyLocale } from "@/i18n";
import { useI18n } from "@/i18n/localisation";
import { HiddenText } from './HiddenText'

const DynamicText = dynamic(() => import('./DynamicText'), {
  loading: () => <p>Loading...</p>,
  ssr: true,
})

function Text() {
  const { t } = useI18n<MyLocale>(['text']);
  const [isHidden, setIsHidden] = useState(true)

  return (
    <>
      <DynamicText/>
      <p
        onClick={() => {
          setIsHidden(false)
        }}
      >
        {t('text')}
      </p>
      {!isHidden &&
        <HiddenText />
      }
    </>
  )
}

export  { Text }