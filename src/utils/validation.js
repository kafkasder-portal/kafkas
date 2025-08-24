/**
 * Validation utility functions
 * Consolidates common validation logic used across multiple components
 */

/**
 * Validates if a field is not empty
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field for error message
 * @returns {object} Validation result with isValid and message properties
 */
export const validateRequired = (value, fieldName) => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (typeof value === 'string' && !value.trim())
  ) {
    return { isValid: false, message: `${fieldName} zorunludur` };
  }
  return { isValid: true, message: null };
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateEmail = email => {
  if (!email) return { isValid: false, message: 'E-posta gereklidir' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Geçerli bir e-posta adresi girin' };
  }
  return { isValid: true, message: null };
};

/**
 * Validates Turkish phone number format
 * @param {string} phone - The phone number to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateTurkishPhone = phone => {
  if (!phone) return { isValid: false, message: 'Telefon numarası gereklidir' };
  // Accept various Turkish phone formats
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'Geçerli bir telefon numarası girin' };
  }
  return { isValid: true, message: null };
};

/**
 * Validates Turkish ID number (TC Kimlik No)
 * @param {string} tcNo - The TC number to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateTCNo = tcNo => {
  if (!tcNo) return { isValid: false, message: 'TC Kimlik No gereklidir' };
  if (tcNo.length !== 11) {
    return { isValid: false, message: 'TC Kimlik No 11 haneli olmalıdır' };
  }
  if (!/^\d{11}$/.test(tcNo)) {
    return { isValid: false, message: 'TC Kimlik No sadece rakam içermelidir' };
  }
  return { isValid: true, message: null };
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validatePassword = password => {
  if (!password) return { isValid: false, message: 'Şifre gereklidir' };
  if (password.length < 8) {
    return { isValid: false, message: 'Şifre en az 8 karakter olmalıdır' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message:
        'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
    };
  }
  return { isValid: true, message: null };
};

/**
 * Validates IBAN format
 * @param {string} iban - The IBAN to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateIban = iban => {
  if (!iban) return { isValid: false, message: 'IBAN gereklidir' };

  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Turkish IBAN should start with TR and be 26 characters
  if (!cleanIban.startsWith('TR')) {
    return { isValid: false, message: 'IBAN TR ile başlamalıdır' };
  }

  if (cleanIban.length !== 26) {
    return { isValid: false, message: 'IBAN 26 karakter olmalıdır' };
  }

  return { isValid: true, message: null };
};

/**
 * Generic form validation function
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - Object containing validation rules for each field
 * @returns {Object} Object containing validation result with isValid and errors properties
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];

    // Check required fields
    if (rules.required) {
      const result = validateRequired(value, rules.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.message;
        return;
      }
    }

    // Check specific validators
    if (rules.validator && value) {
      const result = rules.validator(value);
      if (!result.isValid) {
        errors[fieldName] = result.message;
      }
    }

    // Check email validation
    if (rules.email && value) {
      const result = validateEmail(value);
      if (!result.isValid) {
        errors[fieldName] = result.message;
      }
    }

    // Check phone validation
    if (rules.phone && value) {
      const result = validatePhone(value);
      if (!result.isValid) {
        errors[fieldName] = result.message;
      }
    }

    // Check TC validation
    if (rules.tcNo && value) {
      const result = validateTCKimlik(value);
      if (!result.isValid) {
        errors[fieldName] = result.message;
      }
    }

    // Check IBAN validation
    if (rules.iban && value) {
      const result = validateIBAN(value);
      if (!result.isValid) {
        errors[fieldName] = result.message;
      }
    }

    // Check min length
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[fieldName] = `En az ${rules.minLength} karakter olmalıdır`;
    }

    // Check max length
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[fieldName] = `En fazla ${rules.maxLength} karakter olmalıdır`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Checks if form has any errors
 * @param {Object} errors - The errors object
 * @returns {boolean} True if there are no errors
 */
export const isFormValid = errors => {
  return Object.keys(errors).length === 0;
};

/**
 * Creates a rate limiter for API endpoints
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Rate limiter function
 */
export const createRateLimiter = (
  maxRequests = 100,
  windowMs = 15 * 60 * 1000
) => {
  const requests = new Map();

  return identifier => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    requests.forEach((timestamps, key) => {
      const validTimestamps = timestamps.filter(time => time > windowStart);
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, validTimestamps);
      }
    });

    // Check current requests
    const userRequests = requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => time > windowStart);

    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    requests.set(identifier, validRequests);

    return true; // Request allowed
  };
};

/**
 * Generates a CSRF token
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validates CSRF token
 * @param {string} token - Token to validate
 * @param {string} expectedToken - Expected token
 * @returns {boolean} True if valid
 */
export const validateCSRFToken = (token, expectedToken) => {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
};

/**
 * Sanitizes form data to prevent XSS attacks
 * @param {Object} formData - Form data to sanitize
 * @returns {Object} Sanitized form data
 */
export const sanitizeFormData = formData => {
  if (!formData || typeof formData !== 'object') {
    return {};
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Basic HTML sanitization - remove script tags and dangerous attributes
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .trim();
    } else if (Array.isArray(value)) {
      // Handle arrays
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Export aliases for different naming conventions
export const validatePhone = validateTurkishPhone;
export const validateTCKimlik = validateTCNo;
export const validateIBAN = validateIban;

/**
 * Validates date format (YYYY-MM-DD)
 * @param {string} date - Date to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateDate = date => {
  if (!date) return { isValid: false, message: 'Tarih gereklidir' };
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, message: 'Geçerli bir tarih girin (YYYY-MM-DD)' };
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Geçerli bir tarih girin' };
  }
  return { isValid: true, message: null };
};

/**
 * Validates time format (HH:MM)
 * @param {string} time - Time to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateTime = time => {
  if (!time) return { isValid: false, message: 'Saat gereklidir' };
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return { isValid: false, message: 'Geçerli bir saat girin (HH:MM)' };
  }
  return { isValid: true, message: null };
};

/**
 * Sanitizes a single input value
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = input => {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

/**
 * Validation patterns for common formats
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+90|0)?[5][0-9]{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  TC_KIMLIK: /^\d{11}$/,
  IBAN: /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
};

/**
 * Validates monetary amounts
 * @param {string|number} amount - Amount to validate
 * @returns {object} Validation result with isValid and message properties
 */
export const validateAmount = amount => {
  if (!amount && amount !== 0)
    return { isValid: false, message: 'Tutar gereklidir' };
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount))
    return { isValid: false, message: 'Geçerli bir tutar girin' };
  if (numAmount <= 0)
    return { isValid: false, message: 'Tutar pozitif olmalıdır' };
  if (numAmount > 1000000)
    return { isValid: false, message: 'Tutar çok yüksek' };
  return { isValid: true, message: null };
};
