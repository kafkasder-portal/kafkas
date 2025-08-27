
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check, ExternalLink } from 'lucide-react';
import { reportError } from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = this.generateErrorId();

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Report error to monitoring service
    reportError(error, {
      ...errorInfo,
      errorId,
      props: this.props,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.group('🚨 ErrorBoundary caught an error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }
  }

  generateErrorId = () => {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  handleReload = () => {
    // Clear error state before reload
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    // Clear error state and navigate home
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleRetry = () => {
    // Try to recover by clearing error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleCopyError = async () => {
    const errorText = `
Error ID: ${this.state.errorId}
Error: ${this.state.error?.toString()}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      const isProduction = import.meta.env.PROD;

      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl w-full space-y-8'>
            <div className='text-center'>
              <div className='mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100'>
                <AlertTriangle className='h-8 w-8 text-red-600' />
              </div>
              <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                Oops! Bir şeyler yanlış gitti
              </h2>
              <p className='mt-2 text-center text-sm text-gray-600'>
                Beklenmeyen bir hata oluştu. Bu durumu geliştiricilere
                bildirdik.
              </p>
              {this.state.errorId && (
                <p className='mt-2 text-center text-xs text-gray-500'>
                  Hata ID:{' '}
                  <code className='bg-gray-100 px-1 rounded'>
                    {this.state.errorId}
                  </code>
                </p>
              )}
            </div>

            {/* Error details for development */}
            {!isProduction && this.state.error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-medium text-red-800 flex items-center'>
                    <Bug className='h-4 w-4 mr-2' />
                    Hata Detayları (Development Mode)
                  </h3>
                  <button
                    onClick={this.handleCopyError}
                    className='text-xs text-red-600 hover:text-red-800 flex items-center'
                    title='Hata detaylarını kopyala'
                  >
                    {this.state.copied ? (
                      <>
                        <Check className='h-3 w-3 mr-1' />
                        Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className='h-3 w-3 mr-1' />
                        Kopyala
                      </>
                    )}
                  </button>
                </div>

                <div className='space-y-2'>
                  <div>
                    <h4 className='text-xs font-medium text-red-700 mb-1'>
                      Error Message:
                    </h4>
                    <pre className='text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-20'>
                      {this.state.error.toString()}
                    </pre>
                  </div>

                  {this.state.error.stack && (
                    <div>
                      <h4 className='text-xs font-medium text-red-700 mb-1'>
                        Stack Trace:
                      </h4>
                      <pre className='text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-32'>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}

                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 className='text-xs font-medium text-red-700 mb-1'>
                        Component Stack:
                      </h4>
                      <pre className='text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-32'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={this.handleRetry}
                className='flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Tekrar Dene
              </button>

              <button
                onClick={this.handleReload}
                className='flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Sayfayı Yenile
              </button>

              <button
                onClick={this.handleGoHome}
                className='flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
              >
                <Home className='h-4 w-4 mr-2' />
                Ana Sayfa
              </button>
            </div>

            {/* Additional info */}
            <div className='text-center'>
              <p className='text-xs text-gray-500'>
                Sorun devam ederse, lütfen sistem yöneticisiyle iletişime geçin.
                {this.state.errorId &&
                  ` Hata ID'sini belirtin: ${this.state.errorId}`}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
