import {LitElement, html} from 'lit';

export class EmployeeApp extends LitElement {
  render() {
    return html`<p>Hii</p>`;
  }
}

window.customElements.define('employee-app', EmployeeApp);
