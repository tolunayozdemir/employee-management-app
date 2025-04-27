const REGEX = {
  PHONE: /^(05)([0-9]{2})([0-9]{3})([0-9]{2})([0-9]{2})$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const AGE = {
  MIN: 18,
  MAX: 100,
};

export const validateRequired = (value) => {
  return !(!value || (typeof value === 'string' && !value.trim()));
};

export const validateNotFutureDate = (dateStr) => {
  if (!dateStr) return true;

  const date = new Date(dateStr);
  const today = new Date();

  return date <= today;
};

export const validateDateOfBirth = (dateStr) => {
  if (!dateStr) return true;

  const birthDate = new Date(dateStr);
  const today = new Date();

  if (birthDate > today) {
    return false;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= AGE.MIN && age <= AGE.MAX;
};

export const validatePhone = (phone) => {
  return !phone || REGEX.PHONE.test(phone);
};

export const validateEmail = (email) => {
  return !email || REGEX.EMAIL.test(email);
};

export const validateEmailUnique = (email, existingEmails) => {
  if (!email) return true;

  return !existingEmails.includes(email);
};
