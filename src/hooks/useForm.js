import { useCallback, useState } from 'react'
import { isFormValid, validateForm } from '../utils/validation'

/**
 * Custom hook for form state management
 * Eliminates duplicate form handling logic across components
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    // Validate single field on blur
    if (validationRules[name]) {
      const fieldErrors = validateForm(
        { [name]: values[name] },
        { [name]: validationRules[name] }
      )

      setErrors(prev => ({
        ...prev,
        ...fieldErrors
      }))
    }
  }, [values, validationRules])

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  // Validate all fields
  const validate = useCallback(() => {
    const validationErrors = validateForm(values, validationRules)
    setErrors(validationErrors)
    return isFormValid(validationErrors)
  }, [values, validationRules])

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Handle form submit
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault()

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {})
      setTouched(allTouched)

      // Validate form
      const isValid = validate()

      if (isValid) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
          reset()
        } catch (error) {
          console.error('Form submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      }
    }
  }, [values, validate, reset])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: isFormValid(errors),
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    validate,
    reset
  }
}

/**
 * Custom hook for handling form with dynamic fields
 * Useful for forms where fields can be added/removed dynamically
 */
export const useDynamicForm = (initialFields = []) => {
  const [fields, setFields] = useState(initialFields)

  const addField = useCallback((field) => {
    setFields(prev => [...prev, { ...field, id: Date.now() }])
  }, [])

  const removeField = useCallback((id) => {
    setFields(prev => prev.filter(field => field.id !== id))
  }, [])

  const updateField = useCallback((id, updates) => {
    setFields(prev => prev.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ))
  }, [])

  const resetFields = useCallback(() => {
    setFields(initialFields)
  }, [initialFields])

  return {
    fields,
    addField,
    removeField,
    updateField,
    resetFields,
    setFields
  }
}
