export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const SET_LANGUAGE = 'SET_LANGUAGE';

export const deleteEmployee = (employeeId) => ({
  type: DELETE_EMPLOYEE,
  payload: { id: employeeId }
});

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee
});

export const updateEmployee = (employee) => ({
  type: UPDATE_EMPLOYEE,
  payload: employee
});

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language
});