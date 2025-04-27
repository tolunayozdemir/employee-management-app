import {LitElement, html, css} from 'lit';
import {I18n} from '../../i18n/index.js';

export class LanguageSwitcher extends LitElement {
  static get properties() {
    return {
      currentLanguage: {type: String},
    };
  }

  constructor() {
    super();
    this.currentLanguage = I18n.getLanguage();
  }

  _switchLanguage(language) {
    if (this.currentLanguage !== language) {
      I18n.changeLanguage(language);
      window.location.reload();
    }
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .language-button {
      background: none;
      border: 1px solid var(--primary-color);
      border-radius: 4px;
      color: var(--text-color);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      padding: 4px 8px;
      transition: all 0.2s ease;
    }

    .language-button:hover {
      background-color: var(--primary-color-light);
    }

    .language-button.active {
      background-color: var(--primary-color-dark);
      color: var(--white);
    }

    @media (max-width: 768px) {
      .language-button {
        font-size: 12px;
        padding: 3px 6px;
      }
    }
  `;

  render() {
    return html`
      <button
        class="language-button ${this.currentLanguage === 'en' ? 'active' : ''}"
        @click="${() => this._switchLanguage('en')}"
      >
        EN
      </button>
      <button
        class="language-button ${this.currentLanguage === 'tr' ? 'active' : ''}"
        @click="${() => this._switchLanguage('tr')}"
      >
        TR
      </button>
    `;
  }
}

customElements.define('language-switcher', LanguageSwitcher);
