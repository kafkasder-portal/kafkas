# 🎨 KAFKASDER Design System

Modern, accessible, and comprehensive design system for the KAFKASDER web application.

## 📋 Overview

This design system provides a complete solution for UI/UX consistency across the application with:

- **Single Source of Truth**: Centralized design tokens
- **Component Library**: Reusable, accessible components
- **Layout System**: Consistent page structures
- **Theme Support**: Light/dark mode ready
- **Accessibility**: WCAG AA compliant
- **Responsive**: Mobile-first approach

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Run the setup script
./setup-design-system.sh

# Or manually install:
npm install -D tailwindcss autoprefixer postcss @tailwindcss/forms @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge
```

### 2. Import Design System

```jsx
// In your component files
import { Button, Card, Input, Page } from '../ui';

// In your main CSS (already configured)
@import './design-system/theme.css';
```

### 3. Use Components

```jsx
import { Button, Card, Page } from '../ui';

function MyComponent() {
  return (
    <Page title="Dashboard" description="Welcome back!">
      <Card>
        <Card.Header>
          <Card.Title>Stats</Card.Title>
        </Card.Header>
        <Card.Content>
          <Button variant="primary" size="md">
            Action
          </Button>
        </Card.Content>
      </Card>
    </Page>
  );
}
```

## 🎯 Design Tokens

All design decisions are centralized in `/src/design-system/design-tokens.ts`:

### Colors
```typescript
// Brand colors (50-900 scale)
colors.brand[500] // Primary brand color
colors.foreground.DEFAULT // Text color
colors.muted[200] // Subtle backgrounds
colors.success[600] // Success states
colors.warning[500] // Warning states  
colors.danger[600] // Error states
```

### Typography
```typescript
typography.fontSize.lg // 1.125rem
typography.fontWeight.semibold // 600
typography.lineHeight.relaxed // 1.625
```

### Spacing
```typescript
space[4] // 1rem (16px)
space[8] // 2rem (32px)
space[12] // 3rem (48px)
```

### Layout
```typescript
layout.sidebar.width // 280px
layout.header.height // 64px
layout.container.xl // 1280px
```

## 📦 Components

### Core Components

#### Button
Versatile button with multiple variants and states.

```jsx
<Button variant="primary" size="md" loading={isLoading}>
  Save Changes
</Button>

<Button variant="outline" leftIcon={<Plus />}>
  Add Item
</Button>

<IconButton 
  variant="ghost" 
  icon={<Settings />} 
  aria-label="Settings"
/>
```

**Variants**: `primary` | `secondary` | `outline` | `ghost` | `link` | `danger` | `success`  
**Sizes**: `sm` | `md` | `lg` | `icon`

#### Card
Flexible content container with sections.

```jsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

#### Input & Forms
Accessible form components with validation.

```jsx
<FormField>
  <Label htmlFor="email" required>
    Email Address
  </Label>
  <Input
    type="email"
    id="email"
    value={email}
    onChange={setEmail}
    error={hasError}
    placeholder="Enter email"
  />
  <HelperText error={hasError}>
    {hasError ? 'Invalid email' : 'We'll never share your email'}
  </HelperText>
</FormField>
```

### Advanced Components

#### Modal
Accessible modal dialog with backdrop and keyboard navigation.

```jsx
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  size="lg"
  closeOnBackdrop={true}
>
  <Modal.Header>
    <Modal.Title>Confirm Action</Modal.Title>
    <Modal.Description>This action cannot be undone</Modal.Description>
  </Modal.Header>
  <Modal.Body>
    Content
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={onClose}>Cancel</Button>
    <Button variant="danger">Delete</Button>
  </Modal.Footer>
</Modal>
```

#### Select
Custom select with search and keyboard navigation.

```jsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  placeholder="Choose option..."
  searchable
  multiple
/>
```

#### Alert
Contextual feedback messages.

```jsx
<Alert variant="success" dismissible onDismiss={close}>
  <Alert.Title>Success!</Alert.Title>
  <Alert.Description>
    Your changes have been saved successfully.
  </Alert.Description>
</Alert>
```

**Variants**: `default` | `success` | `warning` | `danger` | `info`

#### Badge
Small status indicators.

```jsx
<Badge variant="success">Active</Badge>
<StatusBadge status="pending">Pending</StatusBadge>
<CountBadge count={42} />
```

### Layout Components

#### AppShell
Main application layout structure.

```jsx
<AppShell sidebarCollapsed={collapsed}>
  <AppShell.Header>
    <HeaderContent />
  </AppShell.Header>
  
  <AppShell.Sidebar collapsed={collapsed}>
    <SidebarContent />
  </AppShell.Sidebar>
  
  <AppShell.Main maxWidth="7xl">
    <YourPageContent />
  </AppShell.Main>
</AppShell>
```

