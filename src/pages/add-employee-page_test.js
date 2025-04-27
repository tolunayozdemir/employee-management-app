import {html, fixture, expect} from '@open-wc/testing';
import './add-employee-page.js';
import {Router} from '@vaadin/router';
import store from '../store/store.js';
import {addEmployee} from '../store/actions.js';
import {I18n} from '../i18n/index.js';

suite('AddEmployeePage', () => {
  let originalGetState;
  let originalI18nT;
  let originalRouterGo;
  let originalStoreDispatch;
  let dispatchedActions;
  let navigatedTo;

  setup(() => {
    originalGetState = store.getState;
    originalI18nT = I18n.t;
    originalRouterGo = Router.go;
    originalStoreDispatch = store.dispatch;

    store.getState = () => ({employees: [], language: 'en'});
    I18n.t = (key, data) => key + (data ? JSON.stringify(data) : '');

    navigatedTo = null;
    Router.go = (path) => {
      navigatedTo = path;
    };

    dispatchedActions = [];
    store.dispatch = (action) => {
      dispatchedActions.push(action);
    };
  });

  teardown(() => {
    store.getState = originalGetState;
    I18n.t = originalI18nT;
    Router.go = originalRouterGo;
    store.dispatch = originalStoreDispatch;
  });

  test('default initialization', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);

    expect(el).to.be.instanceOf(customElements.get('add-employee-page'));
    expect(el._isConfirmModalOpen).to.be.false;
    expect(el._confirmMessage).to.equal('');
    expect(el._onConfirm).to.be.a('function');
    expect(el._onCancel).to.be.a('function');
  });

  test('renders employee form and confirmation dialog', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    const confirmationDialog = el.shadowRoot.querySelector(
      'confirmation-dialog'
    );
    const title = el.shadowRoot.querySelector('h2');

    expect(employeeForm).to.exist;
    expect(confirmationDialog).to.exist;
    expect(title.textContent).to.equal('page.addEmployee');
  });

  test('canceling the form navigates to home page', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    employeeForm.dispatchEvent(new CustomEvent('cancel-form'));

    expect(navigatedTo).to.equal('/');
  });

  test('form submission opens confirmation dialog with correct message', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);

    const employeeData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    employeeForm.dispatchEvent(
      new CustomEvent('submit-form', {
        detail: {
          formData: employeeData,
        },
      })
    );

    expect(el._isConfirmModalOpen).to.be.true;
    expect(el._confirmMessage).to.equal(
      'confirm.add{"firstName":"John","lastName":"Doe"}'
    );
  });

  test('confirmation dialog confirm action dispatches addEmployee and navigates home', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);

    const employeeData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    employeeForm.dispatchEvent(
      new CustomEvent('submit-form', {
        detail: {
          formData: employeeData,
        },
      })
    );

    const confirmFunction = el._onConfirm;

    confirmFunction();

    expect(el._isConfirmModalOpen).to.be.false;
    expect(dispatchedActions.length).to.equal(1);
    expect(dispatchedActions[0]).to.deep.equal(addEmployee(employeeData));
    expect(navigatedTo).to.equal('/');
  });

  test('confirmation dialog cancel action closes dialog without navigation', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);

    const employeeData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    employeeForm.dispatchEvent(
      new CustomEvent('submit-form', {
        detail: {
          formData: employeeData,
        },
      })
    );

    expect(el._isConfirmModalOpen).to.be.true;

    const cancelFunction = el._onCancel;

    cancelFunction();

    expect(el._isConfirmModalOpen).to.be.false;
    expect(dispatchedActions.length).to.equal(0);
    expect(navigatedTo).to.be.null;
  });

  test('a11y', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    await expect(el).to.be.accessible();
  });
});
