// Action Types
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';

export const deleteEmployee = (employeeId) => ({
  type: DELETE_EMPLOYEE,
  payload: { id: employeeId }
});

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee
});