import { describe, expect, it } from 'vitest';
import {
  VALIDATION_PATTERNS,
  createRateLimiter,
  generateCSRFToken,
  sanitizeFormData,
  sanitizeInput,
  validateAmount,
  validateCSRFToken,
  validateDate,
  validateEmail,
  validateForm,
  validateIBAN,
  validatePassword,
  validatePhone,
  validateRequired,
  validateTCKimlik,
  validateTime,
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('VALIDATION_PATTERNS', () => {
    it('should have all required patterns', () => {
      expect(VALIDATION_PATTERNS).toHaveProperty('EMAIL');
      expect(VALIDATION_PATTERNS).toHaveProperty('PHONE');
      expect(VALIDATION_PATTERNS).toHaveProperty('PASSWORD');
      expect(VALIDATION_PATTERNS).toHaveProperty('TC_KIMLIK');
      expect(VALIDATION_PATTERNS).toHaveProperty('IBAN');
      expect(VALIDATION_PATTERNS).toHaveProperty('AMOUNT');
      expect(VALIDATION_PATTERNS).toHaveProperty('DATE');
      expect(VALIDATION_PATTERNS).toHaveProperty('TIME');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML input', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello';
      const result = sanitizeInput(maliciousInput);
      expect(result).toBe('Hello');
    });

    it('should return empty string for null input', () => {
      expect(sanitizeInput(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should return string for number input', () => {
      expect(sanitizeInput(123)).toBe('123');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true);
      expect(validateEmail('user+tag@example.org').isValid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email').isValid).toBe(false);
      expect(validateEmail('test@').isValid).toBe(false);
      expect(validateEmail('@example.com').isValid).toBe(false);
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail(null).isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongPass123!').isValid).toBe(true);
      expect(validatePassword('MyP@ssw0rd').isValid).toBe(true);
      expect(validatePassword('Secure123#').isValid).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('weak').isValid).toBe(false);
      expect(validatePassword('12345678').isValid).toBe(false);
      expect(validatePassword('password').isValid).toBe(false);
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword(null).isValid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate Turkish phone numbers', () => {
      expect(validatePhone('+905551234567').isValid).toBe(true);
      expect(validatePhone('05551234567').isValid).toBe(true);
      expect(validatePhone('5551234567').isValid).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123').isValid).toBe(false);
      expect(validatePhone('+90555123456').isValid).toBe(false); // too short
      expect(validatePhone('+9055512345678').isValid).toBe(false); // too long
      expect(validatePhone('').isValid).toBe(false);
      expect(validatePhone(null).isValid).toBe(false);
    });
  });

  describe('validateTCKimlik', () => {
    it('should validate correct TC Kimlik numbers', () => {
      expect(validateTCKimlik('12345678901').isValid).toBe(true);
      expect(validateTCKimlik('98765432109').isValid).toBe(true);
    });

    it('should reject invalid TC Kimlik numbers', () => {
      expect(validateTCKimlik('1234567890').isValid).toBe(false); // too short
      expect(validateTCKimlik('123456789012').isValid).toBe(false); // too long
      expect(validateTCKimlik('1234567890a').isValid).toBe(false); // contains letter
      expect(validateTCKimlik('').isValid).toBe(false);
      expect(validateTCKimlik(null).isValid).toBe(false);
    });
  });

  describe('validateIBAN', () => {
    it('should validate Turkish IBAN', () => {
      expect(validateIBAN('TR330006100519786457841326').isValid).toBe(true);
      expect(validateIBAN('TR 33 0006 1005 1978 6457 8413 26').isValid).toBe(
        true
      );
    });

    it('should reject invalid IBAN', () => {
      expect(validateIBAN('TR33000610051978645784132').isValid).toBe(false); // too short
      expect(validateIBAN('TR3300061005197864578413267').isValid).toBe(false); // too long
      expect(validateIBAN('').isValid).toBe(false);
      expect(validateIBAN(null).isValid).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      expect(validateAmount('100').isValid).toBe(true);
      expect(validateAmount('100.50').isValid).toBe(true);
      expect(validateAmount('0.01').isValid).toBe(true);
      expect(validateAmount(100).isValid).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount('-100').isValid).toBe(false);
      expect(validateAmount('0').isValid).toBe(false);
      expect(validateAmount('abc').isValid).toBe(false);
      expect(validateAmount('').isValid).toBe(false);
      expect(validateAmount(null).isValid).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate required fields', () => {
      expect(validateRequired('test', 'Test Field').isValid).toBe(true);
      expect(validateRequired(0, 'Test Field').isValid).toBe(true);
      expect(validateRequired(false, 'Test Field').isValid).toBe(true);
    });

    it('should reject empty required fields', () => {
      expect(validateRequired('', 'Test Field').isValid).toBe(false);
      expect(validateRequired(null, 'Test Field').isValid).toBe(false);
      expect(validateRequired(undefined, 'Test Field').isValid).toBe(false);
      expect(validateRequired('   ', 'Test Field').isValid).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('should validate correct dates', () => {
      expect(validateDate('2024-01-01').isValid).toBe(true);
      expect(validateDate('2024-12-31').isValid).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(validateDate('2024-13-01').isValid).toBe(false);
      expect(validateDate('2024-01-32').isValid).toBe(false);
      expect(validateDate('invalid-date').isValid).toBe(false);
      expect(validateDate('').isValid).toBe(false);
      expect(validateDate(null).isValid).toBe(false);
    });
  });

  describe('validateTime', () => {
    it('should validate correct times', () => {
      expect(validateTime('12:00').isValid).toBe(true);
      expect(validateTime('23:59').isValid).toBe(true);
      expect(validateTime('00:00').isValid).toBe(true);
    });

    it('should reject invalid times', () => {
      expect(validateTime('24:00').isValid).toBe(false);
      expect(validateTime('12:60').isValid).toBe(false);
      expect(validateTime('invalid-time').isValid).toBe(false);
      expect(validateTime('').isValid).toBe(false);
      expect(validateTime(null).isValid).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('should validate form with all valid data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        phone: '+905551234567',
        amount: '100',
      };
      const rules = {
        email: { required: true, email: true },
        password: { required: true, password: true },
        phone: { required: true, phone: true },
        amount: { required: true, amount: true },
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid form data', () => {
      const formData = {
        email: 'invalid-email',
        password: 'weak',
        phone: '123',
        amount: '-100',
      };
      const rules = {
        email: { required: true, email: true },
        password: { required: true, password: true },
        phone: { required: true, phone: true },
        amount: { required: true, amount: true },
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    it('should handle missing required fields', () => {
      const formData = {
        email: 'test@example.com',
      };
      const rules = {
        email: { required: true, email: true },
        password: { required: true, password: true },
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('sanitizeFormData', () => {
    it('should sanitize all form fields', () => {
      const formData = {
        name: '<script>alert("xss")</script>John',
        email: 'test@example.com',
        message: '<p>Hello</p>',
      };

      const result = sanitizeFormData(formData);
      expect(result.name).toBe('John');
      expect(result.email).toBe('test@example.com');
      expect(result.message).toBe('Hello');
    });

    it('should handle nested objects', () => {
      const formData = {
        user: {
          name: '<script>alert("xss")</script>John',
          email: 'test@example.com',
        },
      };

      const result = sanitizeFormData(formData);
      expect(result.user.name).toBe('John');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should handle arrays', () => {
      const formData = {
        tags: ['<script>alert("xss")</script>tag1', 'tag2'],
      };

      const result = sanitizeFormData(formData);
      expect(result.tags).toEqual(['tag1', 'tag2']);
    });
  });

  describe('createRateLimiter', () => {
    it('should create a rate limiter function', () => {
      const rateLimiter = createRateLimiter(5, 60000);
      expect(typeof rateLimiter).toBe('function');
    });

    it('should allow requests within limit', () => {
      const rateLimiter = createRateLimiter(3, 60000);
      const identifier = 'test-user';

      expect(rateLimiter(identifier)).toBe(true);
      expect(rateLimiter(identifier)).toBe(true);
      expect(rateLimiter(identifier)).toBe(true);
    });

    it('should block requests over limit', () => {
      const rateLimiter = createRateLimiter(2, 60000);
      const identifier = 'test-user';

      expect(rateLimiter(identifier)).toBe(true);
      expect(rateLimiter(identifier)).toBe(true);
      expect(rateLimiter(identifier)).toBe(false);
    });
  });

  describe('generateCSRFToken', () => {
    it('should generate a token', () => {
      const token = generateCSRFToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate matching tokens', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token, token)).toBe(true);
    });

    it('should reject non-matching tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(validateCSRFToken(token1, token2)).toBe(false);
    });

    it('should reject empty tokens', () => {
      expect(validateCSRFToken('', 'token')).toBe(false);
      expect(validateCSRFToken('token', '')).toBe(false);
      expect(validateCSRFToken(null, 'token')).toBe(false);
      expect(validateCSRFToken('token', null)).toBe(false);
    });
  });
});
