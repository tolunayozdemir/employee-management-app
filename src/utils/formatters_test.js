import {expect} from '@open-wc/testing';
import {formatPhoneNumber, formatDate} from './formatters.js';

suite('Formatters', () => {
  suite('formatPhoneNumber', () => {
    test('formats valid phone numbers correctly', () => {
      expect(formatPhoneNumber('05521234567')).to.equal('+(90) 552 123 45 67');
      expect(formatPhoneNumber('05321234567')).to.equal('+(90) 532 123 45 67');
      expect(formatPhoneNumber('05421234567')).to.equal('+(90) 542 123 45 67');
    });

    test('returns original value for invalid phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).to.equal('1234567890');
      expect(formatPhoneNumber('0552123456')).to.equal('0552123456');
      expect(formatPhoneNumber('055212345678')).to.equal('055212345678');
      expect(formatPhoneNumber('15521234567')).to.equal('15521234567');
      expect(formatPhoneNumber('')).to.equal('');
      expect(formatPhoneNumber(null)).to.equal(null);
      expect(formatPhoneNumber(undefined)).to.equal(undefined);
    });
  });

  suite('formatDate', () => {
    test('formats date objects correctly', () => {
      expect(formatDate(new Date(2023, 0, 1))).to.equal('01/01/2023');
      expect(formatDate(new Date(2023, 11, 31))).to.equal('31/12/2023');
      expect(formatDate(new Date(2023, 3, 15))).to.equal('15/04/2023');
    });

    test('formats ISO date strings correctly', () => {
      expect(formatDate('2023-01-01')).to.equal('01/01/2023');
      expect(formatDate('2023-12-31')).to.equal('31/12/2023');
      expect(formatDate('2023-04-15')).to.equal('15/04/2023');
    });

    test('handles edge cases properly', () => {
      expect(formatDate('')).to.equal('');
      expect(formatDate(null)).to.equal('');
      expect(formatDate(undefined)).to.equal('');
      expect(formatDate('invalid-date')).to.equal('');
    });
  });
});
