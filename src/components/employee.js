export const employees = Array.from({length: 100}, (_, index) => ({
  id: index + 1,
  firstName: `John${index + 1}`,
  lastName: `Doe${index + 1}`,
  dateOfEmployment: `${2023 - Math.floor(index / 12)}-${String(
    Math.floor(index % 12) + 1
  ).padStart(2, '0')}-${String(Math.floor((index % 28) + 1)).padStart(2, '0')}`,
  dateOfBirth: `${1990 - Math.floor(index / 10)}-${String(
    Math.floor(index % 12) + 1
  ).padStart(2, '0')}-${String(Math.floor((index % 28) + 1)).padStart(2, '0')}`,
  phone: `+9055${String(2200000 + index).padStart(8, '0')}`,
  email: `employee${index + 1}@company.com`,
}));
