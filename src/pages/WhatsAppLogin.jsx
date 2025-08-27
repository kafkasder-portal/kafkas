import { motion } from 'framer-motion'

const WhatsAppLogin = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <h1>WhatsApp Girişi</h1>
      <p>WhatsApp giriş sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default WhatsAppLogin
