import React, { useContext, createContext, useRef } from "react";
import * as ReactDOMServer from 'react-dom/server';
import get from 'lodash.get'
import {RouterContext} from 'next/dist/shared/lib/router-context';
// import { RouterContext } from "next/dist/next-server/lib/router-context";

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

let registered = {}

export function useI18n<T = any>(register: string[]) {

  const {instance, locale} = useContext<RosettaExtended<T> | null>(I18nContext);

  if (!instance) {
    throw new Error("There was an error getting i18n instance from context");
  }

  const dict = instance.table(locale)

  if (register) {
    register.forEach((key) => {
      registered[key] = (get(dict, key) || null)
    })
  }

  return instance;
}

export type I18nProps<T = any> = {
  table: T;
};

export type I18nProviderProps<T = any> = I18nProps<T> & {
  children?: any;
};


export function I18nProvider<T = any>({ table, locale, children }: I18nProviderProps<T>) {
  const i18nRef = useRef(rosetta());
  i18nRef.current.set(locale ?? 'en', table);
  i18nRef.current.locale(locale);

  return (
    <I18nContext.Provider
      value={{
        instance: i18nRef.current,
        locale: locale
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

const getSubDict = () => {
  const temp = { ...registered };

  registered = {}
  return temp
}

export const collectLocales = async (Component, locale) => {
  const table = await import(`../dictionaries/${locale}.json`); // Import locale
  const router =  {
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
  }

  ReactDOMServer.renderToString(
    <RouterContext.Provider value={router}>
      <I18nProvider table={table} locale={locale} >
        <Component pageProps={{}} />
      </I18nProvider>
    </RouterContext.Provider>
  )

  const dictionary = getSubDict()

  return dictionary
}