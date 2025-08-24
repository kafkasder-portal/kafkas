'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.io = void 0;
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const helmet_1 = __importDefault(require('helmet'));
const morgan_1 = __importDefault(require('morgan'));
const dotenv_1 = __importDefault(require('dotenv'));
const http_1 = require('http');
const socket_io_1 = require('socket.io');
const database_1 = require('./config/database');
// Import routes
const users_1 = __importDefault(require('./routes/users'));
const inventory_1 = __importDefault(require('./routes/inventory'));
const tasks_1 = __importDefault(require('./routes/tasks'));
const aid_1 = __importDefault(require('./routes/aid'));
const finance_1 = __importDefault(require('./routes/finance'));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5000;
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)());
app.use(
  (0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Kafkas Derneği Portal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});
// API Routes
app.use('/api/users', users_1.default);
app.use('/api/inventory', inventory_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/aid', aid_1.default);
app.use('/api/finance', finance_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});
// Socket.IO connection handling
io.on('connection', socket => {
  console.log(`👤 User connected: ${socket.id}`);
  // Join user to their personal room for notifications
  socket.on('join', userId => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`👤 User disconnected: ${socket.id}`);
  });
});
// Graceful shutdown function
const gracefulShutdown = async signal => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  try {
    // Close HTTP server
    server.close(() => {
      console.log('🔌 HTTP server closed');
    });
    // Close Socket.IO server
    io.close(() => {
      console.log('🔌 Socket.IO server closed');
    });
    // Database connection is handled by Supabase client
    console.log('🗄️ Database connection closed');
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};
// Global error handlers
process.on('uncaughtException', async error => {
  console.error('❌ Uncaught Exception:', error);
  await gracefulShutdown('UNCAUGHT_EXCEPTION');
});
process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  await gracefulShutdown('UNHANDLED_REJECTION');
});
// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Initialize database connection function
const startServer = async () => {
  try {
    // Initialize database connection
    await (0, database_1.initializeDatabase)();
    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    console.log('⚠️ Continuing without direct database connection...');
  }
};
// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`
  );
  console.log(`🔌 Socket.IO is ready for connections`);
  // Initialize database asynchronously
  startServer();
});
exports.default = app;
//# sourceMappingURL=server.js.map
