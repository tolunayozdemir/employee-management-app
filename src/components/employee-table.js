import {html, LitElement, css} from 'lit';
import './pagination-component.js';
import './employee-table-not-found.js';

const ITEMS_PER_PAGE = 10;

export class EmployeeList extends LitElement {
  static get styles() {
    return css`
      table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: var(--box-shadow);
        background-color: var(--white);
        border-radius: var(--radius-sm);
        overflow: hidden;
      }

      th,
      td {
        padding: 1.5rem;
        text-align: center;
        border-bottom: 0.0625rem solid var(--border-color);
        font-weight: 400;
      }

      th {
        font-weight: 600;
        color: var(--primary-color);
      }

      .checkbox-cell {
        width: 2.5rem;
        padding: 0;
        text-align: right;
      }

      .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0.25rem;
        transition: opacity var(--transition-default);
      }

      .action-btn:hover {
        opacity: 0.7;
      }
    `;
  }

  static get properties() {
    return {
      employees: {
        type: Array,
        attribute: false,
      },
      currentPage: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 0;
  }

  get totalPages() {
    return Math.ceil(this.employees.length / ITEMS_PER_PAGE);
  }

  get displayedEmployees() {
    const startIndex = this.currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return this.employees.slice(startIndex, endIndex);
  }

  _handleDeleteClick(row) {
    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: {id: row.id},
      })
    );
  }

  _handleEditClick(row) {
    this.dispatchEvent(
      new CustomEvent('employee-edit', {
        detail: row,
      })
    );
  }

  _handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  _renderEmployeeRow(employee) {
    return html`
      <tr>
        <td class="checkbox-cell">
          <input type="checkbox" .value=${employee.id} />
        </td>
        <td>${employee.firstName}</td>
        <td>${employee.lastName}</td>
        <td>${employee.dateOfEmployment}</td>
        <td>${employee.dateOfBirth}</td>
        <td>${employee.phone}</td>
        <td>${employee.email}</td>
        <td>${employee.department}</td>
        <td>${employee.position}</td>
        <td class="actions-cell">
          <button
            class="action-btn"
            @click=${() => this._handleEditClick(employee)}
          >
            ✎
          </button>
          <button
            class="action-btn"
            @click=${() => this._handleDeleteClick(employee)}
          >
            🗑
          </button>
        </td>
      </tr>
    `;
  }

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`
        <employee-table-not-found
          @add-employee-clicked="${this._handleAddEmployeeClicked}"
        ></employee-table-not-found>
      `;
    }
    
    return html`
      <table class="employee-table">
        <thead>
          <tr>
            <th class="checkbox-cell">
              <input type="checkbox" @change=${this._handleSelectAll} />
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th class="actions-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.displayedEmployees.map((employee) =>
            this._renderEmployeeRow(employee)
          )}
        </tbody>
      </table>
      <pagination-component
        @page-changed=${this._handlePageChange}
        .currentPage=${this.currentPage}
        .totalPages=${this.totalPages}
        .itemsPerPage=${ITEMS_PER_PAGE}
      ></pagination-component>
    `;
  }
}

customElements.define('employee-table', EmployeeList);
