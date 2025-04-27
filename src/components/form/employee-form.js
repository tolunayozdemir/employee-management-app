import {LitElement, html, css} from 'lit';
import store from '../../store/store.js';
import './form-input.js';
import './form-select.js';
import {I18n} from '../../i18n/index.js';
import {
  validateRequired,
  validateNotFutureDate,
  validateDateOfBirth,
  validatePhone,
  validateEmail,
  validateEmailUnique,
} from '../../utils/validators.js';

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
        background-color: var(--secondary-button-color);
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

  _getExistingEmails() {
    const employeesState = store.getState().employees;
    return employeesState.map((emp) => emp.email);
  }

  _getDateOfBirthErrorMessage(dateStr) {
    const birthDate = new Date(dateStr);
    const today = new Date();

    if (birthDate > today) {
      return I18n.t('error.future.dateOfBirth');
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age < 18 ? I18n.t('error.tooYoung') : I18n.t('error.tooOld');
  }

  _validateForm() {
    const {formData, editMode} = this;
    const errors = {};
    let isValid = true;

    if (!validateRequired(formData.firstName)) {
      errors.firstName = I18n.t('error.required.firstName');
      isValid = false;
    }

    if (!validateRequired(formData.lastName)) {
      errors.lastName = I18n.t('error.required.lastName');
      isValid = false;
    }

    if (!validateRequired(formData.dateOfEmployment)) {
      errors.dateOfEmployment = I18n.t('error.required.dateOfEmployment');
      isValid = false;
    } else if (!validateNotFutureDate(formData.dateOfEmployment)) {
      errors.dateOfEmployment = I18n.t('error.future.dateOfEmployment');
      isValid = false;
    }

    if (!validateRequired(formData.dateOfBirth)) {
      errors.dateOfBirth = I18n.t('error.required.dateOfBirth');
      isValid = false;
    } else if (!validateDateOfBirth(formData.dateOfBirth)) {
      errors.dateOfBirth = this._getDateOfBirthErrorMessage(
        formData.dateOfBirth
      );
      isValid = false;
    }

    if (!validateRequired(formData.phone)) {
      errors.phone = I18n.t('error.required.phone');
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = I18n.t('error.invalid.phone');
      isValid = false;
    }

    if (!validateRequired(formData.email)) {
      errors.email = I18n.t('error.required.email');
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = I18n.t('error.invalid.email');
      isValid = false;
    } else if (!editMode) {
      const existingEmails = this._getExistingEmails();
      if (!validateEmailUnique(formData.email, existingEmails)) {
        errors.email = I18n.t('error.duplicate.email');
        isValid = false;
      }
    }

    if (!validateRequired(formData.department)) {
      errors.department = I18n.t('error.required.department');
      isValid = false;
    }

    if (!validateRequired(formData.position)) {
      errors.position = I18n.t('error.required.position');
      isValid = false;
    }

    this.errors = errors;
    return isValid;
  }

  _handleInputChange(e) {
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

  _handleSubmit(e) {
    e.preventDefault();

    if (this._validateForm()) {
      this.dispatchEvent(
        new CustomEvent('submit-form', {
          detail: {
            formData: this.formData,
          },
        })
      );
    }
  }

  _handleCancelClick() {
    this.dispatchEvent(new CustomEvent('cancel-form'));
  }

  render() {
    return html`
      <form @submit="${this._handleSubmit}" action="javascript:void(0);">
        <div class="form-row">
          <form-input
            label="${I18n.t('form.firstName')}"
            name="firstName"
            .value="${this.formData.firstName}"
            .error="${this.errors.firstName}"
            @input-change="${this._handleInputChange}"
          ></form-input>

          <form-input
            label="${I18n.t('form.lastName')}"
            name="lastName"
            .value="${this.formData.lastName}"
            .error="${this.errors.lastName}"
            @input-change="${this._handleInputChange}"
          ></form-input>
        </div>

        <div class="form-row">
          <form-input
            label="${I18n.t('form.dateOfEmployment')}"
            name="dateOfEmployment"
            type="date"
            .value="${this.formData.dateOfEmployment}"
            .error="${this.errors.dateOfEmployment}"
            @input-change="${this._handleInputChange}"
          ></form-input>

          <form-input
            label="${I18n.t('form.dateOfBirth')}"
            name="dateOfBirth"
            type="date"
            .value="${this.formData.dateOfBirth}"
            .error="${this.errors.dateOfBirth}"
            @input-change="${this._handleInputChange}"
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
            @input-change="${this._handleInputChange}"
          ></form-input>

          <form-input
            label="${I18n.t('form.email')}"
            name="email"
            type="email"
            placeholder="${I18n.t('form.emailFormat')}"
            .value="${this.formData.email}"
            .error="${this.errors.email}"
            .disabled="${this.editMode}"
            @input-change="${this._handleInputChange}"
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
            @select-change="${this._handleInputChange}"
          ></form-select>

          <form-select
            label="${I18n.t('form.position')}"
            name="position"
            .options="${POSITIONS}"
            .value="${this.formData.position}"
            placeholder="${I18n.t('form.selectPosition')}"
            .error="${this.errors.position}"
            @select-change="${this._handleInputChange}"
          ></form-select>
        </div>

        <div class="button-group">
          <button
            type="button"
            class="cancel"
            @click="${this._handleCancelClick}"
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
