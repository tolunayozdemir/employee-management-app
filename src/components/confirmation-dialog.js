import {LitElement, html, css} from 'lit';

export class ConfirmationDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
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
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      text-align: center;
    }
    button {
      margin: 5px;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.message = '';
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="overlay">
        <div class="dialog">
          <p>${this.message}</p>
          <button @click=${this._onCancel}>Cancel</button>
          <button @click=${this._onConfirm}>Confirm</button>
        </div>
      </div>
    `;
  }

  _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.open = false;
  }

  _onConfirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.open = false;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
