import React, { createContext, useState, useContext } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tenta obter a linguagem armazenada, ou usa 'pt'
const storedLangFallback = async () => {
  let storedLang = 'pt';
  try {
    const lang = await AsyncStorage.getItem('language');
    if (lang) {
      storedLang = lang;
    }
  } catch (err) {
    console.log('Erro ao ler linguagem do AsyncStorage', err);
  }
  return storedLang;
};

// Inicialização do i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es }
  },
  lng: 'pt', 
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false
  }
});

const GlobalContext = createContext({
  language: 'en',
  changeLanguage: () => {}
});

export const GlobalProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  React.useEffect(() => {
    // Ler do AsyncStorage e atualizar i18n
    (async () => {
      const lang = await storedLangFallback();
      setLanguage(lang);
      i18n.changeLanguage(lang);
    })();
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <GlobalContext.Provider value={{ language, changeLanguage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);