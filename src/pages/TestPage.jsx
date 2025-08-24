import { motion } from 'framer-motion'

const TestPage = () => {
  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '2rem' }}
    >
      <h1 style={{ color: '#667eea', fontSize: '2rem', marginBottom: '1rem' }}>
        Test Sayfası ✅
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#4a5568' }}>
        Bu sayfa görünüyorsa, temel sistem çalışıyor demektir.
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0fff4',
        borderRadius: '8px',
        border: '1px solid #9ae6b4'
      }}>
        <h3>✅ Başarılı bileşenler:</h3>
        <ul>
          <li>React Router ✅</li>
          <li>Framer Motion ✅</li>
          <li>CSS stilleri ✅</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default TestPage
