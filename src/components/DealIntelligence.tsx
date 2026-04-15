import React from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Target,
    BarChart3,
    ArrowUpRight,
    ShieldCheck,
    TrendingDown,
    LayoutGrid
} from "lucide-react";

const recentDeals = [
    { id: '1', lead_name: 'John Doe', property_title: 'Villa de Gracia', value: '₦450,000,000', status: 'closed', time_to_close: '12 days' },
    { id: '2', lead_name: 'Sarah Smith', property_title: 'The Hamilton Heights', value: '₦1,200,000,000', status: 'negotiating', time_to_close: '18 days' },
    { id: '3', lead_name: 'Premium Asset Fund', property_title: 'Lakeview Penthouse', value: '₦850,000,000', status: 'closed', time_to_close: '8 days' },
];

export const DealIntelligence: React.FC = () => {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h3 className="text-3xl font-primary text-white">Deal Lifecycle Intelligence</h3>
                    <p className="text-white/40 text-sm font-light tracking-wide max-w-lg italic">Tracking institutional-grade asset movement across Hamilton's global network.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center px-10">
                        <p className="text-secondary text-2xl font-bold uppercase tracking-widest leading-none font-primary">₦2.5B</p>
                        <p className="text-white/30 text-[8px] uppercase font-bold tracking-[0.4em] mt-2">Revenue Potential</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-xl text-center px-10 text-primary">
                        <p className="text-primary text-2xl font-bold uppercase tracking-widest leading-none font-primary">12.6d</p>
                        <p className="text-primary/60 text-[8px] uppercase font-bold tracking-[0.4em] mt-2">Avg. Time to Close</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Deal Activity Feed */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-secondary" />
                            <h4 className="text-white text-xs font-bold uppercase tracking-widest">Global Asset Movement</h4>
                        </div>
                        <button className="text-secondary text-[9px] uppercase font-bold tracking-widest">View Historical Analytics</button>
                    </div>
                    <div className="space-y-4">
                        {recentDeals.map((deal) => (
                            <div key={deal.id} className="bg-white/5 border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center gap-8">
                                    <div className={`p-4 rounded-2xl ${deal.status === 'closed' ? 'bg-green-500/10 text-green-500' : 'bg-secondary/10 text-secondary'}`}>
                                        {deal.status === 'closed' ? <ShieldCheck className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white text-base font-bold uppercase tracking-widest leading-none">{deal.property_title}</p>
                                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{deal.lead_name} • {deal.time_to_close}</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-white text-xl font-primary font-bold">{deal.value}</p>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${deal.status === 'closed' ? 'text-green-500' : 'text-secondary'}`}>{deal.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Opportunity Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-10">
                        <div className="flex items-center gap-4">
                            <Trophy className="w-6 h-6 text-secondary" />
                            <h4 className="text-xl font-primary text-white">Conversion Efficiency</h4>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: 'Negotiation Power', val: '88%', trend: '+4%', icon: ArrowUpRight, color: 'text-green-500' },
                                { label: 'Lead Stickiness', val: '94%', trend: 'Peak', icon: ShieldCheck, color: 'text-secondary' },
                                { label: 'Missed Revenue', val: '₦120M', trend: '-22%', icon: TrendingDown, color: 'text-red-500' },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="space-y-1">
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-white/20 text-[9px] font-bold uppercase">{stat.trend}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl font-primary font-bold ${stat.color}`}>{stat.val}</p>
                                        <stat.icon className={`w-4 h-4 ml-auto mt-1 ${stat.color}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary border border-secondary/20 p-10 rounded-[3rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:rotate-45">
                            <Trophy className="w-32 h-32 text-secondary" />
                        </div>
                        <h4 className="text-white text-lg font-primary leading-tight font-bold">Hamilton <span className="text-secondary italic">Insights</span></h4>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">Top performing advisors close deals 4.2x faster by leveraging our behavior-driven ranking algorithms.</p>
                        <button className="w-full bg-white/5 hover:bg-white text-white hover:text-primary py-4 rounded-xl text-[9px] uppercase font-bold tracking-widest transition-all">Optimize My Cycle</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
