import {Container} from '@material-ui/core';
import React, {Component, ErrorInfo, ReactNode} from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<{children: ReactNode}, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_err: Error): State {
    return {hasError: true};
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <h1>Sorry... there was an error</h1>
          <h2>Try to refresh the page</h2>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
