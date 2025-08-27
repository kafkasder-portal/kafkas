import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppShell, AppShellSidebar, AppShellHeader, AppShellMain } from './AppShell';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ConnectionStatus from '../components/ConnectionStatus';
import MobileNavigation from '../components/MobileNavigation';
import ErrorBoundary from '../components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';

/**
 * Design System Layout Adapter
 * 
 * Enhanced layout that integrates existing components with the new AppShell design system.
 * Provides the same functionality as MainLayout but with design system styling.
 */
const DesignSystemLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppShell sidebarCollapsed={sidebarCollapsed}>
      {/* Sidebar */}
      <AppShellSidebar collapsed={sidebarCollapsed}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      </AppShellSidebar>
      
      {/* Header */}
      <AppShellHeader>
        <Header onMenuToggle={toggleSidebar} />
      </AppShellHeader>
      
      {/* Main Content */}
      <AppShellMain>
        {/* Connection Status */}
        <ConnectionStatus />
        
        {/* Mobile Navigation */}
        {isMobile && <MobileNavigation />}
        
        {/* Page Content */}
        <div className="page-content">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </AppShellMain>
    </AppShell>
  );
};

DesignSystemLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DesignSystemLayout;
