import { motion } from 'framer-motion'

const WhatsApp = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <h1>WhatsApp Yönetimi</h1>
      <p>WhatsApp sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default WhatsApp
