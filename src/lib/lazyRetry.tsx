import React, { lazy } from 'react';

/**
 * Wraps React.lazy to auto-retry and gracefully handle chunk loading failures
 * caused by stale deployments or network drops.
 */
export const lazyRetry = (componentImport: () => Promise<any>, retriesLeft = 2, interval = 1000): React.LazyExoticComponent<any> => {
    return lazy(async () => {
        try {
            const component = await componentImport();
            return component;
        } catch (error) {
            if (retriesLeft === 0) {
                console.error('Lazy chunk load failed after retries', error);

                // Final fallback: trigger a hard refresh to fetch new assets
                if (!sessionStorage.getItem('hpc_chunk_reloaded')) {
                    sessionStorage.setItem('hpc_chunk_reloaded', 'true');
                    window.location.reload();
                }

                return {
                    default: () => (
                        <div className="min-h-screen flex items-center justify-center bg-primary text-secondary p-8 text-center flex-col gap-6">
                            <h2 className="text-3xl font-primary">Update Available</h2>
                            <p className="text-white/60 font-light max-w-sm text-sm">
                                A new version of Hamilton Property Center has been deployed.
                            </p>
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('hpc_chunk_reloaded');
                                    window.location.reload();
                                }}
                                className="bg-secondary text-primary px-8 py-4 rounded-custom font-bold uppercase tracking-widest text-xs shadow-xl"
                            >
                                Reload Platform
                            </button>
                        </div>
                    )
                };
            }
            // Retry
            await new Promise((resolve) => setTimeout(resolve, interval));
            return lazyRetry(componentImport, retriesLeft - 1, interval) as any;
        }
    });
};
