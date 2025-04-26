import { LitElement, html, css } from 'lit';

export class ModalDialog extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean },
      title: { type: String }
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
        transition: opacity 0.3s, visibility 0.3s;
      }
      
      .modal-backdrop.open {
        opacity: 1;
        visibility: visible;
      }
      
      .modal-container {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        width: 90%;
        max-width: 700px;
        max-height: 90vh;
        overflow-y: auto;
        transform: translateY(-20px);
        transition: transform 0.3s;
      }
      
      .modal-backdrop.open .modal-container {
        transform: translateY(0);
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #34495e;
      }
      
      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        color: #95a5a6;
        transition: color 0.2s;
      }
      
      .close-button:hover {
        color: #34495e;
      }
      
      .modal-body {
        padding: 1.5rem;
      }

      @media (max-width: 768px) {
        .modal-container {
          width: 95%;
        }
        
        .modal-header {
          padding: 0.75rem 1rem;
        }
        
        .modal-body {
          padding: 1rem;
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
      <div class="modal-backdrop ${this.isOpen ? 'open' : ''}" @click="${this._handleBackdropClick}">
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