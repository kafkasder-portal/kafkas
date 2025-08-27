import { motion } from 'framer-motion'

const Fund = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <h1>Fon Yönetimi</h1>
      <p>Fon sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default Fund