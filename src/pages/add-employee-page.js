import {html, LitElement, css} from 'lit';
import {Router} from '@vaadin/router';
import store from '../../store/store.js';
import {addEmployee} from '../store/actions.js';
import '../components/form/employee-form.js';
import '../components/confirmation-dialog.js';
import {I18n} from '../i18n/index.js';

export class AddEmployeePage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 800px;
        margin: 0 auto;
        padding: 1.4rem;
        box-sizing: border-box;
      }

      .form-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-top: 0;
        margin-bottom: 1.5rem;
        text-align: center;
      }
    `;
  }

  static get properties() {
    return {
      _isConfirmModalOpen: {type: Boolean},
      _confirmMessage: {type: String},
      _onConfirm: {type: Function},
      _onCancel: {type: Function},
    };
  }

  constructor() {
    super();
    this._isConfirmModalOpen = false;
    this._confirmMessage = '';
    this._onConfirm = () => {};
    this._onCancel = () => {};
  }

  _handleCancel() {
    Router.go('/');
  }

  _handleFormSubmit(e) {
    const employeeToAdd = e.detail.formData;

    this._confirmMessage = I18n.t('confirm.add', {
      firstName: employeeToAdd?.firstName,
      lastName: employeeToAdd?.lastName,
    });

    this._onConfirm = () => {
      this._isConfirmModalOpen = false;
      store.dispatch(addEmployee(employeeToAdd));
      Router.go('/');
    };

    this._onCancel = () => {
      this._isConfirmModalOpen = false;
    };

    this._isConfirmModalOpen = true;
  }

  render() {
    return html`
      <div class="form-container">
        <h2>${I18n.t('page.addEmployee')}</h2>
        <employee-form
          @cancel-form=${this._handleCancel}
          @submit-form=${this._handleFormSubmit}
        ></employee-form>

        <confirmation-dialog
          .open=${this._isConfirmModalOpen}
          .message=${this._confirmMessage}
          @cancel=${this._onCancel}
          @confirm=${this._onConfirm}
        ></confirmation-dialog>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);
