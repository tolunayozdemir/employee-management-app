import { LitElement, html, css } from 'lit';

export class SearchBar extends LitElement {
  static get styles() {
    return css`
      .search-container {
        margin-bottom: 1.5rem;
        width: 100%;
      }
      
      .form-input {
        box-sizing: border-box;
        width: 100%;
        padding: 0.75rem 1rem;
        border: 0.0625rem solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: 1rem;
        box-shadow: var(--box-shadow);
        outline: none;
        transition: border-color var(--transition-default);
      }
      
      .form-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.1875rem var(--primary-color-light);
      }
      
      .form-input::placeholder {
       opacity: 0.5;
      }
    `;
  }

  static get properties() {
    return {
      placeholder: { type: String },
      debounceTime: { type: Number }
    };
  }

  constructor() {
    super();
    this.placeholder = 'Search...';
    this.debounceTime = 300;
    this._debounceTimeout = null;
  }

  _handleInput(e) {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }
    
    this._debounceTimeout = setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('search-change', {
          detail: { value: e.target.value },
          bubbles: true,
          composed: true
        })
      );
    }, this.debounceTime);
  }

  render() {
    return html`
      <div class="search-container">
        <input
          type="text"
          class="form-input"
          placeholder="${this.placeholder}"
          @input="${this._handleInput}"
        />
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);