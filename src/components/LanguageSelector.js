import React from 'react';
import { useLanguage, languages } from '../context/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <select 
        value={currentLanguage} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-dropdown"
      >
        {Object.values(languages).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector; 