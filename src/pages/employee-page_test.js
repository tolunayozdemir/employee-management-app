import {html, fixture, expect} from '@open-wc/testing';
import './employee-page.js';
import store from '../store/store.js';
import {I18n} from '../i18n/index.js';
import {deleteEmployee, updateEmployee} from '../store/actions.js';

suite('EmployeePage', () => {
  let originalGetState;
  let originalI18nT;
  let originalStoreDispatch;
  let dispatchedActions;

  setup(() => {
    originalGetState = store.getState;
    originalI18nT = I18n.t;
    originalStoreDispatch = store.dispatch;

    store.getState = () => ({
      employees: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '05521234567',
          department: 'Tech',
          position: 'Senior',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '05331234567',
          department: 'Analytics',
          position: 'Medior',
          dateOfEmployment: '2023-02-20',
          dateOfBirth: '1992-08-15',
        },
      ],
      language: 'en',
    });

    I18n.t = (key, data) => key + (data ? JSON.stringify(data) : '');

    dispatchedActions = [];
    store.dispatch = (action) => {
      dispatchedActions.push(action);
    };
  });

  teardown(() => {
    store.getState = originalGetState;
    I18n.t = originalI18nT;
    store.dispatch = originalStoreDispatch;
  });

  test('default initialization', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    expect(el._viewMode).to.equal('table');
    expect(el._searchTerm).to.equal('');
    expect(el._employees.length).to.equal(2);
    expect(el._filteredEmployees.length).to.equal(2);
    expect(el._employeeToEdit).to.be.undefined;
    expect(el._isEmployeeModalOpen).to.be.false;
    expect(el._isConfirmModalOpen).to.be.false;
    expect(el._confirmMessage).to.equal('');
    expect(el._onConfirm).to.be.a('function');
    expect(el._onCancel).to.be.a('function');
  });

  test('renders header with view toggle buttons', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const header = el.shadowRoot.querySelector('.header');
    const h1 = header.querySelector('h1');
    const viewToggle = header.querySelector('.view-toggle');
    const viewButtons = viewToggle.querySelectorAll('.view-btn');
    
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('page.employeeList');
    expect(viewButtons.length).to.equal(2);
    expect(viewButtons[0].textContent.trim()).to.equal('button.tableView');
    expect(viewButtons[1].textContent.trim()).to.equal('button.listView');
    expect(viewButtons[0].classList.contains('active')).to.be.true;
    expect(viewButtons[1].classList.contains('active')).to.be.false;
  });

  test('renders search bar', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const searchBar = el.shadowRoot.querySelector('search-bar');
    expect(searchBar).to.exist;
    expect(searchBar.placeholder).to.equal('search.placeholder');
    expect(searchBar.debounceTime).to.equal(300);
  });
  
  test('renders employee table in default view', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const employeeTable = el.shadowRoot.querySelector('employee-table');
    const employeeList = el.shadowRoot.querySelector('employee-list');
    
    expect(employeeTable).to.exist;
    expect(employeeList).to.be.null;
    expect(employeeTable.employees.length).to.equal(2);
  });

  test('switches view mode when toggle buttons are clicked', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const viewButtons = el.shadowRoot.querySelectorAll('.view-btn');
    const listViewButton = viewButtons[1];
    
    listViewButton.click();
    await el.updateComplete;
    
    expect(el._viewMode).to.equal('list');
    let employeeTable = el.shadowRoot.querySelector('employee-table');
    let employeeList = el.shadowRoot.querySelector('employee-list');
    
    expect(employeeTable).to.be.null;
    expect(employeeList).to.exist;
    expect(employeeList.employees.length).to.equal(2);
    
    const tableViewButton = viewButtons[0];
    tableViewButton.click();
    await el.updateComplete;
    
    expect(el._viewMode).to.equal('table');
    employeeTable = el.shadowRoot.querySelector('employee-table');
    employeeList = el.shadowRoot.querySelector('employee-list');
    
    expect(employeeTable).to.exist;
    expect(employeeList).to.be.null;
  });

  test('filters employees when search is performed', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const searchBar = el.shadowRoot.querySelector('search-bar');
    
    searchBar.dispatchEvent(
      new CustomEvent('search-change', {
        detail: { value: 'john' }
      })
    );
    
    await el.updateComplete;
    
    expect(el._searchTerm).to.equal('john');
    expect(el._filteredEmployees.length).to.equal(1);
    expect(el._filteredEmployees[0].firstName).to.equal('John');
    
    searchBar.dispatchEvent(
      new CustomEvent('search-change', {
        detail: { value: 'tech' }
      })
    );
    
    await el.updateComplete;
    
    expect(el._searchTerm).to.equal('tech');
    expect(el._filteredEmployees.length).to.equal(1);
    expect(el._filteredEmployees[0].department).to.equal('Tech');
    
    searchBar.dispatchEvent(
      new CustomEvent('search-change', {
        detail: { value: '' }
      })
    );
    
    await el.updateComplete;
    
    expect(el._searchTerm).to.equal('');
    expect(el._filteredEmployees.length).to.equal(2);
  });

  test('renders employee-not-found when no employees match search', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const searchBar = el.shadowRoot.querySelector('search-bar');
    
    searchBar.dispatchEvent(
      new CustomEvent('search-change', {
        detail: { value: 'nonexistent' }
      })
    );
    
    await el.updateComplete;
    
    expect(el._filteredEmployees.length).to.equal(0);
    const notFound = el.shadowRoot.querySelector('employee-not-found');
    expect(notFound).to.exist;
  });

  test('opens modal dialog when edit is triggered', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const employeeTable = el.shadowRoot.querySelector('employee-table');
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };
    
    employeeTable.dispatchEvent(
      new CustomEvent('employee-edit', {
        detail: employee
      })
    );
    
    await el.updateComplete;
    
    expect(el._isEmployeeModalOpen).to.be.true;
    expect(el._employeeToEdit).to.deep.equal(employee);
    
    const modal = el.shadowRoot.querySelector('modal-dialog');
    expect(modal).to.exist;
    expect(modal.isOpen).to.be.true;
    
    const form = modal.querySelector('employee-form');
    expect(form).to.exist;
    expect(form.type).to.equal('edit');
    expect(form.formData).to.deep.equal(employee);
  });

  test('closes modal dialog when modal-closed event occurs', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    el._isEmployeeModalOpen = true;
    el._employeeToEdit = { id: 1, firstName: 'John', lastName: 'Doe' };
    await el.updateComplete;
    
    const modal = el.shadowRoot.querySelector('modal-dialog');
    modal.dispatchEvent(new CustomEvent('modal-closed'));
    
    expect(el._isEmployeeModalOpen).to.be.false;
  });

  test('opens confirmation dialog when delete is triggered', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const employeeTable = el.shadowRoot.querySelector('employee-table');
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    };
    
    employeeTable.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: { row: employee }
      })
    );
    
    await el.updateComplete;
    
    expect(el._isConfirmModalOpen).to.be.true;
    expect(el._confirmMessage).to.equal('confirm.delete{"firstName":"John","lastName":"Doe"}');
    
    const confirmDialog = el.shadowRoot.querySelector('confirmation-dialog');
    expect(confirmDialog).to.exist;
    expect(confirmDialog.isOpen).to.be.true;
    expect(confirmDialog.message).to.equal(el._confirmMessage);
  });

  test('dispatches deleteEmployee action when delete is confirmed', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const employeeTable = el.shadowRoot.querySelector('employee-table');
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    };
    
    employeeTable.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: { row: employee }
      })
    );
    
    await el.updateComplete;
    
    expect(el._isConfirmModalOpen).to.be.true;
    
    el._onConfirm();
    expect(dispatchedActions.length).to.equal(1);
    expect(dispatchedActions[0]).to.deep.equal(deleteEmployee(1));
    expect(el._isConfirmModalOpen).to.be.false;
  });

  test('closes confirmation dialog without action when delete is cancelled', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    const employeeTable = el.shadowRoot.querySelector('employee-table');
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    };
    
    employeeTable.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: { row: employee }
      })
    );
    
    await el.updateComplete;
    
    expect(el._isConfirmModalOpen).to.be.true;
    
    el._onCancel();
    expect(dispatchedActions.length).to.equal(0);
    expect(el._isConfirmModalOpen).to.be.false;
  });

  test('opens confirmation dialog when form submit is triggered', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    el._isEmployeeModalOpen = true;
    el._employeeToEdit = { id: 1, firstName: 'John', lastName: 'Doe' };
    await el.updateComplete;
    
    const form = el.shadowRoot.querySelector('employee-form');
    const updatedEmployee = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe',
      position: 'Senior Developer' 
    };
    
    form.dispatchEvent(
      new CustomEvent('submit-form', {
        detail: { formData: updatedEmployee }
      })
    );
    
    await el.updateComplete;
    
    expect(el._isConfirmModalOpen).to.be.true;
    expect(el._confirmMessage).to.equal('confirm.update{"firstName":"John","lastName":"Doe"}');
  });

  test('dispatches updateEmployee action when update is confirmed', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);

    el._isEmployeeModalOpen = true;
    el._employeeToEdit = { id: 1, firstName: 'John', lastName: 'Doe' };
    await el.updateComplete;
    
    const form = el.shadowRoot.querySelector('employee-form');
    const updatedEmployee = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe',
      position: 'Senior Developer' 
    };
    
    form.dispatchEvent(
      new CustomEvent('submit-form', {
        detail: { formData: updatedEmployee }
      })
    );
    
    await el.updateComplete;
    
    el._onConfirm();
    
    expect(dispatchedActions.length).to.equal(1);
    expect(dispatchedActions[0]).to.deep.equal(updateEmployee(updatedEmployee));
    expect(el._isEmployeeModalOpen).to.be.false;
    expect(el._isConfirmModalOpen).to.be.false;
  });

  test('handles store subscription in lifecycle methods', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);
    
    expect(el._employees.length).to.equal(2);
    
    const originalUnsubscribe = el._unsubscribe;
    let unsubscribeCalled = false;
    
    el._unsubscribe = () => {
      unsubscribeCalled = true;
      originalUnsubscribe.call(el);
    };
    
    el.disconnectedCallback();
    
    expect(unsubscribeCalled).to.be.true;
  });

  test('a11y', async () => {
    const el = await fixture(html`<employee-page></employee-page>`);
    await expect(el).to.be.accessible();
  });
});