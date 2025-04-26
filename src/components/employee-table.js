import {html, LitElement, css} from 'lit';

const ITEMS_PER_PAGE = 10;

export class EmployeeList extends LitElement {
  static get styles() {
    return css`
      table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        background-color: var(--white);
      }

      th,
      td {
        padding: 1.5rem;
        text-align: center;
        border-bottom: 1px solid #e0e0e0;
        font-weight: 400;
      }

      th {
        font-weight: 600;
        color: var(--primary-color);
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        gap: 0.5rem;
      }

      .pagination button {
        background: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .pagination button:hover {
        background-color: #f5f5f5;
      }

      .pagination button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .pagination button.active {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .pagination .page-info {
        margin: 0 0.5rem;
      }
    `;
  }

  static get properties() {
    return {
      employees: {
        type: Array,
        attribute: false,
        reflect: false,
      },
      currentPage: {
        type: Number,
        state: true,
        reflect: false,
      },
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 0;
  }

  get displayedEmployees() {
    this.totalPages = Math.ceil(this.employees.length / ITEMS_PER_PAGE);
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

  _handlePageChange(newPage) {
    this.currentPage = newPage;
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
            class="action-btn edit-btn"
            @click=${() => this._handleEditClick(employee)}
          >
            ✎
          </button>
          <button
            class="action-btn delete-btn"
            @click=${() => this._handleDeleteClick(employee)}
          >
            🗑
          </button>
        </td>
      </tr>
    `;
  }

  _renderPageNumbers() {
    const totalPages = Math.ceil(this.employees.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return '';

    let pageNumbers = [];
    const currentPage = this.currentPage;

    pageNumbers.push(0);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    if (endPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    if (totalPages > 1 && !pageNumbers.includes(totalPages - 1)) {
      pageNumbers.push(totalPages - 1);
    }
    return pageNumbers.map((page) => {
      if (page === '...') {
        return html`<span class="page-info">${page}</span>`;
      }
      return html`
        <button
          class="${this.currentPage === page ? 'active' : ''}"
          @click=${() => this._handlePageChange(page)}
        >
          ${page + 1}
        </button>
      `;
    });
  }

  render() {
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

      <div class="pagination">
        <button
          @click=${() => this._handlePageChange(this.currentPage - 1)}
          ?disabled=${this.currentPage === 0}
        >
          <
        </button>

        ${this._renderPageNumbers()}

        <button
          @click=${() => this._handlePageChange(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages - 1}
        >
          >
        </button>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeList);
