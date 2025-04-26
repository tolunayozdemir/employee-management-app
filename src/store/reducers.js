import {
  DELETE_EMPLOYEE,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  SET_LANGUAGE,
} from './actions.js';

export const initialState = {
  employees: [],
  language: 'en',
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
      const updatedEmployees = state.employees.map((employee) =>
        employee.id === action.payload.id ? action.payload : employee
      );

      return {
        ...state,
        employees: updatedEmployees,
      };
    }
    case SET_LANGUAGE: {
      return {
        ...state,
        language: action.payload,
      };
    }
    default:
      return state;
  }
};
