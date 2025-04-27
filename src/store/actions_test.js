import { expect } from '@open-wc/testing';
import { 
  DELETE_EMPLOYEE, deleteEmployee,
  ADD_EMPLOYEE, addEmployee,
  UPDATE_EMPLOYEE, updateEmployee,
  SET_LANGUAGE, setLanguage
} from './actions.js';

suite('Action Creators', () => {
  suite('deleteEmployee', () => {
    test('should create an action to delete an employee', () => {
      const employeeId = 123;
      const expectedAction = {
        type: DELETE_EMPLOYEE,
        payload: { id: employeeId }
      };
      expect(deleteEmployee(employeeId)).to.deep.equal(expectedAction);
    });
  });

  suite('addEmployee', () => {
    test('should create an action to add an employee', () => {
      const employee = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer'
      };
      const expectedAction = {
        type: ADD_EMPLOYEE,
        payload: employee
      };
      expect(addEmployee(employee)).to.deep.equal(expectedAction);
    });
  });

  suite('updateEmployee', () => {
    test('should create an action to update an employee', () => {
      const employee = {
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        position: 'Senior Developer'
      };
      const expectedAction = {
        type: UPDATE_EMPLOYEE,
        payload: employee
      };
      expect(updateEmployee(employee)).to.deep.equal(expectedAction);
    });
  });

  suite('setLanguage', () => {
    test('should create an action to set the language', () => {
      const language = 'tr';
      const expectedAction = {
        type: SET_LANGUAGE,
        payload: language
      };
      expect(setLanguage(language)).to.deep.equal(expectedAction);
    });
  });
});