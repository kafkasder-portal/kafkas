
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useTheme } from '../contexts/ThemeContext'
import './ThemeToggle.css'

const ThemeToggle = ({ variant = 'button' }) => {
  const { toggleTheme, isDark } = useTheme()

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="theme-toggle-icon"
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className="theme-toggle-button"
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
      <span className="theme-toggle-text">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </motion.button>
  )
}

ThemeToggle.propTypes = {
  variant: PropTypes.oneOf(['button', 'icon']),
};

export default ThemeToggle
