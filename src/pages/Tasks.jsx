import { motion } from 'framer-motion'

const Tasks = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <h1>Görev Yönetimi</h1>
      <p>Görev sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default Tasks