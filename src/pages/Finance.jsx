import { motion } from 'framer-motion'

const Finance = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container"
    >
      <h1>Finans Yönetimi</h1>
      <p>Finans sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default Finance