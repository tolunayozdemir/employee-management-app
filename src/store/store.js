import { createStore, applyMiddleware, compose } from 'redux';
import { employeeReducer, initialState } from './reducers.js';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const persistStateMiddleware = store => next => action => {
  const result = next(action);
  saveState(store.getState());
  return result;
};

const persistedState = loadState();

const store = createStore(
  employeeReducer,
  persistedState || initialState,
  compose(applyMiddleware(persistStateMiddleware))
);

export default store;