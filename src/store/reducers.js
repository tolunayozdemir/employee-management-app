import {DELETE_EMPLOYEE, ADD_EMPLOYEE, UPDATE_EMPLOYEE} from './actions.js';

export const initialEmployees = Array.from({length: 1000}, (_, index) => ({
  id: index + 1,
  firstName: `John${index + 1}`,
  lastName: `Doe${index + 1}`,
  department: `John${index + 1}`,
  position: `Doe${index + 1}`,
  dateOfEmployment: `${2023 - Math.floor(index / 12)}-${String(
    Math.floor(index % 12) + 1
  ).padStart(2, '0')}-${String(Math.floor((index % 28) + 1)).padStart(2, '0')}`,
  dateOfBirth: `${1990 - Math.floor(index / 10)}-${String(
    Math.floor(index % 12) + 1
  ).padStart(2, '0')}-${String(Math.floor((index % 28) + 1)).padStart(2, '0')}`,
  phone: `+9055${String(2200000 + index).padStart(8, '0')}`,
  email: `employee${index + 1}@company.com`,
}));

const initialState = {
  employees: initialEmployees,
};

export const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_EMPLOYEE: {
      const index = state.employees.findIndex(
        (employee) => employee.id === action.payload.id
      );

      if (index === -1) {
        return state;
      }

      const updatedEmployees = [...state.employees];
      updatedEmployees.splice(index, 1);

      return {
        ...state,
        employees: updatedEmployees,
      };
    }
    case ADD_EMPLOYEE: {
      const maxId = state.employees.reduce(
        (max, employee) => (employee.id > max ? employee.id : max),
        0
      );

      const newEmployee = {
        ...action.payload,
        id: maxId + 1,
      };

      return {
        ...state,
        employees: [...state.employees, newEmployee],
      };
    }
    case UPDATE_EMPLOYEE: {
      const updatedEmployees = state.employees.map(employee => 
        employee.id === action.payload.id ? action.payload : employee
      );
      
      return {
        ...state,
        employees: updatedEmployees,
      };
    }
    default:
      return state;
  }
};
