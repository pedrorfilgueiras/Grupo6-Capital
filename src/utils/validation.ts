
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // Check if it has 14 digits
  if (cnpj.length !== 14) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validate digit
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  return result === parseInt(digits.charAt(1));
};

export const formatCNPJ = (cnpj: string): string => {
  // Remove all non-numeric characters
  const digitsOnly = cnpj.replace(/\D/g, '');
  
  // Apply CNPJ mask: xx.xxx.xxx/xxxx-xx
  return digitsOnly
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18); // Limit to max CNPJ length
};

export const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Convert to number and format
  const num = parseInt(digitsOnly, 10) / 100;
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatPercentage = (value: string): string => {
  // Remove all non-numeric characters
  let digitsOnly = value.replace(/\D/g, '');
  
  // Convert to number with decimals
  const num = parseInt(digitsOnly, 10) / 100;
  
  // Format to percentage with up to 2 decimal places
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Functions to parse formatted values back to numbers
export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
};

export const parsePercentage = (value: string): number => {
  return parseFloat(value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
};
