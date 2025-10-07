import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`text-sm font-medium transition-colors ${
          language === 'en'
            ? 'text-accent-600 font-semibold'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        EN
      </button>
      <span className='text-neutral-300'>|</span>
      <button
        onClick={() => setLanguage('it')}
        className={`text-sm font-medium transition-colors ${
          language === 'it'
            ? 'text-accent-600 font-semibold'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        IT
      </button>
    </div>
  );
};

export default LanguageSwitcher;
