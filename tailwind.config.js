/** @type {import('tailwindcss').Config} */
import { designTokens } from './src/design-system/design-tokens.ts';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: designTokens.colors.brand,
        
        // Semantic colors using design tokens
        foreground: designTokens.colors.foreground,
        muted: designTokens.colors.muted,
        accent: designTokens.colors.accent,
        danger: designTokens.colors.danger,
        warning: designTokens.colors.warning,
        success: designTokens.colors.success,
        
        // Background colors
        background: designTokens.colors.background,
        
        // Border colors
        border: designTokens.colors.border,
      },
      
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      lineHeight: designTokens.typography.lineHeight,
      
      spacing: designTokens.space,
      borderRadius: designTokens.radius,
      boxShadow: designTokens.boxShadow,
      zIndex: designTokens.zIndex,
      
      // Layout specific values
      width: {
        sidebar: designTokens.layout.sidebar.width,
        'sidebar-collapsed': designTokens.layout.sidebar.widthCollapsed,
      },
      
      height: {
        header: designTokens.layout.header.height,
      },
      
      maxWidth: {
        ...designTokens.layout.container,
      },
      
      screens: designTokens.breakpoints,
      
      // Animation
      transitionDuration: {
        fast: designTokens.animation.duration.fast,
        normal: designTokens.animation.duration.normal,
        slow: designTokens.animation.duration.slow,
      },
      
      // Custom utilities
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // These plugins would need to be installed:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
