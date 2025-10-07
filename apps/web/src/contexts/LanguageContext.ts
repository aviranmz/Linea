import { createContext } from 'react';

export interface LanguageContextType {
  language: 'en' | 'it';
  setLanguage: (lang: 'en' | 'it') => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
