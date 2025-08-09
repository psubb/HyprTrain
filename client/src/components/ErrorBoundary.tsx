import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('React Error Boundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-gray-950 to-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900/50 border border-red-500/20 rounded-lg p-6 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-4">
              The application encountered an unexpected error. Please refresh the page to try again.
            </p>
            <div className="text-xs text-gray-500 bg-gray-800/50 rounded p-3 mb-4 text-left">
              <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