#### Page
Individual page wrapper with consistent structure.

```jsx
<Page
  title="Dashboard"
  description="Overview of your account"
  breadcrumb={<Breadcrumb />}
  actions={
    <>
      <Button variant="outline">Export</Button>
      <Button variant="primary">Create New</Button>
    </>
  }
>
  <PageContent />
</Page>
```

## 🎨 Theming

### CSS Custom Properties
All colors and dimensions are available as CSS variables:

```css
.my-element {
  background-color: var(--color-brand-500);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}
```

### Dark Theme
Dark theme support is built-in:

```jsx
// Toggle theme
document.documentElement.setAttribute('data-theme', 'dark');
```

### Responsive Design
All components are responsive by default:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Auto responsive grid */}
</div>
```

## ♿ Accessibility

### WCAG AA Compliance
- Minimum contrast ratios met
- Focus indicators on all interactive elements
- Semantic HTML structure
- Proper ARIA labels and descriptions

### Keyboard Navigation
- Tab navigation for all interactive elements
- Arrow key navigation in select/dropdown components
- Escape key closes modals and dropdowns
- Enter/Space activates buttons and options

### Screen Reader Support
- Proper heading hierarchy
- Descriptive labels for form controls
- Status announcements for dynamic content
- Hidden content for screen readers when needed

## 📱 Responsive Breakpoints

```typescript
breakpoints: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
}
```

## 🔧 Customization

### Extending Design Tokens
Add custom tokens to `design-tokens.ts`:

```typescript
// Add custom colors
export const customColors = {
  brand: {
    // Your custom brand colors
  }
};

// Add custom spacing
export const customSpace = {
  18: '4.5rem', // 72px
};
```

### Creating Custom Components
Use the same patterns as existing components:

```jsx
import { cva, cn } from '../design-system/utils';

const myComponentVariants = cva({
  base: 'base-classes',
  variants: {
    variant: {
      primary: 'primary-classes',
      secondary: 'secondary-classes'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});

export const MyComponent = ({ variant, className, ...props }) => {
  return (
    <div 
      className={cn(myComponentVariants({ variant }), className)}
      {...props}
    />
  );
};
```

## 📚 Migration Guide

### From Old to New System

1. **Replace hardcoded colors**:
   ```jsx
   // Before
   style={{ backgroundColor: '#3b82f6' }}
   
   // After  
   className="bg-brand-500"
   ```

2. **Use design system components**:
   ```jsx
   // Before
   <button className="btn btn-primary">Click me</button>
   
   // After
   <Button variant="primary">Click me</Button>
   ```

3. **Adopt consistent spacing**:
   ```jsx
   // Before
   style={{ padding: '16px', margin: '8px' }}
   
   // After
   className="p-4 m-2"
   ```

### Component Mapping
| Old Pattern | New Component |
|-------------|---------------|
| Custom buttons | `<Button>` |
| Form elements | `<Input>`, `<Select>`, `<Textarea>` |
| Content containers | `<Card>` |
| Page layouts | `<Page>`, `<AppShell>` |
| Status indicators | `<Badge>`, `<Alert>` |
| Modal dialogs | `<Modal>` |

## 🧪 Testing Components

### Visual Testing
Use Storybook or similar tools to test component variants:

```jsx
// Button.stories.js
export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

### Accessibility Testing
- Use axe-core for automated a11y testing
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios

## 🔄 Best Practices

### Do's ✅
- Use design tokens for all styling values
- Follow component composition patterns
- Provide meaningful ARIA labels
- Test components in different states
- Use semantic HTML elements

### Don'ts ❌
- Don't use hardcoded colors or spacing
- Don't bypass accessibility features
- Don't create custom components without following patterns
- Don't ignore responsive behavior
- Don't skip prop validation

## 📈 Performance

### Optimization Features
- Tree-shaking friendly exports
- CSS-in-JS avoided for better caching
- Minimal runtime dependencies
- Optimized bundle sizes

### Bundle Analysis
```bash
# Analyze bundle size
npm run build && npm run analyze
```

## 🤝 Contributing

### Adding New Components
1. Follow existing component patterns
2. Include all variants and sizes
3. Add accessibility features
4. Write comprehensive documentation
5. Include usage examples

### Design Token Updates
1. Update `design-tokens.ts`
2. Update `theme.css` accordingly
3. Test all components with changes
4. Update documentation

## 📞 Support

For questions, issues, or suggestions:
- Check the MIGRATION_REPORT.md for detailed migration steps
- Review existing components for patterns
- Follow the established conventions

---

**Design System Version**: 1.0.0  
**Last Updated**: August 2025  
**Compatibility**: React 18+, Modern browsers
