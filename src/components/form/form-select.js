import {LitElement, html, css} from 'lit';
import {I18n} from '../../i18n/index.js';

export class FormSelect extends LitElement {
  static get properties() {
    return {
      label: {type: String},
      name: {type: String},
      value: {type: String},
      options: {type: Array},
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
    this.value = '';
    this.options = [];
    this.placeholder = I18n.t('select.placeholder');
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

      .select-wrapper {
        position: relative;
        width: 100%;
      }

      select {
        box-sizing: border-box;
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 0.0625rem solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: var(--font-base);
        box-shadow: var(--box-shadow);
        outline: none;
        transition: border-color var(--transition-default);
        background-color: white;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        padding-right: var(--spacing-2xl);
      }

      select::-ms-expand {
        display: none;
      }

      .select-wrapper::after {
        content: '';
        position: absolute;
        top: 50%;
        right: var(--spacing-md);
        transform: translateY(-50%) rotate(45deg);
        width: var(--spacing-xs);
        height: var(--spacing-xs);
        border-right: 0.125rem solid var(--text-color-light);
        border-bottom: 0.125rem solid var(--text-color-light);
        pointer-events: none;
        transition: transform 0.2s ease;
      }

      select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.1875rem var(--primary-color-light);
      }

      select:focus + .select-wrapper::after {
        border-color: var(--primary-color);
      }

      .error {
        color: var(--error-color);
        font-size: var(--font-sm);
        margin-top: var(--spacing-xs);
      }
    `;
  }

  _handleChange(e) {
    this.value = e.target.value;

    this.dispatchEvent(
      new CustomEvent('select-change', {
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
        <div class="select-wrapper">
          <select
            id="${this.name}"
            name="${this.name}"
            .value="${this.value}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            @change="${this._handleChange}"
          >
            <option value="" disabled selected>${this.placeholder}</option>
            ${this.options.map((option) => {
              if (typeof option === 'object') {
                return html`<option
                  value="${option.value}"
                  ?selected="${this.value === option.value}"
                >
                  ${option.label}
                </option>`;
              } else {
                return html`<option
                  value="${option}"
                  ?selected="${this.value === option}"
                >
                  ${option}
                </option>`;
              }
            })}
          </select>
        </div>
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('form-select', FormSelect);
