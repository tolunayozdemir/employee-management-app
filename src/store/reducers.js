import { DELETE_EMPLOYEE } from './actions.js';
import { employees as initialEmployees } from '../components/employee.js';

const initialState = {
  employees: initialEmployees
};

export const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_EMPLOYEE: {
      const index = state.employees.findIndex(employee => employee.id === action.payload.id);
      
      if (index === -1) {
        return state;
      }
      
      const updatedEmployees = [...state.employees];
      updatedEmployees.splice(index, 1);
      
      return {
        ...state,
        employees: updatedEmployees
      };
    }
    default:
      return state;
  }
};