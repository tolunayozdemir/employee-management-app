import {LitElement, html, css} from 'lit';
import './form-input.js';
import {I18n} from '../i18n/index.js';

export class SearchBar extends LitElement {
  static get styles() {
    return css`
      .search-container {
        margin-bottom: 1.5rem;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      placeholder: {type: String},
      debounceTime: {type: Number},
      value: {type: String},
    };
  }

  constructor() {
    super();
    this.placeholder = I18n.t('search.placeholder');
    this.debounceTime = 300;
    this._debounceTimeout = null;
    this.value = '';
  }

  _handleInput(e) {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }

    this.value = e.detail.value;

    this._debounceTimeout = setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('search-change', {
          detail: {value: this.value},
          bubbles: true,
          composed: true,
        })
      );
    }, this.debounceTime);
  }

  render() {
    return html`
      <div class="search-container">
        <form-input
          name="search"
          placeholder="${this.placeholder}"
          .value="${this.value}"
          @input-change="${this._handleInput}"
        ></form-input>
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);
