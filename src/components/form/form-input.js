import {LitElement, html, css} from 'lit';

export class FormInput extends LitElement {
  static get properties() {
    return {
      label: {type: String},
      name: {type: String},
      type: {type: String},
      value: {type: String},
      placeholder: {type: String},
      disabled: {type: Boolean},
      error: {type: String},
      required: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.label = '';
    this.name = '';
    this.type = 'text';
    this.value = '';
    this.placeholder = '';
    this.disabled = false;
    this.error = '';
    this.required = false;
  }

  static get styles() {
    return css`
      .form-group {
        margin-bottom: var(--spacing-lg);
      }

      label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--spacing-sm);
        color: var(--text-color-light);
        font-size: var(--font-sm);
      }

      input {
        box-sizing: border-box;
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 0.0625rem solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: var(--font-base);
        box-shadow: var(--box-shadow);
        outline: none;
        transition: border-color var(--transition-default);
      }

      input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.1875rem var(--primary-color-light);
      }

      .error {
        color: var(--error-color);
        font-size: var(--font-sm);
        margin-top: var(--spacing-xs);
      }
    `;
  }

  _handleInput(e) {
    this.value = e.target.value;

    this.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {
          name: this.name,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="form-group">
        <label for="${this.name}">${this.label}</label>
        <input
          type="${this.type}"
          id="${this.name}"
          name="${this.name}"
          .value="${this.value}"
          placeholder="${this.placeholder || ''}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          @input="${this._handleInput}"
        />
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('form-input', FormInput);
