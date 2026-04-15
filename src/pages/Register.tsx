import React from "react";
import { RegisterForm } from "../components/auth/RegisterForm";
import { Logo } from "../components/Logo";
import { motion } from "framer-motion";
import { MessageCircle, Star, ShieldCheck, Users } from "lucide-react";

export const Register = () => {
    return (
        <div className="relative min-h-screen bg-primary flex flex-col lg:flex-row overflow-hidden">
            {/* Visual Side (Left) */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-primary/60 mix-blend-multiply z-10" />
                    <img
                        src="https://picsum.photos/seed/luxury-hpc-onboarding/1200/1600"
                        alt="Luxury Property"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 max-w-xl space-y-12">
                    <Logo className="mb-20" />

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="h-px w-12 bg-secondary/50" />
                            <span className="text-secondary text-[10px] uppercase tracking-[0.6em] font-bold">Hamilton Excellence</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl text-white font-primary leading-tight"
                        >
                            Join Nigeria’s <br /> Trusted Property <br /> <span className="text-secondary italic">Marketplace.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/60 text-lg font-light leading-relaxed font-secondary tracking-wide"
                        >
                            Verified agents. Premium listings. Serious buyers. <br />
                            The gold standard for property investment in Asaba.
                        </motion.p>
                    </div>

                    {/* Testimonial / Trust Element */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl space-y-6"
                    >
                        <div className="flex gap-1 text-secondary">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                        </div>
                        <p className="text-white/80 text-sm font-light italic leading-relaxed">
                            "Switching to Hamilton Property Center was the best decision for our development firm. The leads are higher quality and the trust factor is unmatched."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs">EO</div>
                            <div>
                                <p className="text-white text-xs font-bold uppercase tracking-wider">Emeka Okafor</p>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Verified Developer</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Indicator Preview */}
                    <div className="flex items-center gap-12 pt-10">
                        {[
                            { label: "Account", icon: Users },
                            { label: "Verification", icon: ShieldCheck },
                            { label: "Go Live", icon: Star }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 opacity-40">
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                    <step.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/60">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto">
                <Logo className="lg:hidden mb-12" />
                <RegisterForm />
            </div>

            {/* WhatsApp Floating Help */}
            <a
                href="https://wa.me/2347037936261"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-10 right-10 z-[100] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap text-xs uppercase tracking-widest font-bold">Help?</span>
            </a>
        </div>
    );
};
