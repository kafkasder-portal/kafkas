import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { initializeDatabase } from './config/database'

// Import routes
import userRoutes from './routes/users'
import inventoryRoutes from './routes/inventory'
import taskRoutes from './routes/tasks'
import aidRoutes from './routes/aid'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 5000

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Kafkas Derneği Portal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/aid', aidRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Socket.IO connection handling
io.on('connection', socket => {
  console.log(`👤 User connected: ${socket.id}`)

  // Join user to their personal room for notifications
  socket.on('join', userId => {
    socket.join(`user_${userId}`)
    console.log(`👤 User ${userId} joined their room`)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`👤 User disconnected: ${socket.id}`)
  })
})

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`)

  try {
    // Close HTTP server
    server.close(() => {
      console.log('🔌 HTTP server closed')
    })

    // Close Socket.IO server
    io.close(() => {
      console.log('🔌 Socket.IO server closed')
    })

    // Database connection is handled by Supabase client
    console.log('🗄️ Database connection closed')

    console.log('✅ Graceful shutdown completed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error)
    process.exit(1)
  }
}

// Global error handlers
process.on('uncaughtException', async error => {
  console.error('❌ Uncaught Exception:', error)
  await gracefulShutdown('UNCAUGHT_EXCEPTION')
})

process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  await gracefulShutdown('UNHANDLED_REJECTION')
})

// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Initialize database connection function
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase()
    console.log('✅ Database initialization completed')
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    console.log('⚠️ Continuing without direct database connection...')
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`🔌 Socket.IO is ready for connections`)

  // Initialize database asynchronously
  startServer()
})

// Export io instance for use in other modules
export { io }

export default app
