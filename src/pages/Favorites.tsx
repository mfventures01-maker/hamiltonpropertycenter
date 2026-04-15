import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { PropertyCard, Property } from "../components/PropertyCard";
import { Heart, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export const FavoritesPage = () => {
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from("favorites")
                    .select(`
            *,
            properties (
              *,
              agents:agent_id (
                id,
                company_name,
                photo_url,
                verified
              )
            )
          `)
                    .eq("user_id", user.id);

                if (error) throw error;

                // Flatten the structural nesting from the join
                const flattened = (data || []).map((fav: any) => fav.properties);
                setFavorites(flattened as unknown as Property[]);
            } catch (err) {
                console.error("Favorites Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-primary pt-32 pb-24">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="h-px w-12 bg-secondary/50" />
                            <span className="text-secondary text-[10px] uppercase tracking-[0.6em] font-bold">Your Shortlist</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl text-white font-primary leading-tight"
                        >
                            Saved <span className="text-secondary italic">Assets.</span>
                        </motion.h1>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="bg-secondary/10 p-3 rounded-full">
                            <ShieldCheck className="w-5 h-5 text-secondary" />
                        </div>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold max-w-[140px] leading-relaxed">
                            Tracking your most preferred verified listings.
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {favorites.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 space-y-8 text-center"
                        >
                            <div className="relative">
                                <Heart className="w-20 h-20 text-white/5" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Heart className="w-10 h-10 text-secondary/20" />
                                </motion.div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-primary text-white">Shortlist is Empty</h3>
                                <p className="text-white/40 max-w-sm font-light">
                                    You haven't saved any assets yet. Start browsing our verified marketplace to build your portfolio.
                                </p>
                            </div>
                            <Link
                                to="/properties"
                                className="bg-secondary text-primary px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center gap-3 shadow-xl group"
                            >
                                Explore Marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {favorites.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};
