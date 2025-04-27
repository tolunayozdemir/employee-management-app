import {html, LitElement, css} from 'lit';
import {I18n} from '../i18n/index.js';

const ITEMS_PER_PAGE = 50;

export class EmployeeListView extends LitElement {
  static get styles() {
    return css`
      .list-container {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .employee-card {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: var(--spacing-lg);
        border-radius: var(--radius-md);
        background-color: var(--white);
        box-shadow: var(--box-shadow);
        width: 15rem;
      }

      .employee-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-sm);
      }

      .employee-name {
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--primary-color);
        margin: 0;
      }

      .employee-actions {
        display: flex;
        gap: var(--spacing-sm);
      }

      .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: var(--font-lg);
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
      }

      .action-btn:hover {
        opacity: 0.7;
      }

      .employee-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-sm);
      }

      .detail-item {
        display: flex;
        flex-direction: column;
      }

      .detail-label {
        font-size: var(--font-sm);
        color: var(--text-color-light);
        margin-bottom: var(--spacing-xs);
      }

      .detail-value {
        font-size: var(--font-base);
        color: var(--text-color);
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

  _renderEmployeeCard(employee) {
    return html`
      <div class="employee-card">
        <div class="employee-header">
          <h3 class="employee-name">
            ${employee.firstName} ${employee.lastName}
          </h3>
          <div class="employee-actions">
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
          </div>
        </div>
        <div class="employee-details">
          <div class="detail-item">
            <span class="detail-label">${I18n.t('card.department')}</span>
            <span class="detail-value">${employee.department}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${I18n.t('card.position')}</span>
            <span class="detail-value">${employee.position}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${I18n.t('card.employmentDate')}</span>
            <span class="detail-value">${employee.dateOfEmployment}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${I18n.t('card.email')}</span>
            <span class="detail-value">${employee.email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${I18n.t('card.phone')}</span>
            <span class="detail-value">${employee.phone}</span>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="list-container">
        ${this.displayedEmployees.map((employee) =>
          this._renderEmployeeCard(employee)
        )}
      </div>

      <pagination-component
        @page-changed=${this._handlePageChange}
        .currentPage=${this.currentPage}
        .totalPages=${this.totalPages}
        .itemsPerPage=${ITEMS_PER_PAGE}
      ></pagination-component>
    `;
  }
}

customElements.define('employee-list', EmployeeListView);
