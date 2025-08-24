import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Eye, EyeOff, Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import SecureForm from '../components/SecureForm'
import { 
  validateEmail, 
  validatePassword, 
  validatePhone, 
  validateTCKimlik,
  validateIBAN,
  validateAmount,
  sanitizeInput 
} from '../utils/validation'
import { 
  secureFileUpload, 
  auditLogger, 
  securityMonitor,
  rateLimiters 
} from '../utils/security'

const SecurityTest = () => {
  const [testResults, setTestResults] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileValidationResult, setFileValidationResult] = useState(null)

  // Test form fields
  const testFields = [
    {
      name: 'email',
      type: 'email',
      label: 'E-posta Adresi',
      placeholder: 'test@example.com',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Şifre',
      placeholder: 'Güçlü şifre giriniz',
      required: true
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Telefon Numarası',
      placeholder: '0555 123 45 67',
      required: true
    },
    {
      name: 'tcKimlik',
      type: 'text',
      label: 'TC Kimlik No',
      placeholder: '12345678901',
      required: true
    },
    {
      name: 'iban',
      type: 'text',
      label: 'IBAN',
      placeholder: 'TR123456789012345678901234',
      required: true
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Tutar',
      placeholder: '100.50',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Açıklama',
      placeholder: 'Açıklama giriniz...',
      required: false
    }
  ]

  // Validation rules
  const validationRules = {
    email: { required: true, email: true, fieldName: 'E-posta adresi' },
    password: { required: true, password: true, fieldName: 'Şifre' },
    phone: { required: true, phone: true, fieldName: 'Telefon numarası' },
    tcKimlik: { required: true, tcKimlik: true, fieldName: 'TC Kimlik No' },
    iban: { required: true, iban: true, fieldName: 'IBAN' },
    amount: { required: true, amount: true, fieldName: 'Tutar' },
    description: { maxLength: 500, fieldName: 'Açıklama' }
  }

  // Run security tests
  const runSecurityTests = () => {
    const tests = [
      {
        name: 'E-posta Validasyonu',
        test: () => {
          const validEmail = validateEmail('test@example.com')
          const invalidEmail = validateEmail('invalid-email')
          return validEmail.isValid && !invalidEmail.isValid
        }
      },
      {
        name: 'Şifre Gücü Kontrolü',
        test: () => {
          const strongPassword = validatePassword('StrongPass123!')
          const weakPassword = validatePassword('weak')
          return strongPassword.isValid && !weakPassword.isValid
        }
      },
      {
        name: 'Telefon Numarası Validasyonu',
        test: () => {
          const validPhone = validatePhone('05551234567')
          const invalidPhone = validatePhone('123')
          return validPhone.isValid && !invalidPhone.isValid
        }
      },
      {
        name: 'TC Kimlik No Validasyonu',
        test: () => {
          const validTC = validateTCKimlik('12345678901')
          const invalidTC = validateTCKimlik('123')
          return validTC.isValid && !invalidTC.isValid
        }
      },
      {
        name: 'IBAN Validasyonu',
        test: () => {
          const validIBAN = validateIBAN('TR123456789012345678901234')
          const invalidIBAN = validateIBAN('INVALID')
          return validIBAN.isValid && !invalidIBAN.isValid
        }
      },
      {
        name: 'Tutar Validasyonu',
        test: () => {
          const validAmount = validateAmount('100.50')
          const invalidAmount = validateAmount('-50')
          return validAmount.isValid && !invalidAmount.isValid
        }
      },
      {
        name: 'XSS Koruması',
        test: () => {
          const maliciousInput = '<script>alert("XSS")</script>'
          const sanitized = sanitizeInput(maliciousInput)
          return !sanitized.includes('<script>')
        }
      },
      {
        name: 'Rate Limiting',
        test: () => {
          const limiter = rateLimiters.login
          const result1 = limiter('test-user')
          const result2 = limiter('test-user')
          return result1 && result2 // İlk iki deneme başarılı olmalı
        }
      }
    ]

    const results = tests.map(test => ({
      name: test.name,
      passed: test.test(),
      timestamp: new Date().toISOString()
    }))

    setTestResults(results)

    // Log test results
    auditLogger.log('security_tests_run', null, {
      totalTests: tests.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length
    })

    toast.success(`${results.filter(r => r.passed).length}/${results.length} test başarılı!`)
  }

  // Handle form submission
  const handleFormSubmit = async (data) => {
    console.log('Form data:', data)
    
    // Log form submission
    auditLogger.log('security_test_form_submission', null, {
      fields: Object.keys(data),
      hasCSRF: !!data._csrf
    })

    toast.success('Güvenli form başarıyla gönderildi!')
    
    return { resetForm: true }
  }

  // Handle file upload test
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const validation = secureFileUpload.validateFile(file, ['image', 'document'])
      setFileValidationResult(validation)
      
      if (validation.isValid) {
        toast.success('Dosya geçerli!')
      } else {
        toast.error(`Dosya hatası: ${validation.errors.join(', ')}`)
      }
    }
  }

  // Test suspicious activity monitoring
  const testSuspiciousActivity = () => {
    // Simulate multiple failed login attempts
    for (let i = 0; i < 5; i++) {
      securityMonitor.monitorActivity({
        type: 'login_failed',
        userId: 'test-user',
        data: { email: 'test@example.com', attempts: i + 1 }
      })
    }

    toast.info('Şüpheli aktivite testi çalıştırıldı. Konsolu kontrol edin.')
  }

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Güvenlik Test Merkezi</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Bu sayfa, uygulamanın güvenlik özelliklerini test etmek için kullanılır. 
          Tüm güvenlik kontrolleri ve validasyonlar burada test edilebilir.
        </p>

        {/* Security Tests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Güvenlik Testleri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={runSecurityTests}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Tüm Testleri Çalıştır
            </motion.button>

            <motion.button
              onClick={testSuspiciousActivity}
              className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Şüpheli Aktivite Testi
            </motion.button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Test Sonuçları</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      result.passed ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Secure Form Test */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Güvenli Form Testi</h2>
        <SecureForm
          fields={testFields}
          validationRules={validationRules}
          onSubmit={handleFormSubmit}
          rateLimitType="form"
          showSecurityIndicator={true}
        />
      </motion.div>

      {/* File Upload Security Test */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dosya Yükleme Güvenlik Testi</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosya Seçin (Resim veya Belge)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedFile && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Seçilen Dosya:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Ad:</strong> {selectedFile.name}</p>
                <p><strong>Boyut:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Tür:</strong> {selectedFile.type}</p>
              </div>
            </div>
          )}

          {fileValidationResult && (
            <div className={`p-4 rounded-lg ${
              fileValidationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                fileValidationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {fileValidationResult.isValid ? 'Dosya Geçerli' : 'Dosya Geçersiz'}
              </h4>
              {fileValidationResult.errors.length > 0 && (
                <ul className="text-sm text-red-700 space-y-1">
                  {fileValidationResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Security Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Özellikleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Input Validasyonu</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• E-posta format kontrolü</li>
              <li>• Şifre gücü kontrolü</li>
              <li>• Telefon numarası validasyonu</li>
              <li>• TC Kimlik No algoritması</li>
              <li>• IBAN format kontrolü</li>
              <li>• Tutar validasyonu</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Güvenlik Korumaları</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• XSS koruması (DOMPurify)</li>
              <li>• CSRF token koruması</li>
              <li>• Rate limiting</li>
              <li>• Input sanitization</li>
              <li>• Dosya upload güvenliği</li>
              <li>• Audit logging</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Monitoring</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Şüpheli aktivite tespiti</li>
              <li>• Başarısız giriş denemeleri</li>
              <li>• Form submission tracking</li>
              <li>• Dosya upload monitoring</li>
              <li>• Session management</li>
              <li>• Security headers</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Session Güvenliği</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Güvenli session ID üretimi</li>
              <li>• Session expiry kontrolü</li>
              <li>• Activity tracking</li>
              <li>• Automatic logout</li>
              <li>• Token rotation</li>
              <li>• Secure storage</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SecurityTest
