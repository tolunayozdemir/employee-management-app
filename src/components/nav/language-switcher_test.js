import {html, fixture, expect} from '@open-wc/testing';
import '../nav/language-switcher.js';
import '../../i18n/index.js';
import {I18n} from '../../i18n/index.js';

suite('LanguageSwitcher', () => {
  test('default initialization', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);

    expect(el.currentLanguage).to.equal(I18n.getLanguage());
  });

  test('renders language buttons', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);

    const buttons = el.shadowRoot.querySelectorAll('.language-button');
    expect(buttons.length).to.equal(2);
  });

  test('renders EN language button', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);

    const enButton = Array.from(
      el.shadowRoot.querySelectorAll('.language-button')
    ).find((button) => button.textContent.trim() === 'EN');
    expect(enButton).to.exist;
  });

  test('renders TR language button', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);

    const trButton = Array.from(
      el.shadowRoot.querySelectorAll('.language-button')
    ).find((button) => button.textContent.trim() === 'TR');
    expect(trButton).to.exist;
  });

  test('marks current language button as active', async () => {
    const originalGetLanguage = I18n.getLanguage;
    I18n.getLanguage = () => 'en';

    const el = await fixture(html`<language-switcher></language-switcher>`);

    const enButton = Array.from(
      el.shadowRoot.querySelectorAll('.language-button')
    ).find((button) => button.textContent.trim() === 'EN');
    const trButton = Array.from(
      el.shadowRoot.querySelectorAll('.language-button')
    ).find((button) => button.textContent.trim() === 'TR');

    expect(enButton.classList.contains('active')).to.be.true;
    expect(trButton.classList.contains('active')).to.be.false;

    I18n.getLanguage = originalGetLanguage;
  });

  test('language button click calls _switchLanguage', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);

    const originalSwitchLanguage = el._switchLanguage;
    let languageSwitched = null;

    el._switchLanguage = (language) => {
      languageSwitched = language;
    };

    const trButton = Array.from(
      el.shadowRoot.querySelectorAll('.language-button')
    ).find((button) => button.textContent.trim() === 'TR');

    trButton.click();
    expect(languageSwitched).to.equal('tr');

    el._switchLanguage = originalSwitchLanguage;
  });

  test('a11y', async () => {
    const el = await fixture(html`<language-switcher></language-switcher>`);

    await expect(el).to.be.accessible();
  });
});
