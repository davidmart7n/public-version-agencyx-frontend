import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import esMessages from "data/translate/es.json";
import enMessages from "data/translate/en.json";

type IntlContextType = {
  currentLanguage: string;
  toggleLanguage: (language: string) => void;
};

const IntlContext = createContext<IntlContextType | undefined>(undefined);

export const useIntlContext = () => {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error("useIntlContext must be used within an IntlProvider");
  }
  return context;
};

export const IntlProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("es"); // Valor por defecto

  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem("lang", language); // Guardar al instante
  };

  const messages = currentLanguage === "es" ? esMessages : enMessages;

  return (
    <ReactIntlProvider locale={currentLanguage} messages={messages}>
      <IntlContext.Provider value={{ currentLanguage, toggleLanguage }}>
        {children}
      </IntlContext.Provider>
    </ReactIntlProvider>
  );
};
