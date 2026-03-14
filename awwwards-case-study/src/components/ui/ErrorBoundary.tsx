"use client";

import React, { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    /** What to show when a child crashes. Defaults to nothing. */
    fallback?: ReactNode;
    /** Optional label logged alongside the error for debugging. */
    label?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

/**
 * Granular error boundary for wrapping heavy / risky components (Spline, Lottie,
 * Matter.js, etc.) so a single component crash doesn't take down the whole page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(
            `[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ""}]`,
            error,
            info.componentStack
        );
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}
