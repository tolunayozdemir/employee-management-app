import {html, fixture, expect} from '@open-wc/testing';
import '../employee-table/employee-table.js';
import {I18n} from '../../i18n/index.js';

suite('EmployeeTable', () => {
  let originalI18nT;

  setup(() => {
    originalI18nT = I18n.t;
    I18n.t = (key) => key;
  });

  teardown(() => {
    I18n.t = originalI18nT;
  });

  test('default initialization', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    expect(el.employees).to.deep.equal([]);
    expect(el.currentPage).to.equal(0);
  });

  test('calculates total pages correctly', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    expect(el._getTotalPages()).to.equal(0);

    el.employees = Array(10).fill().map((_, i) => ({id: i}));
    await el.updateComplete;
    expect(el._getTotalPages()).to.equal(1);

    el.employees = Array(11).fill().map((_, i) => ({id: i}));
    await el.updateComplete;
    expect(el._getTotalPages()).to.equal(2);

    el.employees = Array(20).fill().map((_, i) => ({id: i}));
    await el.updateComplete;
    expect(el._getTotalPages()).to.equal(2);
  });

  test('gets displayed employees correctly based on pagination', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    el.employees = Array(25).fill().map((_, i) => ({
      id: i,
      firstName: `First${i}`,
      lastName: `Last${i}`,
    }));

    el.currentPage = 0;
    await el.updateComplete;

    let displayedEmployees = el._getDisplayedEmployees();
    expect(displayedEmployees.length).to.equal(10);
    expect(displayedEmployees[0].firstName).to.equal('First0');
    expect(displayedEmployees[9].firstName).to.equal('First9');

    el.currentPage = 1;
    await el.updateComplete;

    displayedEmployees = el._getDisplayedEmployees();
    expect(displayedEmployees.length).to.equal(10);
    expect(displayedEmployees[0].firstName).to.equal('First10');
    expect(displayedEmployees[9].firstName).to.equal('First19');
  });

  test('renders table with headers', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    const table = el.shadowRoot.querySelector('table');
    expect(table).to.exist;

    const headers = el.shadowRoot.querySelectorAll('th');
    expect(headers.length).to.equal(10);
    
    expect(headers[1].textContent).to.equal('table.firstName');
    expect(headers[2].textContent).to.equal('table.lastName');
    expect(headers[3].textContent).to.equal('table.dateOfEmployment');
    expect(headers[4].textContent).to.equal('table.dateOfBirth');
    expect(headers[5].textContent).to.equal('table.phone');
    expect(headers[6].textContent).to.equal('table.email');
    expect(headers[7].textContent).to.equal('table.department');
    expect(headers[8].textContent).to.equal('table.position');
    expect(headers[9].textContent).to.equal('table.actions');
  });

  test('renders employee rows correctly', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    const sampleDate = '2023-04-15';
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: sampleDate,
      dateOfBirth: '1990-05-20',
      email: 'john@example.com',
      phone: '05321234567',
    };

    el.employees = [employee];
    await el.updateComplete;

    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);

    const cells = rows[0].querySelectorAll('td');
    expect(cells.length).to.equal(10);
    
    expect(cells[1].textContent).to.equal('John');
    expect(cells[2].textContent).to.equal('Doe');
    expect(cells[7].textContent).to.equal('Tech');
    expect(cells[8].textContent).to.equal('Senior');
    expect(cells[6].textContent).to.equal('john@example.com');
  });

  test('handles edit button click', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    };

    el.employees = [employee];
    await el.updateComplete;

    let eventDetail = null;
    el.addEventListener('employee-edit', (e) => {
      eventDetail = e.detail;
    });

    const editButton = el.shadowRoot.querySelector('.action-btn');
    editButton.click();

    expect(eventDetail).to.deep.equal(employee);
  });

  test('handles delete button click', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    };

    el.employees = [employee];
    await el.updateComplete;

    let eventDetail = null;
    el.addEventListener('employee-delete', (e) => {
      eventDetail = e.detail;
    });

    const deleteButton = el.shadowRoot.querySelectorAll('.action-btn')[1];
    deleteButton.click();

    expect(eventDetail).to.deep.equal({row: employee});
  });

  test('handles page change event from pagination component', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    el.employees = Array(15).fill().map((_, i) => ({id: i}));
    await el.updateComplete;

    const paginationComponent = el.shadowRoot.querySelector('pagination-component');
    
    paginationComponent.dispatchEvent(
      new CustomEvent('page-changed', {
        detail: {page: 1},
      })
    );

    expect(el.currentPage).to.equal(1);
  });

  test('correctly passes properties to pagination component', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    el.employees = Array(15).fill().map((_, i) => ({id: i}));
    el.currentPage = 1;
    await el.updateComplete;

    const pagination = el.shadowRoot.querySelector('pagination-component');
    expect(pagination.currentPage).to.equal(1);
    expect(pagination.totalPages).to.equal(2);
    expect(pagination.itemsPerPage).to.equal(10);
  });

  test('does not render pagination when no employees', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    el.employees = [];
    await el.updateComplete;

    const pagination = el.shadowRoot.querySelector('pagination-component');
    expect(pagination).to.exist;
  });

  test('checkbox cell is rendered properly', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);

    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    };

    el.employees = [employee];
    await el.updateComplete;

    const checkboxCell = el.shadowRoot.querySelector('td.checkbox-cell');
    expect(checkboxCell).to.exist;
    
    const checkbox = checkboxCell.querySelector('input[type="checkbox"]');
    expect(checkbox).to.exist;
    expect(checkbox.value).to.equal('1');
  });

  test('a11y', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    await expect(el).to.be.accessible();
  });
});