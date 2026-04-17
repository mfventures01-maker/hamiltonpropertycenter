import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white px-4 text-center z-50 fixed inset-0">
                    <div className="bg-white/5 p-12 rounded-custom border border-white/10 max-w-lg w-full flex flex-col items-center space-y-6 shadow-2xl backdrop-blur-xl">
                        <div className="w-20 h-20 bg-secondary/10 flex items-center justify-center rounded-full">
                            <AlertTriangle className="w-10 h-10 text-secondary" />
                        </div>
                        <h1 className="text-3xl font-primary text-white">System Recovery</h1>
                        <p className="text-white/60 text-sm leading-relaxed font-light">
                            Hamilton Property Center is recovering. An unexpected error occurred.
                        </p>
                        <div className="bg-black/20 p-4 rounded text-left w-full overflow-auto text-[10px] text-white/40 font-mono border border-white/5">
                            {this.state.error?.message || "Unknown application error"}
                        </div>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/';
                            }}
                            className="mt-4 bg-secondary text-primary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2 group w-full justify-center"
                        >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            Reload Platform
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
