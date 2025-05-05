import React from 'react';
import { Alert, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

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
          Something went wrong. Please refresh the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 