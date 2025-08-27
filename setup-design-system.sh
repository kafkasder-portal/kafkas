#!/bin/bash

# UI/UX Design System Setup Script
# This script installs all required dependencies for the design system

echo "🎨 Setting up Design System Dependencies..."
echo "=============================================="

# Check if npm/yarn/pnpm is available
if command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn add"
elif command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm add"
else
    echo "❌ No package manager found. Please install npm, yarn, or pnpm first."
    exit 1
fi

echo "📦 Using package manager: $PKG_MANAGER"

# Install Tailwind CSS and related dependencies
echo "Installing Tailwind CSS..."
if [ "$PKG_MANAGER" = "npm" ]; then
    npm install -D tailwindcss autoprefixer postcss
    npm install -D @tailwindcss/forms @tailwindcss/typography
else
    $PKG_MANAGER -D tailwindcss autoprefixer postcss
    $PKG_MANAGER -D @tailwindcss/forms @tailwindcss/typography
fi

# Install utility dependencies
echo "Installing utility libraries..."
if [ "$PKG_MANAGER" = "npm" ]; then
    npm install class-variance-authority clsx tailwind-merge
else
    $PKG_MANAGER class-variance-authority clsx tailwind-merge
fi

# Install additional development dependencies
echo "Installing development dependencies..."
if [ "$PKG_MANAGER" = "npm" ]; then
    npm install -D @ianvs/prettier-plugin-sort-imports
    npm install -D prettier-plugin-tailwindcss
else
    $PKG_MANAGER -D @ianvs/prettier-plugin-sort-imports
    $PKG_MANAGER -D prettier-plugin-tailwindcss
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "🔧 Next Steps:"
echo "1. Run the development server: npm run dev"
echo "2. Check MIGRATION_REPORT.md for detailed migration guide"
echo "3. Start migrating existing components to the new design system"
echo ""
echo "📚 Available Components:"
echo "- Button & IconButton"
echo "- Card (with Header, Title, Description, Content, Footer)"
echo "- Input, Label, FormField, HelperText, Textarea"
echo "- AppShell (with Sidebar, Header, Main)"
echo "- Page (with title, description, actions)"
echo ""
echo "🎨 Design System Files:"
echo "- /src/design-system/design-tokens.ts"
echo "- /src/design-system/theme.css"
echo "- /src/design-system/utils.ts"
echo "- /src/ui/ (component library)"
echo "- /src/layouts/ (layout components)"
