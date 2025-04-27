import {LitElement, html, css} from 'lit';
import '../components/employee-table.js';
import '../components/employee-list.js';
import '../components/form/employee-form.js';
import '../components/search-bar/index.js';
import '../components/dialog/modal-dialog.js';
import '../components/dialog/confirmation-dialog.js';
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
        margin-bottom: var(--spacing-md);
      }
      
      h1 {
        color: var(--primary-color);
        font-size: var(--font-xl);
        font-weight: 500;
        margin: 0;
      }

      .view-toggle {
        display: flex;
        gap: var(--spacing-sm);
      }

      .view-btn {
        background-color: var(--bg-light);
        border: 0.0625rem solid var(--border-color);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: background-color var(--transition-default);
        font-size: var(--font-sm);
      }

      .view-btn.active {
        background-color: var(--primary-color);
        color: var(--white);
        border-color: var(--primary-color);
      }

      .search-section {
        margin-bottom: var(--spacing-md);
        width: 100%;
      }
      
      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-sm);
        }
        
        h1 {
          margin-bottom: var(--spacing-xs);
        }
      }
    `;
  }

  static get properties() {
    return {
      _employees: {type: Array},
      _filteredEmployees: {type: Array, state: true},
      _employeeToEdit: {type: Object},
      _isEmployeeModalOpen: {type: Boolean},
      _viewMode: {type: String, state: true},
      _searchTerm: {type: String, state: true},
      _isConfirmModalOpen: {type: Boolean},
      _confirmMessage: {type: String},
      _onConfirm: {type: Function},
      _onCancel: {type: Function},
    };
  }

  constructor() {
    super();
    this._viewMode = 'table';
    this._searchTerm = '';
    this._employees = [];
    this._filteredEmployees = [];
    this._employeeToEdit = undefined;
    this._isEmployeeModalOpen = false;
    this._isConfirmModalOpen = false;
    this._confirmMessage = '';
    this._onConfirm = () => {};
    this._onCancel = () => {};
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
    this._employees = employee;
    this._filterEmployees();
  }

  _filterEmployees() {
    if (!this._searchTerm) {
      this._filteredEmployees = this._employees;
      return;
    }

    const _searchTermLower = this._searchTerm.toLowerCase();
    this._filteredEmployees = this._employees.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(_searchTermLower) ||
        employee.lastName.toLowerCase().includes(_searchTermLower) ||
        employee.department.toLowerCase().includes(_searchTermLower) ||
        employee.position.toLowerCase().includes(_searchTermLower) ||
        employee.email.toLowerCase().includes(_searchTermLower) ||
        (employee.phone && employee.phone.includes(_searchTermLower))
      );
    });
  }

  _handleSearch(e) {
    this._searchTerm = e.detail.value;
    this._filterEmployees();
  }

  _onDelete(e) {
    const _employeeToDelete = e.detail.row;
    const employeeId = e.detail.row.id;

    this._confirmMessage = I18n.t('confirm.delete', {
      firstName: _employeeToDelete?.firstName,
      lastName: _employeeToDelete?.lastName,
    });

    this._onConfirm = () => {
      store.dispatch(deleteEmployee(employeeId));
      this._isConfirmModalOpen = false;
    };
    this._onCancel = () => {
      this._isConfirmModalOpen = false;
    };

    this._isConfirmModalOpen = true;
  }

  _onEdit(e) {
    this._employeeToEdit = e.detail;
    this._isEmployeeModalOpen = true;
  }

  _onModalClosed() {
    this._isEmployeeModalOpen = false;
  }

  _switchView(mode) {
    this._viewMode = mode;
  }

  _handleFormSubmit(e) {
    console.log(e)
    const _employeeToUpdate = e.detail.formData;

    this._confirmMessage = I18n.t('confirm.update', {
      firstName: _employeeToUpdate?.firstName,
      lastName: _employeeToUpdate?.lastName,
    });

    this._onConfirm = () => {
      store.dispatch(updateEmployee(_employeeToUpdate));
      this._isEmployeeModalOpen = false;
      this._isConfirmModalOpen = false;
    };

    this._onCancel = () => {
      this._isConfirmModalOpen = false;
    };

    this._isConfirmModalOpen = true;
  }

  _renderCurrentView() {
    if (this._viewMode === 'table') {
      return html`
        <employee-table
          .employees=${this._filteredEmployees}
          @employee-delete=${this._onDelete}
          @employee-edit=${this._onEdit}
        ></employee-table>
      `;
    } else {
      return html`
        <employee-list
          .employees=${this._filteredEmployees}
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
            class="view-btn ${this._viewMode === 'table' ? 'active' : ''}"
            @click=${() => this._switchView('table')}
          >
            ${I18n.t('button.tableView')}
          </button>
          <button
            class="view-btn ${this._viewMode === 'list' ? 'active' : ''}"
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
        .isOpen=${this._isEmployeeModalOpen}
        .title="${I18n.t('modal.editEmployee')}"
        @modal-closed=${this._onModalClosed}
      >
        ${this._employeeToEdit &&
        html`<employee-form
          type="edit"
          .formData=${this._employeeToEdit}
          @submit-form=${this._handleFormSubmit}
          @cancel-form=${this._onModalClosed}
        ></employee-form>`}
      </modal-dialog>

      <confirmation-dialog
        .isOpen=${this._isConfirmModalOpen}
        .message="${this._confirmMessage}"
        @cancel=${this._onCancel}
        @confirm=${this._onConfirm}
      ></confirmation-dialog>
    </div>`;
  }
}

customElements.define('employee-page', EmployeePage);
