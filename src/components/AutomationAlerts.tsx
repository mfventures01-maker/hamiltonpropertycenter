import React from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Clock,
    Zap,
    ArrowRight,
    ShieldAlert,
    Users
} from "lucide-react";

interface LeadAlert {
    id: string;
    user_name: string;
    type: 'stale' | 'follow_up' | 'missed';
    time: string;
    details: string;
}

export const AutomationAlerts: React.FC = () => {
    const alerts: LeadAlert[] = [
        { id: '1', user_name: 'John Doe', type: 'follow_up', time: '24h elapsed', details: 'Awaiting initial contact' },
        { id: '2', user_name: 'Sarah Smith', type: 'stale', time: '48h inactive', details: 'Escalated priority' },
        { id: '3', user_name: 'Premium Corp', type: 'missed', time: 'Closed (Lost)', details: 'Competitor conversion' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Needs Follow-Up */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest">Needs Follow-Up</h4>
                    </div>
                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[8px] font-bold">3 Active</span>
                </div>
                <div className="space-y-4">
                    {alerts.filter(a => a.type === 'follow_up').map(alert => (
                        <div key={alert.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                            <div className="space-y-1">
                                <p className="text-white text-xs font-bold uppercase tracking-wider">{alert.user_name}</p>
                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{alert.time}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-secondary transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stale Leads Alert */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest">Stale Leads Alert</h4>
                    </div>
                    <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[8px] font-bold">1 Alert</span>
                </div>
                <div className="space-y-4">
                    {alerts.filter(a => a.type === 'stale').map(alert => (
                        <div key={alert.id} className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-center justify-between group cursor-pointer hover:bg-red-500/10 transition-all">
                            <div className="space-y-1">
                                <p className="text-white text-xs font-bold uppercase tracking-wider">{alert.user_name}</p>
                                <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">High Escalation</p>
                            </div>
                            <Zap className="w-4 h-4 text-red-500 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Analytics Insight */}
            <div className="bg-secondary text-primary p-8 rounded-[2.5rem] space-y-8">
                <div className="space-y-2">
                    <h4 className="text-2xl font-primary font-bold">Response Pulse</h4>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-primary font-bold">14.2m</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest pb-2 text-primary/60">Avg Response Time</span>
                    </div>
                </div>
                <div className="space-y-4 border-t border-primary/10 pt-6">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                        <span>Efficiency Score</span>
                        <span>92%</span>
                    </div>
                    <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary w-[92%] h-full" />
                    </div>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-70">
                    Fastest advisors capture 74% more market share in Hamilton's ecosystem.
                </p>
            </div>
        </div>
    );
};
