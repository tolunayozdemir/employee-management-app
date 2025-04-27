import { html, fixture, expect } from '@open-wc/testing';
import './pagination-component.js';

suite('PaginationComponent', () => {
  test('default initialization', async () => {
    const el = await fixture(html`<pagination-component></pagination-component>`);
    
    expect(el.currentPage).to.equal(0);
    expect(el.totalPages).to.equal(0);
    expect(el.render()).to.equal('');
  });

  test('renders pagination UI when total pages is greater than 1', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${0}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    const pagination = el.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
    
    const buttons = el.shadowRoot.querySelectorAll('.pagination button');
    expect(buttons.length).to.be.at.least(3);
  });

  test('prev button is disabled on first page', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${0}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    const buttons = el.shadowRoot.querySelectorAll('.pagination button');
    const prevButton = buttons[0];
    
    expect(prevButton.hasAttribute('disabled')).to.be.true;
  });

  test('next button is disabled on last page', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${4}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    const buttons = el.shadowRoot.querySelectorAll('.pagination button');
    const nextButton = buttons[buttons.length - 1];
    
    expect(nextButton.hasAttribute('disabled')).to.be.true;
  });

  test('current page button has active class', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${2}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    const activeButtons = el.shadowRoot.querySelectorAll('.pagination button.active');
    expect(activeButtons.length).to.equal(1);
    expect(activeButtons[0].textContent.trim()).to.equal('3');
  });

  test('page numbers are rendered with ellipsis for many pages', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${5}
        .totalPages=${10}
      ></pagination-component>
    `);
    
    const paginationItems = el.shadowRoot.querySelectorAll('.pagination button, .pagination .page-info');
    
   
    const hasEllipsis = Array.from(paginationItems).some(item => 
      item.textContent.includes('...'));
    expect(hasEllipsis).to.be.true;
  });

  test('clicking page button fires page-changed event', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${0}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    let eventDetail = null;
    el.addEventListener('page-changed', (e) => {
      eventDetail = e.detail;
    });
    
   
    const pageButtons = Array.from(el.shadowRoot.querySelectorAll('.pagination button'))
      .filter(button => !button.hasAttribute('disabled'));
    
   
    pageButtons[1].click();
    
    expect(eventDetail).to.not.be.null;
    expect(eventDetail.page).to.equal(1);
  });

  test('clicking prev button fires page-changed event with previous page', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${2}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    let eventDetail = null;
    el.addEventListener('page-changed', (e) => {
      eventDetail = e.detail;
    });
    
    const prevButton = el.shadowRoot.querySelector('.pagination button');
    prevButton.click();
    
    expect(eventDetail).to.not.be.null;
    expect(eventDetail.page).to.equal(1);
  });

  test('clicking next button fires page-changed event with next page', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${2}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    let eventDetail = null;
    el.addEventListener('page-changed', (e) => {
      eventDetail = e.detail;
    });
    
    const buttons = el.shadowRoot.querySelectorAll('.pagination button');
    const nextButton = buttons[buttons.length - 1];
    nextButton.click();
    
    expect(eventDetail).to.not.be.null;
    expect(eventDetail.page).to.equal(3);
  });

  test('displays first, last, and nearby pages with ellipsis for large page counts', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${50}
        .totalPages=${100}
      ></pagination-component>
    `);
    
    const pageItems = el.shadowRoot.querySelectorAll('.pagination button, .pagination .page-info');
    const itemTexts = Array.from(pageItems).map(item => item.textContent.trim());
    
   
    expect(itemTexts).to.include('1');
    expect(itemTexts).to.include('49');
    expect(itemTexts).to.include('...');
    expect(itemTexts).to.include('51');
    expect(itemTexts).to.include('100');
  });

  test('a11y', async () => {
    const el = await fixture(html`
      <pagination-component
        .currentPage=${2}
        .totalPages=${5}
      ></pagination-component>
    `);
    
    await expect(el).to.be.accessible();
  });
});