import { createContext, useContext, useState, useEffect } from 'react';
import { translations, t } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en'); // Default to English
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setIsLoading(false);
    } else {
      // Auto-detect language based on IP
      detectLanguage();
    }
  }, []);

  const detectLanguage = async () => {
    try {
      const response = await fetch('/api/detect-language');
      const data = await response.json();
      
      if (data.language) {
        setLanguage(data.language);
        // Save the detected language as user preference
        localStorage.setItem('preferred-language', data.language);
      }
    } catch (error) {
      console.error('Language detection failed:', error);
      // Fallback to English
      setLanguage('en');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
  };

  const translate = (key, variables = {}) => {
    return t(language, key, variables);
  };

  const value = {
    language,
    changeLanguage,
    translate,
    isLoading,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'zh', name: '中文', flag: '🇨🇳' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language switcher component
export function LanguageSwitcher() {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-transparent border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}
