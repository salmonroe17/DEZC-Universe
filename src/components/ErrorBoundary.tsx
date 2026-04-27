import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-6 py-12 font-mono text-fg">
          <p className="m-0 max-w-md text-center text-sm text-fg-muted">Something went wrong.</p>
          <button
            type="button"
            className="rounded border border-cell-border bg-elevated px-4 py-2 text-xs text-fg hover:bg-surface"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
