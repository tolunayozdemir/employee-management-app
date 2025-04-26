import {LitElement, html, css} from 'lit';
import store from '../store/store.js';

export class EmployeeForm extends LitElement {
  static get properties() {
    return {
      formData: {type: Object},
      type: {type: String},
    };
  }

  get editMode() {
    return this.type === 'edit';
  }

  static get styles() {
    return css`
      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: #34495e;
      }

      input,
      select {
        width: 100%;
        padding: .8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 1rem;
        transition: border-color 0.3s;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: #3498db;
      }

      .error {
        color: #e74c3c;
        font-size: .9rem;
        margin-top: 5px;
      }

      .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }

      button {
        padding: .8rem 1.4rem;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: #2980b9;
      }

      button.cancel {
        background-color: #95a5a6;
      }

      button.cancel:hover {
        background-color: #7f8c8d;
      }

      /* Responsive styles */
      @media (max-width: 768px) {
        .form-container {
          padding: 1.5rem;
        }

        .button-group {
          flex-direction: column;
          gap: .75rem;
        }

        button {
          width: 100%;
        }
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.4rem;
      }

      @media (max-width: 600px) {
        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  constructor() {
    super();
    this.departments = ['Analytics', 'Tech'];
    this.positions = ['Junior', 'Medior', 'Senior'];
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };

    this.errors = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
  }

  validateForm() {
    let isValid = true;
    const newErrors = {...this.errors};

    if (!this.formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else {
      newErrors.firstName = '';
    }

    if (!this.formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else {
      newErrors.lastName = '';
    }

    if (!this.formData.dateOfEmployment) {
      newErrors.dateOfEmployment = 'Date of employment is required';
      isValid = false;
    } else {
      const employmentDate = new Date(this.formData.dateOfEmployment);
      const today = new Date();
      if (employmentDate > today) {
        newErrors.dateOfEmployment =
          'Date of employment cannot be in the future';
        isValid = false;
      } else {
        newErrors.dateOfEmployment = '';
      }
    }

    if (!this.formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    } else {
      const birthDate = new Date(this.formData.dateOfBirth);
      const today = new Date();
      const minAge = 18;
      const maxAge = 100;

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        isValid = false;
      } else if (age < minAge) {
        newErrors.dateOfBirth = 'Employee must be at least 18 years old';
        isValid = false;
      } else if (age > maxAge) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
        isValid = false;
      } else {
        newErrors.dateOfBirth = '';
      }
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!this.formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(this.formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else if ((!this.editMode)) {
      const employeesState = store.getState().employees;
      const emailExists = employeesState.some(
        (emp) => emp.email === this.formData.email
      );
      if (emailExists) {
        newErrors.email = 'This email address is already registered';
        isValid = false;
      } else {
        newErrors.email = '';
      }
    }

    if (!this.formData.department) {
      newErrors.department = 'Department is required';
      isValid = false;
    } else {
      newErrors.department = '';
    }

    if (!this.formData.position) {
      newErrors.position = 'Position is required';
      isValid = false;
    } else {
      newErrors.position = '';
    }

    this.errors = newErrors;
    return isValid;
  }

  handleInputChange(e) {
    const field = e.target.name;
    const value = e.target.value;

    this.formData = {
      ...this.formData,
      [field]: value,
    };

    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: '',
      };
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateForm()) {
      this.dispatchEvent(
        new CustomEvent('submit-form', {
          detail: {
            formData: this.formData,
          },
        })
      );
    }
  }

  handleCancelClick() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              .value="${this.formData.firstName}"
              @input="${this.handleInputChange}"
            />
            ${this.errors.firstName
              ? html`<div class="error">${this.errors.firstName}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              .value="${this.formData.lastName}"
              @input="${this.handleInputChange}"
            />
            ${this.errors.lastName
              ? html`<div class="error">${this.errors.lastName}</div>`
              : ''}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dateOfEmployment">Date of Employment</label>
            <input
              type="date"
              id="dateOfEmployment"
              name="dateOfEmployment"
              .value="${this.formData.dateOfEmployment}"
              @input="${this.handleInputChange}"
            />
            ${this.errors.dateOfEmployment
              ? html`<div class="error">${this.errors.dateOfEmployment}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              .value="${this.formData.dateOfBirth}"
              @input="${this.handleInputChange}"
            />
            ${this.errors.dateOfBirth
              ? html`<div class="error">${this.errors.dateOfBirth}</div>`
              : ''}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+90XXXXXXXXXX"
              .value="${this.formData.phone}"
              @input="${this.handleInputChange}"
            />
            ${this.errors.phone
              ? html`<div class="error">${this.errors.phone}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@company.com"
              .value="${this.formData.email}"
              @input="${this.handleInputChange}"
              ?disabled="${this.editMode}"
            />
            ${this.errors.email
              ? html`<div class="error">${this.errors.email}</div>`
              : ''}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="department">Department</label>
            <select
              id="department"
              name="department"
              .value="${this.formData.department}"
              @change="${this.handleInputChange}"
            >
              <option value="" disabled selected>Select department</option>
              ${this.departments.map(
                (dept) => html` <option value="${dept}">${dept}</option> `
              )}
            </select>
            ${this.errors.department
              ? html`<div class="error">${this.errors.department}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="position">Position</label>
            <select
              id="position"
              name="position"
              .value="${this.formData.position}"
              @change="${this.handleInputChange}"
            >
              <option value="" disabled selected>Select position</option>
              ${this.positions.map(
                (pos) => html` <option value="${pos}">${pos}</option> `
              )}
            </select>
            ${this.errors.position
              ? html`<div class="error">${this.errors.position}</div>`
              : ''}
          </div>
        </div>

        <div class="button-group">
          <button
            type="button"
            class="cancel"
            @click="${this.handleCancelClick}"
          >
            Cancel
          </button>
          <button type="submit">${this.editMode ? 'Update Employee' : 'Add Employee'}</button>
        </div>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
