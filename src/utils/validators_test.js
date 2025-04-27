import { expect } from '@open-wc/testing';
import * as validators from './validators.js';
import { I18n } from '../i18n/index.js';

// Mock I18n.t function
I18n.t = (key) => key;

suite('Validators', () => {
  suite('validateRequired', () => {
    test('returns false for empty values', () => {
      expect(validators.validateRequired('')).to.be.false;
      expect(validators.validateRequired('  ')).to.be.false;
      expect(validators.validateRequired(null)).to.be.false;
      expect(validators.validateRequired(undefined)).to.be.false;
    });

    test('returns true for valid values', () => {
      expect(validators.validateRequired('John')).to.be.true;
      expect(validators.validateRequired('123')).to.be.true;
      expect(validators.validateRequired(123)).to.be.true;
      expect(validators.validateRequired(true)).to.be.true;
    });
  });

  suite('validateNotFutureDate', () => {
    test('returns false for future dates', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      expect(validators.validateNotFutureDate(tomorrow.toISOString())).to.be.false;
    });

    test('returns true for current or past dates', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      expect(validators.validateNotFutureDate(today.toISOString())).to.be.true;
      expect(validators.validateNotFutureDate(yesterday.toISOString())).to.be.true;
      expect(validators.validateNotFutureDate('')).to.be.true;
    });
  });

  suite('validateDateOfBirth', () => {
    test('returns false for future dates', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      expect(validators.validateDateOfBirth(tomorrow.toISOString())).to.be.false;
    });

    test('returns false for too young ages', () => {
      const today = new Date();
      const tooYoung = new Date(today);
      tooYoung.setFullYear(today.getFullYear() - 17);
      
      expect(validators.validateDateOfBirth(tooYoung.toISOString())).to.be.false;
    });

    test('returns false for too old ages', () => {
      const today = new Date();
      const tooOld = new Date(today);
      tooOld.setFullYear(today.getFullYear() - 101);
      
      expect(validators.validateDateOfBirth(tooOld.toISOString())).to.be.false;
    });

    test('correctly calculates age when birthday has not occurred yet this year', () => {
      const today = new Date();
      const birthDate = new Date(today);
      birthDate.setDate(today.getDate() + 1);
      birthDate.setFullYear(today.getFullYear() - 18);
      
      expect(validators.validateDateOfBirth(birthDate.toISOString())).to.be.false;
    });

    test('returns true for valid birth dates', () => {
      const today = new Date();
      const valid = new Date(today);
      valid.setFullYear(today.getFullYear() - 30);
      
      expect(validators.validateDateOfBirth(valid.toISOString())).to.be.true;
      expect(validators.validateDateOfBirth('')).to.be.true;
    });
  });

  suite('validatePhone', () => {
    test('returns false for invalid phone numbers', () => {
      expect(validators.validatePhone('123')).to.be.false;
      expect(validators.validatePhone('abc1234567')).to.be.false;
      expect(validators.validatePhone('123456789')).to.be.false;
      expect(validators.validatePhone('123456789012345678')).to.be.false;
    });

    test('returns true for valid phone numbers or empty', () => {
      expect(validators.validatePhone('1234567890')).to.be.true;
      expect(validators.validatePhone('+1234567890')).to.be.true;
      expect(validators.validatePhone('123456789012')).to.be.true;
      expect(validators.validatePhone('')).to.be.true;
    });
  });

  suite('validateEmail', () => {
    test('returns false for invalid email addresses', () => {
      expect(validators.validateEmail('invalid')).to.be.false;
      expect(validators.validateEmail('invalid@')).to.be.false;
      expect(validators.validateEmail('invalid@domain')).to.be.false;
      expect(validators.validateEmail('@domain.com')).to.be.false;
    });

    test('returns true for valid email addresses or empty', () => {
      expect(validators.validateEmail('test@example.com')).to.be.true;
      expect(validators.validateEmail('user.name@domain.com')).to.be.true;
      expect(validators.validateEmail('user+tag@example.co.uk')).to.be.true;
      expect(validators.validateEmail('')).to.be.true;
    });
  });

  suite('validateEmailUnique', () => {
    test('returns false for duplicate emails', () => {
      const existingEmails = ['john@example.com', 'jane@example.com'];
      
      expect(validators.validateEmailUnique('john@example.com', existingEmails)).to.be.false;
      expect(validators.validateEmailUnique('jane@example.com', existingEmails)).to.be.false;
    });

    test('returns true for unique emails or empty', () => {
      const existingEmails = ['john@example.com', 'jane@example.com'];
      
      expect(validators.validateEmailUnique('new@example.com', existingEmails)).to.be.true;
      expect(validators.validateEmailUnique('', existingEmails)).to.be.true;
    });
  });
});