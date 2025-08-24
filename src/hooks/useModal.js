import { useCallback, useState } from 'react'

/**
 * Custom hook for modal state management
 * Eliminates duplicate modal open/close logic across components
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  }
}

/**
 * Custom hook for managing multiple modals
 * Useful when a component has multiple different modals
 */
export const useMultipleModals = (modalNames = []) => {
  const initialState = modalNames.reduce((acc, name) => {
    acc[name] = false
    return acc
  }, {})

  const [modals, setModals] = useState(initialState)

  const open = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }))
  }, [])

  const close = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
  }, [])

  const toggle = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }))
  }, [])

  const closeAll = useCallback(() => {
    setModals(modalNames.reduce((acc, name) => {
      acc[name] = false
      return acc
    }, {}))
  }, [modalNames])

  return {
    modals,
    open,
    close,
    toggle,
    closeAll
  }
}
