import {I18n} from './index.js';
import {expect} from '@open-wc/testing';
import store from '../store/store.js';
import {translations} from '../utils/translations/index.js';

suite('I18n', () => {
  let originalGetState;
  let originalDispatch;
  let originalDocumentElement;
  let dispatchedActions;
  let mockDocumentElement;
  let mockState;

  setup(() => {
    originalGetState = store.getState;
    originalDispatch = store.dispatch;
    mockState = {language: 'en'};
    dispatchedActions = [];

    store.getState = () => mockState;
    store.dispatch = (action) => {
      dispatchedActions.push(action);
    };

    originalDocumentElement = document.documentElement;
    mockDocumentElement = {
      attributes: {},
      setAttribute: function (name, value) {
        this.attributes[name] = value;
      },
    };

    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true,
    });
  });

  teardown(() => {
    store.getState = originalGetState;
    store.dispatch = originalDispatch;

    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true,
    });
  });

  test('t() returns translation for a given key', () => {
    translations.en['test.key'] = 'Test Value';
    const result = I18n.t('test.key');
    expect(result).to.equal('Test Value');
  });

  test('t() returns key if translation not found', () => {
    const key = 'nonexistent.key';
    const result = I18n.t(key);
    expect(result).to.equal(key);
  });

  test('t() replaces parameters in translation text', () => {
    translations.en.greeting = 'Hello, {{name}}!';

    const result = I18n.t('greeting', {name: 'John'});
    expect(result).to.equal('Hello, John!');
  });

  test('t() handles multiple parameters', () => {
    translations.en.welcome = '{{greeting}}, {{name}}! Welcome to {{place}}.';

    const result = I18n.t('welcome', {
      greeting: 'Hi',
      name: 'Jane',
      place: 'Our App',
    });

    expect(result).to.equal('Hi, Jane! Welcome to Our App.');
  });

  test('changeLanguage() sets language attribute on document', () => {
    I18n.changeLanguage('tr');

    expect(mockDocumentElement.attributes.lang).to.equal('tr');
  });

  test('changeLanguage() dispatches action to store', () => {
    I18n.changeLanguage('tr');

    expect(dispatchedActions.length).to.equal(1);
    expect(dispatchedActions[0].type).to.equal('SET_LANGUAGE');
    expect(dispatchedActions[0].payload).to.equal('tr');
  });

  test('changeLanguage() does nothing if language not supported', () => {
    const invalidLang = 'invalid';

    I18n.changeLanguage(invalidLang);

    expect(mockDocumentElement.attributes.lang).to.be.undefined;
    expect(dispatchedActions.length).to.equal(0);
  });

  test('initLanguage() sets language from store on document', () => {
    I18n.initLanguage();

    expect(mockDocumentElement.attributes.lang).to.equal('en');
  });

  test('getLanguage() returns language from store', () => {
    const language = I18n.getLanguage();

    expect(language).to.equal('en');
  });
});
