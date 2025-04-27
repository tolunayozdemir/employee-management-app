import {LitElement, html, css} from 'lit';
import '../components/employee-table.js';
import '../components/employee-list.js';
import '../components/modal-dialog.js';
import '../components/employee-form.js';
import '../components/search-bar.js';
import store from '../store/store.js';
import {deleteEmployee, updateEmployee} from '../store/actions.js';
import {I18n} from '../i18n/index.js';

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
        gap: 0.625rem;
        margin-bottom: 0.9375rem;
      }

      .view-btn {
        background-color: var(--bg-light);
        border: 0.0625rem solid var(--border-color);
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: background-color var(--transition-default);
      }

      .view-btn.active {
        background-color: var(--primary-color);
        color: var(--white);
        border-color: var(--primary-color);
      }

      .search-section {
        margin: 1rem 0;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      employees: {type: Array},
      filteredEmployees: {type: Array, state: true},
      employeeToEdit: {type: Object},
      isEmployeeModalOpen: {type: Boolean},
      viewMode: {type: String, state: true},
      searchTerm: {type: String, state: true},
    };
  }

  constructor() {
    super();
    this.viewMode = 'table';
    this.employees = [];
    this.filteredEmployees = [];
    this.employeeToEdit = undefined;
    this.isEmployeeModalOpen = false;
    this.searchTerm = '';
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
    this._filterEmployees();
  }

  _filterEmployees() {
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(searchTermLower) ||
        employee.lastName.toLowerCase().includes(searchTermLower) ||
        employee.department.toLowerCase().includes(searchTermLower) ||
        employee.position.toLowerCase().includes(searchTermLower) ||
        employee.email.toLowerCase().includes(searchTermLower) ||
        (employee.phone && employee.phone.includes(searchTermLower))
      );
    });
  }

  _handleSearch(e) {
    this.searchTerm = e.detail.value;
    this._filterEmployees();
  }

  _onDelete(e) {
    if (confirm(I18n.t('confirm.delete'))) {
      const employeeId = e.detail.id;
      store.dispatch(deleteEmployee(employeeId));
    }
  }

  _onEdit(e) {
    this.employeeToEdit = e.detail;
    this.isEmployeeModalOpen = true;
  }

  _onModalClosed() {
    this.isEmployeeModalOpen = false;
  }

  _switchView(mode) {
    this.viewMode = mode;
  }

  _handleFormSubmit(e) {
    const formData = e.detail.formData;

    if (confirm(I18n.t('confirm.update'))) {
      store.dispatch(updateEmployee(formData));
      this.isEmployeeModalOpen = false;
    }
  }

  _renderCurrentView() {
    if (this.viewMode === 'table') {
      return html`
        <employee-table
          .employees=${this.filteredEmployees}
          @employee-delete=${this._onDelete}
          @employee-edit=${this._onEdit}
        ></employee-table>
      `;
    } else {
      return html`
        <employee-list
          .employees=${this.filteredEmployees}
          @employee-delete=${this._onDelete}
          @employee-edit=${this._onEdit}
        ></employee-list>
      `;
    }
  }

  render() {
    return html`<div>
      <div class="header">
        <h1>${I18n.t('page.employeeList')}</h1>

        <div class="view-toggle">
          <button
            class="view-btn ${this.viewMode === 'table' ? 'active' : ''}"
            @click=${() => this._switchView('table')}
          >
            ${I18n.t('button.tableView')}
          </button>
          <button
            class="view-btn ${this.viewMode === 'list' ? 'active' : ''}"
            @click=${() => this._switchView('list')}
          >
            ${I18n.t('button.listView')}
          </button>
        </div>
      </div>

      <div class="search-section">
        <search-bar
          placeholder="${I18n.t('search.placeholder')}"
          debounceTime="300"
          @search-change=${this._handleSearch}
        ></search-bar>
      </div>

      ${this._renderCurrentView()}

      <modal-dialog
        .isOpen=${this.isEmployeeModalOpen}
        .title="${I18n.t('modal.editEmployee')}"
        @modal-closed=${this._onModalClosed}
      >
        ${this.employeeToEdit &&
        html`<employee-form
          type="edit"
          .formData=${this.employeeToEdit}
          @submit-form=${this._handleFormSubmit}
          @cancel-form=${this._onModalClosed}
        ></employee-form>`}
      </modal-dialog>
    </div>`;
  }
}

customElements.define('employee-page', EmployeePage);
