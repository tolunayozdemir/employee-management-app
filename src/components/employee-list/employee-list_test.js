import {html, fixture, expect} from '@open-wc/testing';
import '../employee-list/employee-list.js';
import {I18n} from '../../i18n/index.js';

suite('EmployeeListView', () => {
  let originalI18nT;

  setup(() => {
    originalI18nT = I18n.t;
    I18n.t = (key) => key;
  });

  teardown(() => {
    I18n.t = originalI18nT;
  });

  test('default initialization', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    expect(el.employees).to.deep.equal([]);
    expect(el.currentPage).to.equal(0);
  });

  test('calculates total pages correctly', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    expect(el.totalPages).to.equal(0);

    el.employees = Array(50)
      .fill()
      .map((_, i) => ({id: i}));
    await el.updateComplete;
    expect(el.totalPages).to.equal(1);

    el.employees = Array(51)
      .fill()
      .map((_, i) => ({id: i}));
    await el.updateComplete;
    expect(el.totalPages).to.equal(2);

    el.employees = Array(100)
      .fill()
      .map((_, i) => ({id: i}));
    await el.updateComplete;
    expect(el.totalPages).to.equal(2);
  });

  test('displays correct employees based on pagination', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    el.employees = Array(75)
      .fill()
      .map((_, i) => ({
        id: i,
        firstName: `First${i}`,
        lastName: `Last${i}`,
      }));

    el.currentPage = 0;
    await el.updateComplete;

    let cards = el.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(50);
    expect(
      cards[0].querySelector('.employee-name').textContent.trim()
    ).to.equal('First0 Last0');
    expect(
      cards[49].querySelector('.employee-name').textContent.trim()
    ).to.equal('First49 Last49');

    el.currentPage = 1;
    await el.updateComplete;

    cards = el.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(25);
    expect(
      cards[0].querySelector('.employee-name').textContent.trim()
    ).to.equal('First50 Last50');
    expect(
      cards[24].querySelector('.employee-name').textContent.trim()
    ).to.equal('First74 Last74');
  });

  test('renders employee cards with correct data', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    const sampleDate = '2023-04-15';
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: sampleDate,
      email: 'john@example.com',
      phone: '05321234567',
    };

    el.employees = [employee];
    await el.updateComplete;

    const card = el.shadowRoot.querySelector('.employee-card');

    expect(card.querySelector('.employee-name').textContent.trim()).to.equal(
      'John Doe'
    );

    const details = card.querySelectorAll('.detail-item');

    expect(details[0].querySelector('.detail-label').textContent).to.equal(
      'card.department'
    );
    expect(details[0].querySelector('.detail-value').textContent).to.equal(
      'Tech'
    );

    expect(details[1].querySelector('.detail-label').textContent).to.equal(
      'card.position'
    );
    expect(details[1].querySelector('.detail-value').textContent).to.equal(
      'Senior'
    );

    expect(details[2].querySelector('.detail-label').textContent).to.equal(
      'card.employmentDate'
    );

    expect(details[3].querySelector('.detail-label').textContent).to.equal(
      'card.email'
    );
    expect(details[3].querySelector('.detail-value').textContent).to.equal(
      'john@example.com'
    );

    expect(details[4].querySelector('.detail-label').textContent).to.equal(
      'card.phone'
    );
  });

  test('handles edit button click', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

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
    const el = await fixture(html`<employee-list></employee-list>`);

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

    expect(eventDetail).to.deep.equal({id: 1});
  });

  test('handles page change event from pagination component', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    el.employees = Array(75)
      .fill()
      .map((_, i) => ({id: i}));
    await el.updateComplete;

    const paginationComponent = el.shadowRoot.querySelector(
      'pagination-component'
    );

    paginationComponent.dispatchEvent(
      new CustomEvent('page-changed', {
        detail: {page: 1},
      })
    );

    expect(el.currentPage).to.equal(1);
  });

  test('does not render pagination when no employees', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    el.employees = [];
    await el.updateComplete;

    const pagination = el.shadowRoot.querySelector('pagination-component');
    expect(pagination).to.exist;

    const paginationUI = el.shadowRoot.querySelector(
      'pagination-component .pagination'
    );
    expect(paginationUI).to.be.null;
  });

  test('correctly passes properties to pagination component', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    el.employees = Array(75)
      .fill()
      .map((_, i) => ({id: i}));
    el.currentPage = 1;
    await el.updateComplete;

    const pagination = el.shadowRoot.querySelector('pagination-component');
    expect(pagination.currentPage).to.equal(1);
    expect(pagination.totalPages).to.equal(2);
    expect(pagination.itemsPerPage).to.equal(50);
  });

  test('a11y', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await expect(el).to.be.accessible();
  });
});
