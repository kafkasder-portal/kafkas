import { motion } from 'framer-motion'

const ProjectManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container"
    >
      <h1>Proje Yönetimi</h1>
      <p>Proje yönetimi sayfası geliştirme aşamasında...</p>
    </motion.div>
  )
}

export default ProjectManagement
