import {html, fixture, expect} from '@open-wc/testing';
import '../nav/navigation-container.js';
import '../../i18n/index.js';
import {Router} from '@vaadin/router';

suite('NavigationContainer', () => {
  test('default initialization', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    expect(el.currentPath).to.equal(window.location.pathname);
  });

  test('renders logo', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const logo = el.shadowRoot.querySelector('.logo');
    expect(logo).to.exist;
    expect(logo.textContent).to.equal('ING');
  });

  test('renders navigation links', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const links = el.shadowRoot.querySelectorAll('a');
    expect(links.length).to.equal(2);
  });

  test('includes employee list link', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const employeeListLink = el.shadowRoot.querySelector('a[href="/"]');
    expect(employeeListLink).to.exist;
  });

  test('includes add employee link', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const addEmployeeLink = el.shadowRoot.querySelector(
      'a[href="/add-employee"]'
    );
    expect(addEmployeeLink).to.exist;
  });

  test('correctly marks active link based on current path', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    el.currentPath = '/';
    await el.updateComplete;

    let homeLink = el.shadowRoot.querySelector('a[href="/"]');
    let addEmployeeLink = el.shadowRoot.querySelector(
      'a[href="/add-employee"]'
    );

    expect(homeLink.classList.contains('active')).to.be.true;
    expect(addEmployeeLink.classList.contains('active')).to.be.false;

    el.currentPath = '/add-employee';
    await el.updateComplete;

    homeLink = el.shadowRoot.querySelector('a[href="/"]');
    addEmployeeLink = el.shadowRoot.querySelector('a[href="/add-employee"]');

    expect(homeLink.classList.contains('active')).to.be.false;
    expect(addEmployeeLink.classList.contains('active')).to.be.true;
  });

  test('includes language switcher', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const languageSwitcher = el.shadowRoot.querySelector('language-switcher');
    expect(languageSwitcher).to.exist;
  });

  test('a11y', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    await expect(el).to.be.accessible();
  });

  test('handles location change event', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const event = new CustomEvent('vaadin-router-location-changed', {
      detail: {
        location: {
          pathname: '/add-employee',
        },
      },
    });
    window.dispatchEvent(event);

    expect(el.currentPath).to.equal('/add-employee');
  });

  test('navigates to home page when logo is clicked', async () => {
    const el = await fixture(
      html`<navigation-container></navigation-container>`
    );

    const eventSpy = {
      called: false,
      path: null,
    };

    window.addEventListener(
      'vaadin-router-location-changed',
      (event) => {
        eventSpy.called = true;
        eventSpy.path = event.detail.location.pathname;
      },
      {once: true}
    );

    const originalRouterGo = Router.go;
    Router.go = (path) => {
      window.dispatchEvent(
        new CustomEvent('vaadin-router-location-changed', {
          detail: {
            location: {
              pathname: path,
            },
          },
        })
      );
    };

    const logo = el.shadowRoot.querySelector('.logo');
    logo.click();

    expect(eventSpy.called).to.be.true;
    expect(eventSpy.path).to.equal('/');

    Router.go = originalRouterGo;
  });
});
