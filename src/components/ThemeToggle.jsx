
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = ({ variant = 'button' }) => {
  const { toggleTheme, isDark } = useTheme()

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={isDark ? 'Light mode\'a geç' : 'Dark mode\'a geç'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </motion.div>
      </motion.button>
    )
  }

  // Sidebar için özel stil
  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-400" />
        ) : (
          <Moon className="h-4 w-4 text-white" />
        )}
      </motion.div>
      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </motion.button>
  )
}

ThemeToggle.propTypes = {
  variant: PropTypes.oneOf(['button', 'icon']),
};

export default ThemeToggle
