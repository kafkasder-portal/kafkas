import { motion } from 'framer-motion'

const BudgetPlanning = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <h1>Bütçe Planlama</h1>
      <p>Bütçe planlama sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default BudgetPlanning
