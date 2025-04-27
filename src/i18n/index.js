import {translations} from './translations/index.js';
import store from '../store/store.js';
import {setLanguage} from '../store/actions.js';

export class I18n {
  static t(key, params = {}) {
    const language = this.getLanguage();

    const translationData = translations[language];

    let translatedText = translationData[key] || key;

    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach((param) => {
        const regex = new RegExp(`{{${param}}}`, 'g');
        translatedText = translatedText.replace(regex, params[param]);
      });
    }

    return translatedText;
  }

  static changeLanguage(language) {
    if (translations[language]) {
      document.documentElement.setAttribute('lang', language);
      store.dispatch(setLanguage(language));
    }
  }

  static initLanguage() {
    const language = this.getLanguage();

    document.documentElement.setAttribute('lang', language);
  }

  static getLanguage() {
    return store.getState().language;
  }
}
