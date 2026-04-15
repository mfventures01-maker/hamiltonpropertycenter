import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Crown,
    Zap,
    ShieldCheck,
    ArrowRight,
    Target,
    Trophy,
    Activity,
    BarChart3
} from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, feature }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/95 backdrop-blur-2xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative bg-white/5 border border-white/10 rounded-[3.5rem] p-16 max-w-4xl w-full space-y-12 overflow-hidden shadow-[0_0_100px_rgba(198,167,94,0.1)]"
                    >
                        {/* Background Accent */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-10 right-10 p-4 bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-secondary">
                                        <ShieldCheck className="w-8 h-8" />
                                        <h3 className="text-secondary text-[10px] uppercase font-bold tracking-[0.5em] leading-none">Revenue Enforcement Protocol</h3>
                                    </div>
                                    <h2 className="text-5xl md:text-6xl text-white font-primary leading-[0.9] -tracking-wider">
                                        Upgrade for <br /> <span className="text-secondary italic">Peak Influence.</span>
                                    </h2>
                                    <p className="text-white/40 text-sm font-light leading-relaxed tracking-wide">
                                        The <span className="text-secondary font-bold">"{feature}"</span> protocol is restricted to Growth Advisor and Elite Institutional partners. Achieve 400%+ marketplace visibility by upgrading today.
                                    </p>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-white/5">
                                    {[
                                        { label: 'Priority Inquiry Access', icon: Activity },
                                        { label: 'Featured Global Slots', icon: Trophy },
                                        { label: 'Ranking Boost Algorithm', icon: BarChart3 },
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-6">
                                            <div className="p-3 bg-secondary/10 rounded-xl">
                                                <benefit.icon className="w-5 h-5 text-secondary" />
                                            </div>
                                            <span className="text-white text-xs font-bold uppercase tracking-widest">{benefit.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-secondary p-12 rounded-[3.5rem] text-primary space-y-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Crown className="w-24 h-24" />
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest inline-block border border-primary/10">Recommendation</div>
                                    <h4 className="text-3xl font-primary font-bold">Elite Institutional</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-primary font-bold">₦75,000</span>
                                        <span className="text-primary/60 text-[9px] uppercase font-bold tracking-widest">/ Month</span>
                                    </div>
                                </div>

                                <ul className="space-y-4">
                                    {['Unlimited Assets', 'Real-time Behavior Data', 'Elite Verified Badge'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full bg-primary text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-white hover:text-primary transition-all shadow-xl group">
                                    Unlock Global Ranking <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
