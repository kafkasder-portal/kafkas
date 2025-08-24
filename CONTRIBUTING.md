# Contributing to KafPortal

Thank you for considering contributing to KafPortal! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Pull Requests

1. **Fork the repository** and create a feature branch
2. **Follow the coding standards** outlined below
3. **Write or update tests** for your changes
4. **Update documentation** if needed
5. **Create a clear PR description** explaining your changes

## 🛠 Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/kafportal.git
cd kafportal

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## 📋 Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Follow **React best practices**:
  - Use unique keys in map functions
  - Implement proper error boundaries
  - Use React.memo for performance optimization
- Use **JSDoc comments** for functions and components
- Prefer **const** over let/var
- Use **async/await** over Promises

### Code Style

- **Prettier** for formatting (automatic on save)
- **ESLint** for linting
- **2 spaces** for indentation
- **Single quotes** for strings
- **Trailing commas** in objects/arrays

### File Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Main application pages
├── services/       # API services
├── utils/          # Utility functions
├── types/          # TypeScript definitions
└── test/           # Test files
```

### Naming Conventions

- **PascalCase** for components: `UserProfile.jsx`
- **camelCase** for functions/variables: `getUserData`
- **kebab-case** for files: `user-profile.css`
- **UPPER_SNAKE_CASE** for constants: `MAX_RETRY_ATTEMPTS`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Write tests for **all new features**
- Use **React Testing Library** for component tests
- Use **Vitest** for unit tests
- Mock external dependencies
- Test both **happy path** and **error cases**

### Test Structure

```javascript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 🔒 Security Guidelines

### Sensitive Data

- **Never commit** sensitive information
- Use **environment variables** for configuration
- Follow **OWASP** security practices
- Validate **all user inputs**

### Authentication

- Use **Supabase Auth** for authentication
- Implement **proper authorization** checks
- Use **secure session management**
- Follow **principle of least privilege**

## 📦 Building and Deployment

### Local Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Required for production:
- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`

Optional:
- `VITE_API_URL`
- `VITE_ENV`

## 🌍 Internationalization

### Adding New Languages

1. Create language file in `src/i18n/locales/`
2. Add language to supported languages list
3. Update language switcher component
4. Test all UI elements with new language

### Translation Guidelines

- Use **descriptive keys**: `dashboard.stats.totalDonations`
- Keep **consistent terminology**
- Support **plural forms** where needed
- Consider **text length variations**

## 📝 Documentation

### Code Documentation

- Use **JSDoc** for functions and components
- Include **parameter types** and descriptions
- Document **complex business logic**
- Keep **README.md** up to date

### Commit Messages

Follow **Conventional Commits** format:

```
type(scope): description

feat(auth): add two-factor authentication
fix(dashboard): resolve memory leak in widgets
docs(readme): update installation instructions
test(api): add unit tests for user service
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🚀 Performance Guidelines

### Component Optimization

- Use **React.memo** for pure components
- Implement **useMemo** for expensive calculations
- Use **useCallback** for event handlers
- Avoid **inline objects/functions** in JSX

### Bundle Optimization

- Use **dynamic imports** for code splitting
- Optimize **images and assets**
- Monitor **bundle size** (keep under 5MB)
- Use **tree shaking** for unused code

## 🔍 Code Review Process

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors in browser
- [ ] Performance impact considered

### Review Checklist

- [ ] Functionality works as expected
- [ ] Code is readable and maintainable
- [ ] Security considerations addressed
- [ ] Performance implications reviewed
- [ ] Accessibility standards met

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Code-specific discussions

### Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 📄 License

By contributing to KafPortal, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in the project's README.md file. Thank you for helping make KafPortal better!