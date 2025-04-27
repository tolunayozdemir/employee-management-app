import {html, LitElement, css} from 'lit';
import './pagination-component.js';
import './employee-table-not-found.js';
import {I18n} from '../i18n/index.js';
import {formatPhoneNumber, formatDate} from '../utils/formatters.js';

const ITEMS_PER_PAGE = 10;

export class EmployeeList extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        overflow-x: auto;
      }

      .table-container {
        width: 100%;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: var(--box-shadow);
        background-color: var(--white);
        border-radius: var(--radius-sm);
        overflow: hidden;
        min-width: 800px;
        font-size: 1rem;
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
        padding: 0.5rem;
        text-align: right;
      }

      .name-cell {
        font-weight: bold;
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

      @media (max-width: 1024px) {
        table {
          font-size: 0.95rem;
        }
      }

      @media (max-width: 768px) {
        table {
          font-size: 0.9rem;
        }

        td,
        th {
          padding: 1rem 0.5rem;
        }

        .action-btn {
          font-size: 1.1rem;
        }
      }

      @media (max-width: 480px) {
        table {
          font-size: 0.85rem;
        }

        td,
        th {
          padding: 0.75rem 0.35rem;
        }

        .action-btn {
          font-size: 1rem;
          padding: 0.15rem;
        }

        .pagination-wrapper {
          overflow-x: auto;
          font-size: 0.85rem;
        }
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

  _getTotalPages() {
    return Math.ceil(this.employees.length / ITEMS_PER_PAGE);
  }

  _getDisplayedEmployees() {
    const startIndex = this.currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return this.employees.slice(startIndex, endIndex);
  }

  _handleDeleteClick(row) {
    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: {row},
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
        <td class="name-cell">${employee.firstName}</td>
        <td class="name-cell">${employee.lastName}</td>
        <td>${formatDate(employee.dateOfEmployment)}</td>
        <td>${formatDate(employee.dateOfBirth)}</td>
        <td>${formatPhoneNumber(employee.phone)}</td>
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
      <div class="table-container">
        <table class="employee-table">
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input type="checkbox" @change=${this._handleSelectAll} />
              </th>
              <th>${I18n.t('table.firstName')}</th>
              <th>${I18n.t('table.lastName')}</th>
              <th>${I18n.t('table.dateOfEmployment')}</th>
              <th>${I18n.t('table.dateOfBirth')}</th>
              <th>${I18n.t('table.phone')}</th>
              <th>${I18n.t('table.email')}</th>
              <th>${I18n.t('table.department')}</th>
              <th>${I18n.t('table.position')}</th>
              <th class="actions-cell">${I18n.t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this._getDisplayedEmployees().map((employee) =>
              this._renderEmployeeRow(employee)
            )}
          </tbody>
        </table>
      </div>
      <div class="pagination-wrapper">
        <pagination-component
          @page-changed=${this._handlePageChange}
          .currentPage=${this.currentPage}
          .totalPages=${this._getTotalPages()}
          .itemsPerPage=${ITEMS_PER_PAGE}
        ></pagination-component>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeList);
