import {LitElement, html} from 'lit';
import './employee-table.js';
import store from '../store/store.js';
import {deleteEmployee} from '../store/actions.js';

export class EmployeeApp extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
    };
  }

  constructor() {
    super();
    this.employees = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe(() =>
      this._stateChanged(store.getState())
    );
    this._stateChanged(store.getState());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _stateChanged(state) {
    this.employees = state.employees;
  }

  _handleDeleteEmployee(e) {
    const employeeId = e.detail.id;
    store.dispatch(deleteEmployee(employeeId));
  }

  render() {
    return html` <div>
      <employee-table
        .employees=${this.employees}
        @employee-delete=${this._handleDeleteEmployee}
      ></employee-table>
    </div>`;
  }
}

customElements.define('employee-app', EmployeeApp);
