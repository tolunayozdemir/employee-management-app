import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import '../not-found/employee-not-found.js';
import {I18n} from '../../i18n/index.js';
import {Router} from '@vaadin/router';

suite('EmployeeNotFound', () => {
  let originalI18nT;
  let originalRouterGo;

  setup(() => {
    originalI18nT = I18n.t;
    I18n.t = (key) => key;

    originalRouterGo = Router.go;
    Router.go = () => {};
  });

  teardown(() => {
    I18n.t = originalI18nT;
    Router.go = originalRouterGo;
  });

  test('component renders correctly', async () => {
    const el = await fixture(html`<employee-not-found></employee-not-found>`);

    const container = el.shadowRoot.querySelector('.not-found-container');
    expect(container).to.exist;

    const icon = el.shadowRoot.querySelector('.icon');
    expect(icon).to.exist;

    const title = el.shadowRoot.querySelector('h3');
    expect(title).to.exist;
    expect(title.textContent).to.equal('empty.title');

    const message = el.shadowRoot.querySelector('p');
    expect(message).to.exist;
    expect(message.textContent).to.equal('empty.message');

    const button = el.shadowRoot.querySelector('button');
    expect(button).to.exist;
    expect(button.textContent).to.equal('button.add');
  });

  test('add employee button click navigates to add employee page', async () => {
    const el = await fixture(html`<employee-not-found></employee-not-found>`);

    let navigatedTo = null;
    Router.go = (path) => {
      navigatedTo = path;
    };

    const button = el.shadowRoot.querySelector('button');
    button.click();

    expect(navigatedTo).to.equal('/add-employee');
  });

  test('custom event on button click', async () => {
    const el = await fixture(html`<employee-not-found></employee-not-found>`);

    let eventFired = false;
    el.addEventListener('add-employee-requested', () => {
      eventFired = true;
    });

    const button = el.shadowRoot.querySelector('button');
    setTimeout(() => button.click());

    await oneEvent(window, 'click');
    expect(eventFired).to.be.false;
  });

  test('styles are applied correctly', async () => {
    const el = await fixture(html`<employee-not-found></employee-not-found>`);

    const container = el.shadowRoot.querySelector('.not-found-container');

    expect(container.classList.contains('not-found-container')).to.be.true;
    expect(el.shadowRoot.querySelector('.icon')).to.exist;
    expect(el.shadowRoot.querySelector('h3')).to.exist;
    expect(el.shadowRoot.querySelector('p')).to.exist;
    expect(el.shadowRoot.querySelector('button')).to.exist;
  });

  test('a11y', async () => {
    const el = await fixture(html`<employee-not-found></employee-not-found>`);
    await expect(el).to.be.accessible();
  });
});
