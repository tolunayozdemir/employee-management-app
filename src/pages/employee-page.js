import {LitElement, html} from 'lit';
import '../components/employee-table.js';
import '../components/modal-dialog.js';
import '../components/employee-form.js';
import store from '../store/store.js';
import {deleteEmployee, updateEmployee} from '../store/actions.js';

export class EmployeePage extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
      employeeToEdit: {type: Object},
    };
  }

  constructor() {
    super();
    this.employeeToEdit = null;
    this.employees = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe(() =>
      this._onEmployeeListChange(store.getState().employees)
    );
    this._onEmployeeListChange(store.getState().employees);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _onEmployeeListChange(employee) {
    this.employees = employee;
  }

  _onDelete(e) {
    if (confirm('Are you sure you want to delete this employee?')) {
      const employeeId = e.detail.id;
      store.dispatch(deleteEmployee(employeeId));
    }
  }

  _onEdit(e) {
    this.employeeToEdit = e.detail;
    const modalDialog = this.shadowRoot.querySelector('modal-dialog');
    modalDialog.open();
  }

  _onModalClosed() {
    this.employeeToEdit = null;
  }

  _handleFormSubmit(e) {
    console.log('form submitted');
    const formData = e.detail.formData;

    if (confirm('Are you sure you want to add this employee?')) {
      store.dispatch(updateEmployee(formData));
      const modalDialog = this.shadowRoot.querySelector('modal-dialog');
      modalDialog.close();
      this.employeeToEdit = null;
    }
  }

  render() {
    return html` <div>
      <employee-table
        .employees=${this.employees}
        @employee-delete=${this._onDelete}
        @employee-edit=${this._onEdit}
      ></employee-table>

      <modal-dialog
        .isOpen=${!!this.employeeToEdit}
        @modal-closed=${this._onModalClosed}
      >
        ${this.employeeToEdit &&
        html`<employee-form
          type='edit'
          .formData=${this.employeeToEdit}
          @submit-form=${this._handleFormSubmit}
        ></employee-form>`}
      </modal-dialog>
    </div>`;
  }
}

customElements.define('employee-page', EmployeePage);
