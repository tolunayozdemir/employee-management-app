export const formatPhoneNumber = (phone) => {
  if (!phone) return phone;

  if (phone.length === 11 && phone.startsWith('05')) {
    const areaCode = phone.substring(1, 4);
    const firstPart = phone.substring(4, 7);
    const secondPart = phone.substring(7, 9);
    const thirdPart = phone.substring(9, 11);
    return `+(90) ${areaCode} ${firstPart} ${secondPart} ${thirdPart}`;
  }

  return phone;
};

export const formatDate = (date) => {
  if (!date) return '';

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return '';
  }
};
