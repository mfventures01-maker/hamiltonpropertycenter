import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    ChevronLeft,
    Bed,
    Bath,
    Square,
    ShieldCheck,
    MessageCircle,
    Heart,
    Share2,
    CheckCircle,
    Loader2,
    ArrowRight,
    Video,
    ExternalLink,
    ChevronRight,
    ChevronLeft as ChevronLeftIcon
} from "lucide-react";
import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";

export const PropertyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [inquiryLoading, setInquiryLoading] = useState(false);
    const [inquirySent, setInquirySent] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("properties")
                    .select(`
            *,
            agents:agent_id (
              id,
              company_name,
              photo_url,
              verified,
              bio,
              whatsapp
            )
          `)
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setProperty(data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    // --- USER INTELLIGENCE TRACKING (PHASE 5 ENHANCED) ---
    useEffect(() => {
        let startTime = Date.now();
        let maxScroll = 0;

        const handleScroll = () => {
            const h = document.documentElement,
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            if (percent > maxScroll) maxScroll = Math.floor(percent);
        };

        window.addEventListener('scroll', handleScroll);

        const trackActivity = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!id) return;

                // Initial View Log
                await supabase
                    .from("user_activity_extended")
                    .insert({
                        user_id: user?.id || null,
                        property_id: id,
                        action_type: 'view',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            device: navigator.userAgent
                        }
                    });

                // Periodic Heartbeat for Dwell Time
                const heartbeat = setInterval(async () => {
                    const dwellTime = Math.floor((Date.now() - startTime) / 1000);
                    await supabase
                        .from("user_activity_extended")
                        .update({
                            dwell_time: dwellTime,
                            scroll_depth: maxScroll
                        })
                        .match({ property_id: id, user_id: user?.id || null, action_type: 'view' });
                }, 10000); // Pulse every 10s

                return () => {
                    clearInterval(heartbeat);
                };

            } catch (err) {
                console.warn("Analytics Engine Error:", err);
            }
        };

        trackActivity();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    const handleInquiry = async () => {
        setInquiryLoading(true);
        try {
            // In a real app, we'd get the user ID from auth
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from("inquiries")
                .insert({
                    property_id: id,
                    agent_id: property.agent_id,
                    user_id: user?.id || null,
                    message: `I'm interested in ${property.title}. Please provide more details.`,
                });

            if (error) throw error;
            setInquirySent(true);

            // WhatsApp Redirect
            const whatsappMsg = encodeURIComponent(`I’m interested in this property on Hamilton Property Center: ${property.title} (ID: ${id})`);
            const whatsappUrl = `https://wa.me/${property.agents.whatsapp || '2347037936261'}?text=${whatsappMsg}`;
            window.open(whatsappUrl, "_blank");

        } catch (err) {
            console.error("Inquiry Error:", err);
        } finally {
            setInquiryLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Securing Property Data...</span>
        </div>
    );

    if (!property) return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center space-y-6">
            <h2 className="text-4xl font-primary text-white">Asset Not Found</h2>
            <Link to="/properties" className="text-secondary uppercase tracking-widest text-xs font-bold border-b border-secondary pb-1">Return to Marketplace</Link>
        </div>
    );

    const formattedPrice = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(property.price);

    return (
        <main className="min-h-screen bg-primary pt-32 pb-24">
            <div className="container-custom">
                {/* Navigation / Actions Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <Link to="/properties" className="flex items-center gap-2 text-white/40 hover:text-secondary transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
                        <ChevronLeft className="w-4 h-4" /> Back to Marketplace
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="bg-white/5 border border-white/10 p-3 rounded-full text-white hover:text-secondary transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="bg-white/5 border border-white/10 p-3 rounded-full text-white hover:text-secondary transition-all flex items-center gap-2 group">
                            <Heart className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">Save to Shortlist</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* LEFT CONTENT: Visuals & Details */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Gallery Section */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group"
                            >
                                <img
                                    src={property.images?.[activeImage] || "https://picsum.photos/seed/hpc-detail/1200/800"}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay Tags */}
                                <div className="absolute top-8 left-8 flex flex-col gap-3">
                                    <div className="bg-primary/80 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                        {property.type}
                                    </div>
                                    {property.has_video && (
                                        <div className="bg-secondary/90 backdrop-blur-md text-primary px-4 py-2 rounded-full flex items-center gap-2 border border-secondary/20 shadow-xl">
                                            <Video className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">High Definition Video Available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Arrows */}
                                {property.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronLeftIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setActiveImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {property.images?.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-secondary' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                )) || [...Array(4)].map((_, i) => (
                                    <div key={i} className="w-24 h-24 rounded-2xl bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-secondary text-xs font-bold uppercase tracking-[0.4em]">
                                    <MapPin className="w-4 h-4" /> {property.location}
                                </div>
                                <h1 className="text-5xl md:text-[5rem] text-white font-primary leading-tight font-medium">
                                    {property.title}
                                </h1>
                                <p className="text-secondary text-4xl md:text-5xl font-primary italic font-bold">
                                    {formattedPrice}
                                </p>
                            </div>

                            {/* Stats Bar */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5">
                                {[
                                    { icon: Bed, value: property.bedrooms || 5, label: "Bedrooms" },
                                    { icon: Bath, value: property.bathrooms || 6, label: "Bathrooms" },
                                    { icon: Square, value: property.sqft || "4,500", label: "Sq Ft" },
                                    { icon: ShieldCheck, value: "Verified", label: "Asset Status" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col items-start gap-3 border-l border-white/5 pl-6 first:border-0 first:pl-0">
                                        <stat.icon className="w-5 h-5 text-secondary" />
                                        <div className="space-y-1">
                                            <p className="text-white font-primary text-xl font-bold">{stat.value}</p>
                                            <p className="text-white/40 text-[8px] uppercase tracking-widest font-bold">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl text-white font-primary">The Opportunity</h3>
                                <p className="text-white/60 text-lg leading-relaxed font-light tracking-wide">
                                    {property.description}
                                </p>
                            </div>

                            {/* Features/Amenities */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6 pt-10 border-t border-white/5">
                                {(property.amenities || ["Smart Home System", "Wine Cellar", "Infiniti Pool", "24/7 Power Support", "Advanced Security", "Private Cinema"]).map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 text-white/80 group">
                                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                            <CheckCircle className="w-4 h-4 text-secondary" />
                                        </div>
                                        <span className="text-sm tracking-wide font-light">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: Conversion Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        <aside className="sticky top-32 space-y-8">

                            {/* Main Lead Card */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Logo className="scale-150 rotate-12" />
                                </div>

                                <div className="space-y-10 relative z-10">
                                    <div className="space-y-4">
                                        <span className="text-secondary text-[10px] uppercase font-bold tracking-[0.4em]">Investment Inquiry</span>
                                        <h3 className="text-3xl font-primary text-white">Secure This Asset</h3>
                                    </div>

                                    {inquirySent ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-secondary/10 border border-secondary/30 p-8 rounded-3xl text-center space-y-4"
                                        >
                                            <CheckCircle className="w-12 h-12 text-secondary mx-auto" />
                                            <h4 className="text-xl font-primary text-white">Inquiry Sent</h4>
                                            <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">An advisor will reach out shortly.</p>
                                            <button
                                                onClick={() => setInquirySent(false)}
                                                className="text-secondary text-[10px] uppercase font-bold border-b border-secondary pb-1"
                                            >
                                                Send Another Request
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-6">
                                            <button
                                                onClick={handleInquiry}
                                                disabled={inquiryLoading}
                                                className="w-full bg-secondary text-primary py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-white transition-all shadow-xl group"
                                            >
                                                {inquiryLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Inspection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                            </button>

                                            <button
                                                onClick={() => window.open(`https://wa.me/${property.agents.whatsapp || '2347037936261'}?text=I'm interested in ${property.title}`, "_blank")}
                                                className="w-full bg-white/5 border border-white/20 text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-green-500 hover:border-green-500 transition-all"
                                            >
                                                <MessageCircle className="w-5 h-5" /> Chat via WhatsApp
                                            </button>
                                        </div>
                                    )}

                                    <div className="pt-8 border-t border-white/5 text-center">
                                        <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold leading-relaxed">
                                            All inquiries are processed securely and routed to verified advisors for immediate attention.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Agent Profile Card */}
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={property.agents.photo_url || "https://picsum.photos/seed/hpc-agent/200/200"}
                                            alt={property.agents.company_name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        {property.agents.verified && (
                                            <div className="absolute -bottom-1 -right-1 bg-secondary p-1 rounded-full border-4 border-white">
                                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-primary font-bold uppercase tracking-widest text-xs">{property.agents.company_name}</p>
                                        <div className="flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                            Verified Advisor
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray/60 text-xs leading-relaxed font-light">
                                    {property.agents.bio || "Hamilton's elite property advisor specializing in luxury acquisitions and wealth preservation through real estate."}
                                </p>

                                <button className="w-full flex items-center justify-between border-b border-gray/10 pb-4 text-primary font-bold uppercase tracking-widest text-[10px] hover:text-secondary transition-colors group">
                                    View Agent Portfolio <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            {/* Market Context Sidebar */}
                            <div className="bg-secondary p-10 rounded-[2.5rem] shadow-2xl text-primary space-y-6">
                                <h4 className="font-primary text-2xl font-bold">Why This Asset?</h4>
                                <ul className="space-y-4">
                                    {[
                                        "Verified Legal Status",
                                        "High Capital Appreciation",
                                        "Global Standard Finishes",
                                        "Ready to Inhabit"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 font-bold uppercase tracking-widest text-[9px]">
                                            <CheckCircle className="w-4 h-4 text-primary/40" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
};

// Local Logo removed to utilize centralized premium component.
