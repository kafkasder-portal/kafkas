// Simplified ThemeContext to avoid React import issues
import * as React from 'react'

// Create context with default value
const ThemeContext = React.createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
})

// Export hook
export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    console.error('useTheme must be used within a ThemeProvider')
    // Return default values instead of throwing
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: false,
    }
  }
  return context
}

// Simplified provider that's less likely to fail
export const ThemeProvider = ({ children }) => {
  // Initialize with safe default
  let initialTheme = 'light'

  try {
    // Try to get saved theme
    const savedTheme = localStorage?.getItem('theme')
    if (savedTheme) {
      initialTheme = savedTheme
    } else {
      // Try to check system preference
      if (window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initialTheme = 'dark'
      }
    }
  } catch (error) {
    console.warn('Theme initialization error:', error)
  }

  // Use React.useState directly to avoid destructuring issues
  const stateResult = React.useState(initialTheme)
  const theme = stateResult[0]
  const setTheme = stateResult[1]

  // Handle theme changes
  React.useEffect(() => {
    try {
      // Update localStorage
      localStorage?.setItem('theme', theme)

      // Update document class
      if (document?.documentElement) {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
      }

      // Update meta theme-color
      const metaThemeColor = document?.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff')
      }
    } catch (error) {
      console.warn('Theme update error:', error)
    }
  }, [theme])

  // Toggle function
  const toggleTheme = React.useCallback(() => {
    try {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
    } catch (error) {
      console.warn('Theme toggle error:', error)
    }
  }, [setTheme])

  // Context value
  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'dark',
    }),
    [theme, setTheme, toggleTheme]
  )

  return React.createElement(ThemeContext.Provider, { value }, children)
}

// Export default for convenience
export default { ThemeProvider, useTheme }
