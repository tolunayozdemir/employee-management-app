import {LitElement, html, css} from 'lit';
import {I18n} from '../../i18n/index.js';

export class ConfirmationDialog extends LitElement {
  static properties = {
    isOpen: {type: Boolean},
    message: {type: String},
  };

  static styles = css`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: var(--white);
      padding: 1.25rem;
      border-radius: var(--radius-md);
      min-width: 18.75rem;
      text-align: center;
      position: relative;
      box-shadow: var(--box-shadow);
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.9375rem;
      border-bottom: 0.0625rem solid var(--border-color);
      padding-bottom: 0.625rem;
    }
    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      color: var(--primary-color);
      font-weight: 500;
    }
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      color: var(--text-color-light);
      line-height: 0.8;
      transition: color var(--transition-default);
    }
    .close-button:hover {
      color: var(--text-color);
    }
    .dialog-content {
      margin: 1rem 0;
      color: var(--text-color);
    }
    .dialog-buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 1.25rem;
      gap: 0.625rem;
    }
    .dialog-buttons button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 1rem;
      transition: opacity var(--transition-default);
    }
    .dialog-buttons button:hover {
      opacity: 0.9;
    }
    .cancel-button {
      background-color: var(--secondary-button-color);
      color: var(--white);
      border: 0.0625rem solid var(--border-color);
    }
    .proceed-button {
      background-color: var(--primary-color);
      color: var(--white);
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.message = '';
  }

  render() {
    if (!this.isOpen) return html``;

    return html`
      <div class="overlay">
        <div class="dialog">
          <div class="dialog-header">
            <h3 class="dialog-title">${I18n.t('confirm.title')}</h3>
            <button class="close-button" @click=${this._onCancel}>
              &times;
            </button>
          </div>
          <div class="dialog-content">
            <p>${this.message}</p>
          </div>
          <div class="dialog-buttons">
            <button class="proceed-button" @click=${this._onConfirm}>
              ${I18n.t('button.proceed', 'Proceed')}
            </button>
            <button class="cancel-button" @click=${this._onCancel}>
              ${I18n.t('button.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.isOpen = false;
  }

  _onConfirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.isOpen = false;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
