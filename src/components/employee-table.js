import {html, LitElement, css} from 'lit';

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
    `;
  }
  static get properties() {
    return {
      employees: {type: Array},
    };
  }

  constructor() {
    super();
    this.employees = [];
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
          ${this.employees.map((employee) => this._renderEmployeeRow(employee))}
        </tbody>
      </table>
    `;
  }
}

customElements.define('employee-table', EmployeeList);
