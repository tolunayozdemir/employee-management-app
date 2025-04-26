import {LitElement, html, css} from 'lit';
import '../components/employee-table.js';
import '../components/employee-list.js';
import '../components/modal-dialog.js';
import '../components/employee-form.js';
import store from '../store/store.js';
import {deleteEmployee, updateEmployee} from '../store/actions.js';

export class EmployeePage extends LitElement {
  static get styles() {
    return css`
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      h1 {
        color: var(--primary-color);
        font-size: 1.5rem;
        font-weight: 500;
      }

      .view-toggle {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      .view-btn {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      }

      .view-btn.active {
        background-color: #ff6600;
        color: white;
        border-color: #ff6600;
      }
    `;
  }

  static get properties() {
    return {
      employees: {type: Array},
      employeeToEdit: {type: Object},
      viewMode: {type: String, state: true},
    };
  }

  constructor() {
    super();
    this.viewMode = 'table';
    this.employees = [];
    this.employeeToEdit = null;
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

  _switchView(mode) {
    this.viewMode = mode;
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

  _renderCurrentView() {
    if (this.viewMode === 'table') {
      return html`
        <employee-table
          .employees=${this.employees}
          @employee-delete=${this._onDelete}
          @employee-edit=${this._onEdit}
        ></employee-table>
      `;
    } else {
      return html`
        <employee-list
          .employees=${this.employees}
          @employee-delete=${this._onDelete}
          @employee-edit=${this._onEdit}
        ></employee-list>
      `;
    }
  }

  render() {
    return html`<div>
      <div class="header">
        <h1>Employee List</h1>

        <div class="view-toggle">
          <button
            class="view-btn ${this.viewMode === 'table' ? 'active' : ''}"
            @click=${() => this._switchView('table')}
          >
            Table View
          </button>
          <button
            class="view-btn ${this.viewMode === 'list' ? 'active' : ''}"
            @click=${() => this._switchView('list')}
          >
            List View
          </button>
        </div>
      </div>
      
      ${this._renderCurrentView()}

      <modal-dialog
        .isOpen=${!!this.employeeToEdit}
        @modal-closed=${this._onModalClosed}
      >
        ${this.employeeToEdit &&
        html`<employee-form
          type="edit"
          .formData=${this.employeeToEdit}
          @submit-form=${this._handleFormSubmit}
        ></employee-form>`}
      </modal-dialog>
    </div>`;
  }
}

customElements.define('employee-page', EmployeePage);
