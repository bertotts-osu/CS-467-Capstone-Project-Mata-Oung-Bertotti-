// ErrorBoundary.jsx
// This component provides a React error boundary to catch and display errors in the UI, preventing the entire app from crashing.

import React from 'react';
import { Alert, Button } from '@mui/material';

/**
 * ErrorBoundary component.
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Update state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Log error details for debugging.
   */
  componentDidCatch(error) {
    console.error('Application Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          }
        >
          {/* Fallback error message with refresh option */}
          Something went wrong. Please refresh the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 