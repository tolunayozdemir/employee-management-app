import {LitElement, html, css} from 'lit';

export class ModalDialog extends LitElement {
  static get properties() {
    return {
      isOpen: {type: Boolean},
      title: {type: String},
    };
  }

  static get styles() {
    return css`
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity var(--transition-default),
          visibility var(--transition-default);
      }

      .modal-backdrop.open {
        opacity: 1;
        visibility: visible;
      }

      .modal-container {
        background-color: var(--white);
        border-radius: var(--radius-md);
        box-shadow: 0 var(--spacing-xs) var(--spacing-lg) rgba(0, 0, 0, 0.15);
        width: 90%;
        max-width: 43.75rem;
        max-height: 90vh;
        overflow-y: auto;
        transform: translateY(calc(-1 * var(--spacing-lg)));
        transition: transform var(--transition-default);
      }

      .modal-backdrop.open .modal-container {
        transform: translateY(0);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 0.0625rem solid var(--border-color);
      }

      .modal-title {
        margin: 0;
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--text-color);
      }

      .close-button {
        background: none;
        border: none;
        font-size: var(--font-xl);
        cursor: pointer;
        padding: 0;
        color: var(--text-color-light);
        transition: color var(--transition-default);
      }

      .close-button:hover {
        color: var(--text-color);
      }

      .modal-body {
        padding: var(--spacing-lg);
      }

      @media (max-width: 768px) {
        .modal-container {
          width: 95%;
        }

        .modal-header {
          padding: var(--spacing-sm) var(--spacing-md);
        }

        .modal-body {
          padding: var(--spacing-md);
        }
      }
    `;
  }

  constructor() {
    super();
    this.isOpen = false;
    this.title = '';
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal-closed'));
  }

  render() {
    return html`
      <div
        class="modal-backdrop ${this.isOpen ? 'open' : ''}"
        @click="${this._handleBackdropClick}"
      >
        <div class="modal-container" @click="${this._stopPropagation}">
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            <button class="close-button" @click="${this.close}">&times;</button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  _handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }
}

customElements.define('modal-dialog', ModalDialog);
