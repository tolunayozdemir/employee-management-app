import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../dialog/modal-dialog.js';

suite('ModalDialog', () => {
  test('default initialization', async () => {
    const el = await fixture(html`<modal-dialog></modal-dialog>`);
    
    expect(el.isOpen).to.be.false;
    expect(el.title).to.equal('');
  });

  test('title is displayed', async () => {
    const el = await fixture(html`<modal-dialog title="Test Modal"></modal-dialog>`);
    
    const titleElement = el.shadowRoot.querySelector('.modal-title');
    expect(titleElement.textContent).to.equal('Test Modal');
  });

  test('modal open state', async () => {
    const el = await fixture(html`<modal-dialog></modal-dialog>`);
    
    el.open();
    await el.updateComplete;
    
    const backdrop = el.shadowRoot.querySelector('.modal-backdrop');
    expect(backdrop.classList.contains('open')).to.be.true;
  });

  test('modal close method', async () => {
    const el = await fixture(html`<modal-dialog isOpen></modal-dialog>`);
    
    setTimeout(() => el.close());
    await oneEvent(el, 'modal-closed');
    
    expect(el.isOpen).to.be.false;
  });

  test('backdrop click closes modal', async () => {
    const el = await fixture(html`<modal-dialog isOpen></modal-dialog>`);
    
    const backdrop = el.shadowRoot.querySelector('.modal-backdrop');
    
    setTimeout(() => {
      backdrop.click();
    });
    
    await oneEvent(el, 'modal-closed');
    expect(el.isOpen).to.be.false;
  });

  test('clicking modal content does not close modal', async () => {
    const el = await fixture(html`<modal-dialog isOpen></modal-dialog>`);
    
    const container = el.shadowRoot.querySelector('.modal-container');
    container.click();
    await el.updateComplete;
    
    expect(el.isOpen).to.be.true;
  });

  test('close button closes modal', async () => {
    const el = await fixture(html`<modal-dialog isOpen></modal-dialog>`);
    
    const closeButton = el.shadowRoot.querySelector('.close-button');
    
    setTimeout(() => {
      closeButton.click();
    });
    
    await oneEvent(el, 'modal-closed');
    expect(el.isOpen).to.be.false;
  });
  
  test('slot content is rendered', async () => {
    const el = await fixture(html`
      <modal-dialog>
        <div id="test-content">Test Content</div>
      </modal-dialog>
    `);
    
    const slotElement = el.querySelector('#test-content');
    expect(slotElement).to.exist;
    expect(slotElement.textContent).to.equal('Test Content');
  });

  test('a11y', async () => {
    const el = await fixture(html`
      <modal-dialog title="Accessible Modal">
        <div>Modal content</div>
      </modal-dialog>
    `);
    
    await expect(el).to.be.accessible();
  });
});