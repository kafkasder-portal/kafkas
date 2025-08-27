# KAFKASDER - NGO Management System

A comprehensive web application for managing humanitarian aid, donations, and related operations targeting NGOs and social service organizations.

## 🚀 Features

- **Dashboard & Analytics** - Real-time statistics and interactive widgets
- **Donation Management** - Track donations, donors, and fundraising campaigns
- **Beneficiary Management** - Manage aid recipients and their profiles
- **Volunteer Management** - Coordinate volunteers and track their activities
- **Task Management** - Create, assign, and track organizational tasks
- **Financial Management** - Monitor income, expenses, and budgets
- **Inventory Management** - Track supplies and aid materials
- **Messaging System** - Internal messaging, SMS, and WhatsApp integration
- **Meeting Management** - Schedule and manage organizational meetings
- **Multi-language Support** - Turkish and Russian language support

## 🛠 Technology Stack

- **Frontend**: React 18.3.1 with Vite 7.1.2
- **Backend**: Supabase (PostgreSQL + Authentication)
- **UI/UX**: Framer Motion, Lucide React, Tailwind CSS
- **Internationalization**: i18next
- **Notifications**: Sonner (toast notifications)
- **PWA**: Service Worker support for offline functionality

## 🔧 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase Account** (for backend services)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kafkasder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
# Supabase Configuration
VITE_PUBLIC_SUPABASE_URL="your-supabase-project-url"
VITE_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Optional: Custom API Configuration
# VITE_API_URL="your-api-url"

# Development Configuration
VITE_ENV="development"
```

### 4. Database Setup

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from `supabase-setup.sql` to create the required tables and security policies

### 5. Run the Application

#### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5174`

#### Production Build
```bash
npm run build
npm run preview
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |
| `VITE_API_URL` | Custom API endpoint (optional) | ❌ |
| `VITE_ENV` | Environment mode | ❌ |

## 🛡 Security Features

- **Authentication**: Supabase Auth with role-based access control
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API request limiting
- **Input Validation**: Comprehensive form validation
- **XSS Prevention**: Input sanitization
- **Audit Logging**: Track all user actions

## 📱 Progressive Web App (PWA)

The application includes PWA features:
- **Offline Support**: Service Worker for caching
- **Push Notifications**: Real-time notifications
- **App-like Experience**: Mobile-optimized interface
- **Background Sync**: Offline action synchronization

## 🌍 Internationalization

Supported languages:
- **Turkish (tr)** - Primary language
- **Russian (ru)** - Secondary language

Language files are located in `src/i18n/locales/`

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run clean` | Clean build artifacts |
| `npm run lint` | Run linting (placeholder) |
| `npm run test:unit` | Run unit tests (placeholder) |

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization files
├── lib/                # Third-party library configurations
├── pages/              # Main application pages
├── services/           # API services and business logic
├── utils/              # Utility functions
└── main.jsx           # Application entry point
```

## 🔧 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript-ready patterns (JSDoc comments)

### Security
- Never commit environment variables
- Validate all user inputs
- Use prepared statements for database queries
- Implement proper authentication checks

### Performance
- Use React.memo for expensive components
- Implement code splitting with lazy loading
- Optimize images and assets
- Monitor bundle size

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Static Hosting
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify environment variables are set correctly
   - Check Supabase project status
   - Ensure database tables are created

2. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Authentication Issues**
   - Check Supabase Auth configuration
   - Verify RLS policies are set up correctly
   - Ensure user roles are properly assigned

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the documentation
- Review common issues in troubleshooting
- Contact the development team