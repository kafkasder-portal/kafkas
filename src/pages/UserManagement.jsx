import { motion } from 'framer-motion'

const UserManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container"
    >
      <h1>Kullanıcı Yönetimi</h1>
      <p>Kullanıcı yönetimi sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default UserManagement
