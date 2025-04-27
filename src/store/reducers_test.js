import {expect} from '@open-wc/testing';
import {employeeReducer, initialState} from './reducers.js';
import {
  DELETE_EMPLOYEE,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  SET_LANGUAGE,
} from './actions.js';

suite('Employee Reducer', () => {
  test('should return the initial state', () => {
    expect(employeeReducer(undefined, {})).to.deep.equal(initialState);
  });

  suite('DELETE_EMPLOYEE', () => {
    test('should handle deleting an employee', () => {
      const currentState = {
        ...initialState,
        employees: [
          {id: 1, firstName: 'John', lastName: 'Doe'},
          {id: 2, firstName: 'Jane', lastName: 'Smith'},
        ],
      };

      const action = {
        type: DELETE_EMPLOYEE,
        payload: {id: 1},
      };

      const expectedState = {
        ...initialState,
        employees: [{id: 2, firstName: 'Jane', lastName: 'Smith'}],
      };

      expect(employeeReducer(currentState, action)).to.deep.equal(
        expectedState
      );
    });

    test('should return the same state if employee id not found', () => {
      const currentState = {
        ...initialState,
        employees: [{id: 1, firstName: 'John', lastName: 'Doe'}],
      };

      const action = {
        type: DELETE_EMPLOYEE,
        payload: {id: 999},
      };

      expect(employeeReducer(currentState, action)).to.deep.equal(currentState);
    });
  });

  suite('ADD_EMPLOYEE', () => {
    test('should handle adding a new employee', () => {
      const currentState = {
        ...initialState,
        employees: [{id: 1, firstName: 'John', lastName: 'Doe'}],
      };

      const newEmployee = {
        firstName: 'Jane',
        lastName: 'Smith',
        position: 'Developer',
      };

      const action = {
        type: ADD_EMPLOYEE,
        payload: newEmployee,
      };

      const result = employeeReducer(currentState, action);

      expect(result.employees).to.have.lengthOf(2);
      expect(result.employees[1].id).to.equal(2);
      expect(result.employees[1].firstName).to.equal('Jane');
      expect(result.employees[1].lastName).to.equal('Smith');
    });

    test('should assign correct ID when adding to empty employees array', () => {
      const action = {
        type: ADD_EMPLOYEE,
        payload: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const result = employeeReducer(initialState, action);

      expect(result.employees).to.have.lengthOf(1);
      expect(result.employees[0].id).to.equal(1);
    });
  });

  suite('UPDATE_EMPLOYEE', () => {
    test('should handle updating an employee', () => {
      const currentState = {
        ...initialState,
        employees: [
          {id: 1, firstName: 'John', lastName: 'Doe', position: 'Developer'},
          {id: 2, firstName: 'Jane', lastName: 'Smith', position: 'Designer'},
        ],
      };

      const updatedEmployee = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        position: 'Senior Developer',
      };

      const action = {
        type: UPDATE_EMPLOYEE,
        payload: updatedEmployee,
      };

      const expectedState = {
        ...initialState,
        employees: [
          updatedEmployee,
          {id: 2, firstName: 'Jane', lastName: 'Smith', position: 'Designer'},
        ],
      };

      expect(employeeReducer(currentState, action)).to.deep.equal(
        expectedState
      );
    });

    test('should not modify state if employee to update is not found', () => {
      const currentState = {
        ...initialState,
        employees: [{id: 1, firstName: 'John', lastName: 'Doe'}],
      };

      const action = {
        type: UPDATE_EMPLOYEE,
        payload: {
          id: 999,
          firstName: 'Not',
          lastName: 'Found',
        },
      };

      expect(employeeReducer(currentState, action).employees).to.have.lengthOf(
        1
      );
      expect(employeeReducer(currentState, action).employees[0]).to.deep.equal(
        currentState.employees[0]
      );
    });
  });

  suite('SET_LANGUAGE', () => {
    test('should handle setting the language', () => {
      const action = {
        type: SET_LANGUAGE,
        payload: 'tr',
      };

      const expectedState = {
        ...initialState,
        language: 'tr',
      };

      expect(employeeReducer(initialState, action)).to.deep.equal(
        expectedState
      );
    });
  });
});
