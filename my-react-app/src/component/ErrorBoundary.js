import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Something went wrong.</h1>
          <p>We're working to fix the problem. Please try again later or reload the pagee.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
