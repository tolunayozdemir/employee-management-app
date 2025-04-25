import { createStore } from 'redux';
import { employeeReducer } from './reducers.js';

const store = createStore(employeeReducer);

export default store;