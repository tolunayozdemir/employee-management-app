import {html, LitElement, css} from 'lit';
import {Router} from '@vaadin/router';
import store from '../store/store.js';
import {addEmployee} from '../store/actions.js';
import '../components/employee-form';

export class AddEmployeePage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
      }

      .form-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-top: 0;
        margin-bottom: 1.5rem;
        text-align: center;
      }
    `;
  }

  _handleCancel() {
    Router.go('/');
  }

  _handleFormSubmit(e) {
    const formData = e.detail.formData;
    
    if (confirm('Are you sure you want to add this employee?')) {
      store.dispatch(addEmployee(formData));
      Router.go('/');
    }
  }

  render() {
    return html`
      <div class="form-container">
        <h2>Add New Employee</h2>
        <employee-form 
          @cancel=${this._handleCancel}
          @submit-form=${this._handleFormSubmit}
        ></employee-form>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);
