import React, { useContext, createContext, useRef } from "react";

import { useRouter } from "next/router";
import rosetta, { Rosetta as RosettaBase } from "rosetta";

type Key = string | number | bigint | symbol;

type PropType<T, Path extends Key> = string extends Path
  ? unknown
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<T[K], R>
    : unknown
  : unknown;

type Join<T extends unknown[], D extends string> = T extends []
  ? ""
  : T extends [string | number | boolean | bigint]
  ? `${T[0]}`
  : T extends [string | number | boolean | bigint, ...infer U]
  ? `${T[0]}${D}${Join<U, D>}`
  : string;

// t("about") -> supported typing
// t("about.title") -> supported typing


export interface RosettaExtended<T> extends Omit<RosettaBase<T>, "t"> {
  t<P extends Key | Key[], X extends Record<string, any> | any[]>(
    key: P,
    params?: X,
    lang?: string,
  ): P extends Key[] ? PropType<T, Join<P, ".">> : P extends Key ? PropType<T, P> : unknown;

  t<F extends any, X extends Record<string, any> | any[] = Record<string, any> | any[]>(
    key: Key | Key[],
    params?: X,
    lang?: string,
  ): F;
}

export const I18nContext = createContext<RosettaExtended<any> | null>(null);

export function useI18n<T = any>() {
  const instance = useContext<RosettaExtended<T> | null>(I18nContext);
  if (!instance) {
    throw new Error("There was an error getting i18n instance from context");
  }
  return instance;
}

export type I18nProps<T = any> = {
  table: T;
};

export type I18nProviderProps<T = any> = I18nProps<T> & {
  children?: any;
};

export function I18nProvider<T = any>({ table, children }: I18nProviderProps<T>) {
  const i18nRef = useRef(rosetta());
  const { locale = "en", defaultLocale = "en" } = useRouter();

  i18nRef.current.set(locale ?? defaultLocale, table);
  i18nRef.current.locale(locale);

  return <I18nContext.Provider value={i18nRef.current}>{children}</I18nContext.Provider>;
}