import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import '../dialog/confirmation-dialog.js';
import '../../i18n/index.js';

suite('ConfirmationDialog', () => {
  test('default initialization', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    expect(el.isOpen).to.be.false;
    expect(el.message).to.equal('');
    expect(el.shadowRoot.querySelector('.overlay')).to.be.null;
  });

  test('open dialog displays message', async () => {
    const el = await fixture(html`
      <confirmation-dialog
        isOpen
        message="Are you sure you want to proceed?"
      ></confirmation-dialog>
    `);

    const messageElement = el.shadowRoot.querySelector('.dialog-content p');
    expect(messageElement).to.exist;
    expect(messageElement.textContent).to.equal(
      'Are you sure you want to proceed?'
    );
  });

  test('renders title from i18n', async () => {
    const el = await fixture(html`
      <confirmation-dialog isOpen></confirmation-dialog>
    `);

    const titleElement = el.shadowRoot.querySelector('.dialog-title');
    expect(titleElement).to.exist;
  });

  test('close button triggers cancel event', async () => {
    const el = await fixture(html`
      <confirmation-dialog isOpen></confirmation-dialog>
    `);

    const closeButton = el.shadowRoot.querySelector('.close-button');

    setTimeout(() => closeButton.click());
    await oneEvent(el, 'cancel');

    expect(el.isOpen).to.be.false;
  });

  test('cancel button triggers cancel event', async () => {
    const el = await fixture(html`
      <confirmation-dialog isOpen></confirmation-dialog>
    `);

    const cancelButton = el.shadowRoot.querySelector('.cancel-button');

    setTimeout(() => cancelButton.click());
    await oneEvent(el, 'cancel');

    expect(el.isOpen).to.be.false;
  });

  test('proceed button triggers confirm event', async () => {
    const el = await fixture(html`
      <confirmation-dialog isOpen></confirmation-dialog>
    `);

    const proceedButton = el.shadowRoot.querySelector('.proceed-button');

    setTimeout(() => proceedButton.click());
    await oneEvent(el, 'confirm');

    expect(el.isOpen).to.be.false;
  });

  test('button text comes from i18n', async () => {
    const el = await fixture(html`
      <confirmation-dialog isOpen></confirmation-dialog>
    `);

    const proceedButton = el.shadowRoot.querySelector('.proceed-button');
    const cancelButton = el.shadowRoot.querySelector('.cancel-button');

    expect(proceedButton).to.exist;
    expect(cancelButton).to.exist;
  });

  test('a11y', async () => {
    const el = await fixture(html`
      <confirmation-dialog
        isOpen
        message="Are you sure you want to proceed?"
      ></confirmation-dialog>
    `);

    await expect(el).to.be.accessible();
  });
});
