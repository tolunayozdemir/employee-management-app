import {html, LitElement, css} from 'lit';
import {Router} from '@vaadin/router';
import {I18n} from '../../i18n/index.js';

export class EmployeeNotFound extends LitElement {
  static get styles() {
    return css`
      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        background-color: var(--white);
        border-radius: var(--radius-sm);
        box-shadow: var(--box-shadow);
        text-align: center;
      }

      .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
      }

      h3 {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      p {
        color: var(--text-secondary-color);
        margin-bottom: 1.5rem;
      }

      button {
        padding: 0.8rem 1.4rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.3s;
      }

      button:hover {
        opacity: 0.9;
      }

      button:active {
        opacity: 0.8;
      }
    `;
  }

  _handleAddEmployeeClick() {
    Router.go('/add-employee');
  }

  render() {
    return html`
      <div class="not-found-container">
        <div class="icon">👥</div>
        <h3>${I18n.t('empty.title')}</h3>
        <p>${I18n.t('empty.message')}</p>
        <button @click=${this._handleAddEmployeeClick}>
          ${I18n.t('button.add')}
        </button>
      </div>
    `;
  }
}

customElements.define('employee-not-found', EmployeeNotFound);
