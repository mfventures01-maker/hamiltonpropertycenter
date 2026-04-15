import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    Users,
    Home,
    MessageSquare,
    ArrowUpRight,
    Clock,
    CheckCircle,
    MoreVertical,
    ChevronRight,
    TrendingUp,
    Loader2,
    ShieldCheck,
    Zap,
    Crown,
    LayoutDashboard,
    Target,
    Trophy,
    Activity,
    LayoutGrid,
    ShieldAlert,
    Brain
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { LeadPipeline } from "../components/LeadPipeline";
import { SubscriptionPanel } from "../components/SubscriptionPanel";
import { AutomationAlerts } from "../components/AutomationAlerts";
import { DealIntelligence } from "../components/DealIntelligence";
import { UpgradeModal } from "../components/UpgradeModal";

export const AgentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'deals' | 'subscription'>('overview');
    const [stats, setStats] = useState({
        views: "12,405",
        inquiries: "148",
        hotLeads: "42",
        closedDeals: "18",
        conversion: "14.5%"
    });

    const [leads, setLeads] = useState<any[]>([]);
    const [agentProfile, setAgentProfile] = useState<any>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [pendingFeature, setPendingFeature] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch Agent Profile
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                setAgentProfile(profile);

                // Fetch Inquiries (Pipeline leads)
                const { data: inquiries } = await supabase
                    .from("inquiries")
                    .select("*, properties(title)")
                    .eq("agent_id", user.id)
                    .order("created_at", { ascending: false });

                // Phase 5 Logic: Auto-escalation of stale leads
                const mappedLeads = (inquiries || []).map(inq => {
                    const createdAt = new Date(inq.created_at).getTime();
                    const now = new Date().getTime();
                    const hoursElapsed = (now - createdAt) / (1000 * 3600);

                    let status = inq.status || 'new';
                    let priority = inq.lead_priority || 2;

                    if (hoursElapsed > 48 && status === 'new') {
                        status = 'stale'; // Auto-system status
                        priority += 2; // Auto-escalation
                    } else if (hoursElapsed > 24 && status === 'new') {
                        // Mark for follow-up in UI context
                    }

                    return {
                        id: inq.id,
                        user_name: inq.user_name || "Premium Prospect",
                        property_title: inq.properties?.title || "Luxury Asset",
                        status: status,
                        priority: Math.min(5, priority),
                    };
                });

                setLeads(mappedLeads);

            } catch (err) {
                console.error("Dashboard Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleRestrictedAction = (feature: string) => {
        setPendingFeature(feature);
        setIsUpgradeModalOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-primary pt-32 pb-24">
            <div className="container-custom">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Brain className="w-5 h-5 text-secondary" />
                            <span className="text-secondary text-[10px] uppercase tracking-[0.6em] font-bold">Autonomous Intelligence OS</span>
                            <div className="h-px w-12 bg-white/10" />
                        </div>
                        <h1 className="text-6xl font-primary text-white">Marketplace <span className="text-secondary italic">OS</span></h1>
                        <p className="text-white/40 text-sm font-light tracking-wide max-w-lg">
                            Authorized Agent Access: <span className="text-white font-bold">{agentProfile?.full_name || 'Advisor'}</span>. Systems online.
                        </p>
                    </div>

                    {/* Enhanced Navigation Tabs */}
                    <div className="bg-white/5 p-2 rounded-3xl border border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'leads', label: 'Automated CRM', icon: Target },
                            { id: 'deals', label: 'Deal Intel', icon: ShieldCheck },
                            { id: 'subscription', label: 'Revenue', icon: Trophy },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-4 px-8 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-secondary text-primary' : 'text-white/40 hover:text-white'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-16"
                        >
                            {/* Core Automation Alerts (Phase 5) */}
                            <AutomationAlerts />

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { label: "Asset Movement", value: stats.views, icon: BarChart3, trend: "+12%" },
                                    { label: "Pipeline Velocity", value: stats.inquiries, icon: Target, trend: "+5%" },
                                    { label: "High Intent", value: stats.hotLeads, icon: Zap, trend: "+8%" },
                                    { label: "Settled Capital", value: stats.closedDeals, icon: Trophy, trend: "+15%" },
                                ].map((card, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-8 group transition-all hover:bg-white/[0.07] cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <div className="bg-secondary/10 p-4 rounded-2xl">
                                                <card.icon className="w-6 h-6 text-secondary" />
                                            </div>
                                            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                                                <ArrowUpRight className="w-3.5 h-3.5" /> {card.trend}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-4xl font-primary text-white font-bold">{card.value}</p>
                                            <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-bold">{card.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Revenue Readiness (Gated) */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-8 bg-white/5 border border-white/10 p-12 rounded-[3.5rem] space-y-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-3xl font-primary text-white">Intensity Mapping</h3>
                                        <button
                                            onClick={() => handleRestrictedAction("Enhanced Analytics")}
                                            className="bg-secondary/10 text-secondary px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all"
                                        >
                                            Unlock Behavioral Data
                                        </button>
                                    </div>
                                    <div className="h-64 flex items-end gap-6 pb-4">
                                        {[65, 85, 45, 95, 75, 55, 100].map((h, i) => (
                                            <div key={i} className="flex-1 space-y-4 text-center">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: i * 0.1, duration: 1 }}
                                                    className="w-full bg-gradient-to-t from-secondary/10 to-secondary rounded-t-2xl relative group cursor-pointer"
                                                >
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        <span className="text-secondary text-[10px] font-bold tracking-widest uppercase">{h}% Conversion</span>
                                                    </div>
                                                </motion.div>
                                                <span className="text-white/20 text-[8px] uppercase font-bold tracking-[0.3em]">Day {i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-4 bg-secondary p-12 rounded-[3.5rem] text-primary space-y-8 flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute -top-12 -right-12 p-8 opacity-10">
                                        <Crown className="w-48 h-48" />
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <Crown className="w-10 h-10" />
                                        <h4 className="text-3xl font-primary font-bold">Liquidity Control</h4>
                                        <p className="text-primary/70 text-xs font-bold leading-relaxed uppercase tracking-widest leading-loose">
                                            Your listings are currently subject to standard rotation rules. Upgrade for unlimited Featured exposure and AI-prioritized ranking slots.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('subscription')}
                                        className="w-full bg-primary text-white py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-primary transition-all shadow-2xl relative z-10"
                                    >
                                        Gain Global Priority
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'leads' && (
                        <motion.div
                            key="leads"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-primary text-white">Automated Lead CRM</h3>
                                    <p className="text-white/40 text-sm font-light tracking-wide italic">Intelligent follow-up rules triggered. Stale leads auto-escalated.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleRestrictedAction("Bulk Analytics Export")}
                                        className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-white/60 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                                    >
                                        Export Intel
                                    </button>
                                    <button className="bg-secondary text-primary px-8 py-4 rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-xl font-bold">Workflow Rules</button>
                                </div>
                            </div>

                            <LeadPipeline leads={leads} />
                        </motion.div>
                    )}

                    {activeTab === 'deals' && (
                        <motion.div
                            key="deals"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                        >
                            <DealIntelligence />
                        </motion.div>
                    )}

                    {activeTab === 'subscription' && (
                        <motion.div
                            key="subscription"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <SubscriptionPanel />
                        </motion.div>
                    )}
                </AnimatePresence>

                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    feature={pendingFeature}
                />
            </div>
        </main>
    );
};
