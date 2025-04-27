import {LitElement, html, css} from 'lit';
import store from '../store/store.js';
import './form-input.js';
import './form-select.js';
import {I18n} from '../i18n/index.js';

const DEPARTMENTS = ['Analytics', 'Tech'];
const POSITIONS = ['Junior', 'Medior', 'Senior'];

export class EmployeeForm extends LitElement {
  static get properties() {
    return {
      type: {type: String},
      formData: {type: Object},
      errors: {type: Object},
    };
  }

  constructor() {
    super();
    this.errors = {};

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
  }

  get editMode() {
    return this.type === 'edit';
  }

  static get styles() {
    return css`
      .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }

      button {
        padding: 0.8rem 1.4rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.3s;
      }

      button:hover {
        opacity: 0.9;
      }
      button:active {
        opacity: 0.8;
      }

      button.cancel {
        background-color: #95a5a6;
      }

      @media (max-width: 768px) {
        .form-container {
          padding: 1.5rem;
        }

        .button-group {
          flex-direction: column;
          gap: 0.75rem;
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

  validateForm() {
    let isValid = true;
    const newErrors = {...this.errors};

    if (!this.formData.firstName.trim()) {
      newErrors.firstName = I18n.t('error.required.firstName');
      isValid = false;
    } else {
      newErrors.firstName = '';
    }

    if (!this.formData.lastName.trim()) {
      newErrors.lastName = I18n.t('error.required.lastName');
      isValid = false;
    } else {
      newErrors.lastName = '';
    }

    if (!this.formData.dateOfEmployment) {
      newErrors.dateOfEmployment = I18n.t('error.required.dateOfEmployment');
      isValid = false;
    } else {
      const employmentDate = new Date(this.formData.dateOfEmployment);
      const today = new Date();
      if (employmentDate > today) {
        newErrors.dateOfEmployment = I18n.t('error.future.dateOfEmployment');
        isValid = false;
      } else {
        newErrors.dateOfEmployment = '';
      }
    }

    if (!this.formData.dateOfBirth) {
      newErrors.dateOfBirth = I18n.t('error.required.dateOfBirth');
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
        newErrors.dateOfBirth = I18n.t('error.future.dateOfBirth');
        isValid = false;
      } else if (age < minAge) {
        newErrors.dateOfBirth = I18n.t('error.tooYoung');
        isValid = false;
      } else if (age > maxAge) {
        newErrors.dateOfBirth = I18n.t('error.tooOld');
        isValid = false;
      } else {
        newErrors.dateOfBirth = '';
      }
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!this.formData.phone.trim()) {
      newErrors.phone = I18n.t('error.required.phone');
      isValid = false;
    } else if (!phoneRegex.test(this.formData.phone)) {
      newErrors.phone = I18n.t('error.invalid.phone');
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email.trim()) {
      newErrors.email = I18n.t('error.required.email');
      isValid = false;
    } else if (!emailRegex.test(this.formData.email)) {
      newErrors.email = I18n.t('error.invalid.email');
      isValid = false;
    } else if (!this.editMode) {
      const employeesState = store.getState().employees;
      const emailExists = employeesState.some(
        (emp) => emp.email === this.formData.email
      );
      if (emailExists) {
        newErrors.email = I18n.t('error.duplicate.email');
        isValid = false;
      } else {
        newErrors.email = '';
      }
    }

    if (!this.formData.department) {
      newErrors.department = I18n.t('error.required.department');
      isValid = false;
    } else {
      newErrors.department = '';
    }

    if (!this.formData.position) {
      newErrors.position = I18n.t('error.required.position');
      isValid = false;
    } else {
      newErrors.position = '';
    }

    this.errors = newErrors;
    return isValid;
  }

  handleInputChange(e) {
    const field = e.detail.name;
    const value = e.detail.value;

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
    this.dispatchEvent(new CustomEvent('cancel-form'));
  }

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <div class="form-row">
          <form-input
            label="${I18n.t('form.firstName')}"
            name="firstName"
            .value="${this.formData.firstName}"
            .error="${this.errors.firstName}"
            @input-change="${this.handleInputChange}"
          ></form-input>

          <form-input
            label="${I18n.t('form.lastName')}"
            name="lastName"
            .value="${this.formData.lastName}"
            .error="${this.errors.lastName}"
            @input-change="${this.handleInputChange}"
          ></form-input>
        </div>

        <div class="form-row">
          <form-input
            label="${I18n.t('form.dateOfEmployment')}"
            name="dateOfEmployment"
            type="date"
            .value="${this.formData.dateOfEmployment}"
            .error="${this.errors.dateOfEmployment}"
            @input-change="${this.handleInputChange}"
          ></form-input>

          <form-input
            label="${I18n.t('form.dateOfBirth')}"
            name="dateOfBirth"
            type="date"
            .value="${this.formData.dateOfBirth}"
            .error="${this.errors.dateOfBirth}"
            @input-change="${this.handleInputChange}"
          ></form-input>
        </div>

        <div class="form-row">
          <form-input
            label="${I18n.t('form.phone')}"
            name="phone"
            type="tel"
            placeholder="${I18n.t('form.phoneFormat')}"
            .value="${this.formData.phone}"
            .error="${this.errors.phone}"
            @input-change="${this.handleInputChange}"
          ></form-input>

          <form-input
            label="${I18n.t('form.email')}"
            name="email"
            type="email"
            placeholder="${I18n.t('form.emailFormat')}"
            .value="${this.formData.email}"
            .error="${this.errors.email}"
            .disabled="${this.editMode}"
            @input-change="${this.handleInputChange}"
          ></form-input>
        </div>

        <div class="form-row">
          <form-select
            label="${I18n.t('form.department')}"
            name="department"
            .options="${DEPARTMENTS}"
            .value="${this.formData.department}"
            placeholder="${I18n.t('form.selectDepartment')}"
            .error="${this.errors.department}"
            @select-change="${this.handleInputChange}"
          ></form-select>

          <form-select
            label="${I18n.t('form.position')}"
            name="position"
            .options="${POSITIONS}"
            .value="${this.formData.position}"
            placeholder="${I18n.t('form.selectPosition')}"
            .error="${this.errors.position}"
            @select-change="${this.handleInputChange}"
          ></form-select>
        </div>

        <div class="button-group">
          <button
            type="button"
            class="cancel"
            @click="${this.handleCancelClick}"
          >
            ${I18n.t('button.cancel')}
          </button>
          <button type="submit">
            ${this.editMode ? I18n.t('button.update') : I18n.t('button.add')}
          </button>
        </div>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
