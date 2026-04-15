import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { PropertyCard, Property } from "../components/PropertyCard";
import { SearchFilters } from "../components/SearchFilters";
import { Loader2, SearchX, ShieldAlert, Sparkles, TrendingUp, Clock, Crown, LayoutGrid, Zap, Activity } from "lucide-react";

export const PropertiesPage = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [highIntentProperties, setHighIntentProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<any>({
        location: "",
        minPrice: "",
        maxPrice: "",
        propertyType: "",
        verifiedOnly: true,
        hasVideo: false,
    });

    const fetchProperties = async (currentFilters: any) => {
        setLoading(true);
        setError(null);

        try {
            // Base Query with Advanced Behavior Signals
            let query = supabase
                .from("properties")
                .select(`
          *,
          agents:agent_id (
            id,
            company_name,
            verified,
            photo_url,
            subscription_tier
          )
        `)
                .eq("status", "approved");

            if (currentFilters.location) {
                query = query.ilike("location", `%${currentFilters.location}%`);
            }
            if (currentFilters.minPrice) query = query.gte("price", currentFilters.minPrice);
            if (currentFilters.maxPrice) query = query.lte("price", currentFilters.maxPrice);
            if (currentFilters.propertyType) query = query.eq("type", currentFilters.propertyType);
            if (currentFilters.hasVideo) query = query.eq("has_video", true);

            const { data, error: fetchError } = await query;
            if (fetchError) throw fetchError;

            // --- PHASE 5 PREDICTIVE RANKING ENGINE ---
            // rank_score = (engagement_depth * 0.3) + (dwell_time * 0.2) + (repeat_visits * 0.2) + (inquiry_intent * 0.2) + (subscription * 0.1)
            const calculateScore = (prop: any) => {
                let score = 0;

                // Behavioral Intelligence Scalars (Mocked or from user_activity_extended)
                const engagementDepth = (prop.scroll_depth_avg || 0) / 100; // 0-1
                const dwellTimeScore = Math.min(1, (prop.dwell_time_avg || 0) / 300); // 1.0 at 5 mins
                const repeatVisits = Math.min(1, (prop.repeat_visitor_count || 0) / 50);
                const inquiryIntent = Math.min(1, (prop.inquiry_count || 0) / 10);

                let subWeight = 0;
                if (prop.agents?.subscription_tier === 'premium') subWeight = 1.0;
                else if (prop.agents?.subscription_tier === 'pro') subWeight = 0.5;

                score = (engagementDepth * 0.3) + (dwellTimeScore * 0.2) + (repeatVisits * 0.2) + (inquiryIntent * 0.2) + (subWeight * 0.1);

                // Recency boost for marketplace liquidity
                const hoursOld = (new Date().getTime() - new Date(prop.created_at).getTime()) / (1000 * 3600);
                if (hoursOld < 24) score += 0.2; // Freshness window

                return score * 100; // Final Score scale 0-100+
            };

            const rawRanked = (data || [])
                .map(p => ({ ...p, rank_score: calculateScore(p) }))
                .sort((a, b) => b.rank_score - a.rank_score);

            // --- MARKETPLACE LIQUIDITY BALANCING (1 Featured every 5) ---
            const balancedResults: any[] = [];
            const featured = rawRanked.filter(p => p.is_featured);
            const regular = rawRanked.filter(p => !p.is_featured);

            let featIdx = 0;
            let regIdx = 0;

            while (regIdx < regular.length || featIdx < featured.length) {
                // Inject 1 featured
                if (featIdx < featured.length) {
                    balancedResults.push(featured[featIdx++]);
                }
                // Inject 4 organic/new
                for (let i = 0; i < 4 && regIdx < regular.length; i++) {
                    balancedResults.push(regular[regIdx++]);
                }
            }

            setProperties(balancedResults as unknown as Property[]);

            // Intelligent Categorization
            setFeaturedProperties(featured.slice(0, 3) as unknown as Property[]);
            setHighIntentProperties(rawRanked.filter(p => p.rank_score > 60).slice(0, 3) as unknown as Property[]);

        } catch (err: any) {
            console.error("Predictive Engine Error:", err);
            setError("Unable to sync marketplace liquidity. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties(filters);
    }, []);

    const handleSearch = (newFilters: any) => {
        setFilters(newFilters);
        fetchProperties(newFilters);
    };

    return (
        <main className="min-h-screen bg-primary pt-32 pb-24">
            {/* OS Status Bar */}
            <div className="container-custom mb-12">
                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-4 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white text-[9px] uppercase font-bold tracking-widest">Predictive Engine Online</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="text-white/40 text-[9px] uppercase font-bold tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 text-secondary" /> Liquidity Balanced: 1:5 Ratio
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-secondary" />
                        <span className="text-white text-[9px] uppercase font-bold tracking-widest">Marketplace Sentiment: Stable</span>
                    </div>
                </div>
            </div>

            <section className="container-custom mb-16 space-y-12">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-secondary" />
                            <span className="text-secondary text-[10px] uppercase tracking-[0.6em] font-bold">Hamilton Operating System</span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl text-white font-primary leading-[0.9] -tracking-wider"
                        >
                            Liquidity <span className="text-secondary italic">Control</span> <br /> & Pure Intent.
                        </motion.h1>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] max-w-sm space-y-4">
                        <div className="flex items-center gap-3 text-secondary">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Smart Distribution protocol</span>
                        </div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Hamilton OS enforces 1:5 liquidity ratios to ensure new organic assets receive peak exposure alongside sponsored highlights.
                        </p>
                    </div>
                </div>

                <SearchFilters onSearch={handleSearch} />
            </section>

            {/* Autonomous Intelligence Row: High Intent (Phase 5) */}
            {!loading && highIntentProperties.length > 0 && (
                <section className="container-custom mb-24 space-y-8">
                    <div className="flex items-center gap-4 text-secondary">
                        <Zap className="w-5 h-5" />
                        <h3 className="text-2xl font-primary text-white">High Intent Assets</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {highIntentProperties.map((prop) => (
                            <PropertyCard key={`high-intent-${prop.id}`} property={prop} />
                        ))}
                    </div>
                </section>
            )}

            {/* Main Feed with Distribution Logic */}
            <section className="container-custom">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-secondary" />
                            <span className="text-white text-[10px] uppercase font-bold tracking-widest">Balanced Distribution</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
                            <Clock className="w-4 h-4 text-white" />
                            <span className="text-white text-[10px] uppercase font-bold tracking-widest">Fresh Liquidity</span>
                        </div>
                    </div>
                    <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
                        {loading ? "Processing Distribution..." : "Liquidity Matrix Balanced"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="aspect-[4/3] bg-white/5 animate-pulse rounded-[2.5rem]" />
                                    <div className="h-6 w-2/3 bg-white/5 animate-pulse rounded-lg" />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    );
};
