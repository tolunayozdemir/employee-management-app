import {html, fixture, expect, aTimeout} from '@open-wc/testing';
import '../search-bar/index.js';
import {I18n} from '../../i18n/index.js';

suite('SearchBar', () => {
  let originalI18nT;

  setup(() => {
    originalI18nT = I18n.t;
    I18n.t = (key) => {
      if (key === 'search.placeholder') {
        return 'Search employees...';
      }
      return key;
    };
  });

  teardown(() => {
    I18n.t = originalI18nT;
  });

  test('default initialization', async () => {
    const el = await fixture(html`<search-bar></search-bar>`);

    expect(el.placeholder).to.equal('Search employees...');
    expect(el.debounceTime).to.equal(300);
    expect(el.value).to.equal('');
  });

  test('property reflection', async () => {
    const el = await fixture(html`
      <search-bar
        placeholder="Custom placeholder"
        .debounceTime=${500}
        .value=${'initial search'}
      ></search-bar>
    `);

    expect(el.placeholder).to.equal('Custom placeholder');
    expect(el.debounceTime).to.equal(500);
    expect(el.value).to.equal('initial search');

    const formInput = el.shadowRoot.querySelector('form-input');
    expect(formInput.placeholder).to.equal('Custom placeholder');
    expect(formInput.value).to.equal('initial search');
  });

  test('handles input-change event from form-input', async () => {
    const el = await fixture(html`<search-bar></search-bar>`);
    const formInput = el.shadowRoot.querySelector('form-input');

    let eventFired = false;
    let eventDetail = null;

    el.addEventListener('search-change', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    formInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {value: 'test search'},
        bubbles: true,
        composed: true,
      })
    );

    await aTimeout(350);

    expect(eventFired).to.be.true;
    expect(eventDetail).to.deep.equal({value: 'test search'});
    expect(el.value).to.equal('test search');
  });

  test('debounce functionality', async () => {
    const el = await fixture(
      html`<search-bar .debounceTime=${200}></search-bar>`
    );
    const formInput = el.shadowRoot.querySelector('form-input');

    let eventCount = 0;

    el.addEventListener('search-change', () => {
      eventCount++;
    });

    formInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {value: 'first'},
        bubbles: true,
        composed: true,
      })
    );

    await aTimeout(50);

    formInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {value: 'second'},
        bubbles: true,
        composed: true,
      })
    );

    await aTimeout(50);

    formInput.dispatchEvent(
      new CustomEvent('input-change', {
        detail: {value: 'third'},
        bubbles: true,
        composed: true,
      })
    );

    await aTimeout(250);

    expect(eventCount).to.equal(1);
    expect(el.value).to.equal('third');
  });

  test('renders form-input with correct properties', async () => {
    const el = await fixture(
      html`<search-bar .value=${'test value'}></search-bar>`
    );

    const formInput = el.shadowRoot.querySelector('form-input');
    expect(formInput).to.exist;
    expect(formInput.name).to.equal('search');
    expect(formInput.placeholder).to.equal('Search employees...');
    expect(formInput.value).to.equal('test value');
  });

  test('a11y', async () => {
    const el = await fixture(html`<search-bar></search-bar>`);
    await expect(el).to.be.accessible();
  });
});
