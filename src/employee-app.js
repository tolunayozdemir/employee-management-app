import {LitElement, html} from 'lit';
import './components/employee-table.js';
import {employees} from './components/employee.js';

export class EmployeeApp extends LitElement {
  _handleDeleteEmployee(e) {
    console.log(e.detail.id);
  }

  render() {
    return html` <div>
      <employee-table
        .employees=${employees}
        @employee-delete=${this._handleDeleteEmployee}
      ></employee-table>
    </div>`;
  }
}

window.customElements.define('employee-app', EmployeeApp);
