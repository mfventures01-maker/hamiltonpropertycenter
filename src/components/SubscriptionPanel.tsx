import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Zap,
    Crown,
    Check,
    ArrowRight,
    TrendingUp,
    BarChart3,
    Eye
} from "lucide-react";

const plans = [
    {
        type: 'free',
        name: 'Standard Partner',
        price: '₦0',
        icon: ShieldCheck,
        color: 'border-white/10 text-white/40',
        btnColor: 'bg-white/5 text-white',
        features: [
            '3 Active Listings',
            'Standard Search Ranking',
            'Basic Inquiry Tracking'
        ]
    },
    {
        type: 'pro',
        name: 'Growth Advisor',
        price: '₦25,000',
        period: '/mo',
        icon: Zap,
        color: 'border-white/10 text-white',
        btnColor: 'bg-white/10 text-white hover:bg-white hover:text-primary',
        features: [
            '15 Active Listings',
            'Priority Search Ranking',
            'Advanced Lead Analytics',
            'Follow-up Reminders'
        ],
        trend: "+250% Engagement"
    },
    {
        type: 'premium',
        name: 'Elite Institutional',
        price: '₦75,000',
        period: '/mo',
        icon: Crown,
        color: 'border-secondary/30 text-secondary',
        btnColor: 'bg-secondary text-primary hover:bg-white transition-all',
        features: [
            'Unlimited Listings',
            'Top-Tier Global Ranking',
            'Featured Marketplace Slots',
            'Verified Badge Highlight',
            'Full Behavioral Intelligence'
        ],
        popular: true,
        trend: "Maximum Portfolio Visibility"
    }
];

export const SubscriptionPanel: React.FC = () => {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h3 className="text-3xl font-primary text-white">Monetization & Visibility</h3>
                    <p className="text-white/40 text-sm font-light tracking-wide max-w-lg">Upgrade your advisor profile to unlock advanced ranking algorithms and institutional-grade lead analytics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative bg-white/5 backdrop-blur-xl border ${plan.color} p-10 rounded-[3rem] space-y-10 group overflow-hidden`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 bg-secondary px-6 py-2 rounded-bl-3xl text-primary text-[9px] font-bold uppercase tracking-widest">
                                Most Recommend
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center ${plan.type === 'premium' ? 'text-secondary' : 'text-white/60'}`}>
                                <plan.icon className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-white text-xl font-primary">{plan.name}</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-primary text-white font-bold">{plan.price}</span>
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{plan.period}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-secondary" />
                                    </div>
                                    <span className="text-white/60 text-xs font-light tracking-wide">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {plan.trend && (
                            <div className="flex items-center gap-2 text-green-500 text-[9px] font-bold uppercase tracking-widest">
                                <TrendingUp className="w-3.5 h-3.5" /> {plan.trend}
                            </div>
                        )}

                        <button className={`w-full py-5 rounded-[1.5rem] font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${plan.btnColor}`}>
                            {plan.type === 'free' ? 'Current Plan' : `Upgrade to ${plan.name.split(' ')[0]}`}
                            {plan.type !== 'free' && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
