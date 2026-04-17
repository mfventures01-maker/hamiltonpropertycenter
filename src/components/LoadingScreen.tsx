import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen = ({ text = "Loading Experience..." }: { text?: string }) => {
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center z-50 fixed inset-0">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-2 border-white/10 border-t-secondary rounded-full mb-8 relative"
            >
                <div className="absolute inset-0 m-auto w-8 h-8 border border-white/5 border-b-secondary rounded-full" />
            </motion.div>
            <div className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold animate-pulse text-center">
                {text}
            </div>
        </div>
    );
};
