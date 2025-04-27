import {expect} from '@open-wc/testing';
import {initialState} from './reducers.js';
import {addEmployee, setLanguage} from './actions.js';
import {_initStore} from './store.js';

const mockLocalStorage = (() => {
  let localStorage = {};
  return {
    getItem: (key) => localStorage[key] || null,
    setItem: (key, value) => {
      localStorage[key] = value.toString();
    },
    clear: () => {
      localStorage = {};
    },
    removeItem: (key) => {
      delete localStorage[key];
    },
  };
})();

let store;

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

suite('Redux Store', () => {
  setup(() => {
    window.localStorage.clear();
  });

  suite('Store Creation', () => {
    test('should create a store with initial state', () => {
      store = _initStore();
      expect(store.getState()).to.deep.equal(initialState);
    });
  });

  suite('Persistence Middleware', () => {
    test('should save state to localStorage after dispatch', () => {
      store = _initStore();
      const testEmployee = {
        firstName: 'Test',
        lastName: 'User',
        position: 'Tester',
      };
      store.dispatch(addEmployee(testEmployee));

      const savedState = JSON.parse(localStorage.getItem('appState'));

      expect(savedState).to.not.be.null;
      expect(savedState.employees).to.have.lengthOf(1);
      expect(savedState.employees[0].firstName).to.equal('Test');
    });

    test('should load state from localStorage on initialization', () => {
      const preloadedState = {
        employees: [{id: 1, firstName: 'Preloaded', lastName: 'User'}],
        language: 'tr',
      };
      localStorage.setItem('appState', JSON.stringify(preloadedState));

      store = _initStore();

      const state = store.getState();
      expect(state).to.deep.equal(preloadedState);
      expect(state.employees[0].firstName).to.equal('Preloaded');
      expect(state.language).to.equal('tr');
    });

    test('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;
      const originalConsoleError = console.error;

      console.error = () => {};

      localStorage.getItem = () => {
        throw new Error('localStorage error');
      };

      localStorage.setItem = () => {
        throw new Error('localStorage error');
      };

      store = _initStore();

      expect(store.getState()).to.deep.equal(initialState);

      expect(() => {
        store.dispatch(setLanguage('en'));
      }).to.not.throw();

      localStorage.getItem = originalGetItem;
      localStorage.setItem = originalSetItem;
      console.error = originalConsoleError;
    });
  });
});
