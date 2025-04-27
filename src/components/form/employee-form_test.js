import {html, fixture, expect} from '@open-wc/testing';
import '../form/employee-form.js';
import store from '../../store/store.js';
import {I18n} from '../../i18n/index.js';

suite('EmployeeForm', () => {
  let originalGetState;
  let originalI18nT;

  setup(() => {
    originalGetState = store.getState;
    originalI18nT = I18n.t;

    store.getState = () => ({
      employees: [{email: 'existing@example.com'}],
      language: 'en',
    });

    I18n.t = (key) => key;
  });

  teardown(() => {
    store.getState = originalGetState;
    I18n.t = originalI18nT;
  });

  test('default initialization', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    expect(el.type).to.be.undefined;
    expect(el.formData).to.deep.equal({
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    });
    expect(el.errors).to.deep.equal({});
    expect(el.editMode).to.be.false;
  });

  test('edit mode detection', async () => {
    const el = await fixture(html`<employee-form type="edit"></employee-form>`);

    expect(el.editMode).to.be.true;
  });

  test('form renders all input fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const formInputs = el.shadowRoot.querySelectorAll('form-input');
    const formSelects = el.shadowRoot.querySelectorAll('form-select');

    expect(formInputs.length).to.equal(6);
    expect(formSelects.length).to.equal(2);
  });

  test('input change updates form data', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const firstNameInput = el.shadowRoot.querySelector(
      'form-input[name="firstName"]'
    );
    firstNameInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {name: 'firstName', value: 'John'},
      })
    );

    expect(el.formData.firstName).to.equal('John');
  });

  test('input change clears related error', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.errors = {firstName: 'This field is required'};

    const firstNameInput = el.shadowRoot.querySelector(
      'form-input[name="firstName"]'
    );
    firstNameInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {name: 'firstName', value: 'John'},
      })
    );

    expect(el.errors.firstName).to.equal('');
  });

  test('select change updates form data', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const departmentSelect = el.shadowRoot.querySelector(
      'form-select[name="department"]'
    );
    departmentSelect.dispatchEvent(
      new CustomEvent('select-change', {
        detail: {name: 'department', value: 'Tech'},
      })
    );

    expect(el.formData.department).to.equal('Tech');
  });

  test('form validation - required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    let eventFired = false;
    el.addEventListener('submit-form', () => {
      eventFired = true;
    });

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(eventFired).to.be.false;
    expect(Object.keys(el.errors).length).to.be.above(0);
    expect(el.errors.firstName).to.not.be.empty;
    expect(el.errors.lastName).to.not.be.empty;
    expect(el.errors.dateOfEmployment).to.not.be.empty;
    expect(el.errors.dateOfBirth).to.not.be.empty;
    expect(el.errors.phone).to.not.be.empty;
    expect(el.errors.email).to.not.be.empty;
    expect(el.errors.department).to.not.be.empty;
    expect(el.errors.position).to.not.be.empty;
  });

  test('form validation - invalid email', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    el.formData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: '05528482652',
      email: 'invalid-email',
      department: 'Tech',
      position: 'Senior',
    };

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(el.errors.email).to.not.be.empty;
  });

  test('form validation - duplicate email', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    el.formData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: '05528482652',
      email: 'existing@example.com',
      department: 'Tech',
      position: 'Senior',
    };

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(el.errors.email).to.not.be.empty;
  });

  test('form validation - future date of employment', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    el.formData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: futureDateString,
      dateOfBirth: '1990-01-01',
      phone: '05528482652',
      email: 'john@example.com',
      department: 'Tech',
      position: 'Senior',
    };

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(el.errors.dateOfEmployment).to.not.be.empty;
  });

  test('form validation - date of birth too young', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 16);
    const recentDateString = recentDate.toISOString().split('T')[0];

    el.formData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: recentDateString,
      phone: '05528482652',
      email: 'john@example.com',
      department: 'Tech',
      position: 'Senior',
    };

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(el.errors.dateOfBirth).to.not.be.empty;
  });

  test('form validation - invalid phone number', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    el.formData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: 'not-a-phone',
      email: 'john@example.com',
      department: 'Tech',
      position: 'Senior',
    };

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(el.errors.phone).to.not.be.empty;
  });

  test('successful form submission', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    el.formData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: '05528482652',
      email: 'john@example.com',
      department: 'Tech',
      position: 'Senior',
    };

    let eventFired = false;
    let eventDetail = null;

    el.addEventListener('submit-form', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(eventFired).to.be.true;
    expect(eventDetail).to.deep.equal({
      formData: el.formData,
    });
  });

  test('cancel button triggers cancel-form event', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    let eventFired = false;
    el.addEventListener('cancel-form', () => {
      eventFired = true;
    });

    const cancelButton = el.shadowRoot.querySelector('button.cancel');
    cancelButton.click();

    expect(eventFired).to.be.true;
  });

  test('email field is disabled in edit mode', async () => {
    const el = await fixture(html`<employee-form type="edit"></employee-form>`);

    const emailInput = el.shadowRoot.querySelector('form-input[name="email"]');
    expect(emailInput.disabled).to.be.true;
  });

  test('submit button shows correct text based on mode', async () => {
    const addEl = await fixture(html`<employee-form></employee-form>`);
    const editEl = await fixture(
      html`<employee-form type="edit"></employee-form>`
    );

    const addButton = addEl.shadowRoot.querySelector('button[type="submit"]');
    const editButton = editEl.shadowRoot.querySelector('button[type="submit"]');

    expect(addButton.textContent.trim()).to.not.equal(
      editButton.textContent.trim()
    );
  });

  test('a11y', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    await expect(el).to.be.accessible();
  });

  test('_getDateOfBirthErrorMessage - future date', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const result = el._getDateOfBirthErrorMessage(futureDateStr);

    expect(result).to.equal('error.future.dateOfBirth');
  });

  test('_getDateOfBirthErrorMessage - month adjustment', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const almostEighteen = new Date();
    almostEighteen.setFullYear(almostEighteen.getFullYear() - 17);
    almostEighteen.setMonth(almostEighteen.getMonth() - 1);
    const almostEighteenStr = almostEighteen.toISOString().split('T')[0];

    const result = el._getDateOfBirthErrorMessage(almostEighteenStr);

    expect(result).to.equal('error.tooYoung');
  });

  test('_getDateOfBirthErrorMessage - date adjustment for birthday not yet occurred', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - 18);
    birthDate.setDate(birthDate.getDate() + 2);

    const birthDateStr = birthDate.toISOString().split('T')[0];
    const result = el._getDateOfBirthErrorMessage(birthDateStr);

    expect(result).to.equal('error.tooYoung');
  });

  test('_getDateOfBirthErrorMessage - too old', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const tooOld = new Date();
    tooOld.setFullYear(tooOld.getFullYear() - 101);
    const tooOldStr = tooOld.toISOString().split('T')[0];

    const result = el._getDateOfBirthErrorMessage(tooOldStr);

    expect(result).to.equal('error.tooOld');
  });
});
