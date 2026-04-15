import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, Camera, Building, MapPin, Briefcase, Youtube, Check, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logo } from "../components/Logo";

export const VerifyAgent = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: "",
        whatsapp: "",
        serviceAreas: "",
        experience: "",
        bio: "",
        youtubeLink: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error: submitError } = await supabase
                .from("verification_requests")
                .insert({
                    user_id: user.id,
                    role: "agent",
                    status: "pending",
                    details: {
                        ...formData,
                        submitted_at: new Date().toISOString()
                    }
                });

            if (submitError) throw submitError;

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || "An error occurred during verification submission");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-3xl"
                >
                    <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-secondary/30">
                        <Check className="w-10 h-10 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-primary text-white mb-4">Application Received</h2>
                    <p className="text-white/60 font-light leading-relaxed mb-8">
                        Our compliance team will review your profile. You will be notified via email once your verification is complete.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-secondary text-primary py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex flex-col items-center text-center space-y-6">
                    <Logo />
                    <div className="flex items-center gap-12 pt-8">
                        {[
                            { label: "Account", status: "complete" },
                            { label: "Verification", status: "active" },
                            { label: "Go Live", status: "pending" }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${step.status === "complete" ? "bg-green-500 border-green-500 text-white" :
                                        step.status === "active" ? "bg-secondary border-secondary text-primary scale-110 shadow-[0_0_20px_rgba(198,167,94,0.3)]" :
                                            "border-white/20 text-white/40"
                                    }`}>
                                    {step.status === "complete" ? <Check className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                                </div>
                                <span className={`text-[8px] uppercase tracking-[0.2em] font-bold ${step.status === "active" ? "text-secondary" : "text-white/40"
                                    }`}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-primary text-white pt-8">Verify Your Agent Identity</h1>
                    <p className="text-white/40 max-w-xl font-light">
                        To maintain our high standards, all agents must undergo a verification process before they can list properties on Hamilton Property Center.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-[2.5rem] shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* ID & Photo Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> Government ID Upload
                                </label>
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-secondary transition-colors cursor-pointer group bg-white/[0.02]">
                                    <Upload className="w-8 h-8 text-white/20 group-hover:text-secondary transition-colors" />
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest text-center">Click or Drag ID Card <br /> (National ID, Drivers License, etc)</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-2">
                                    <Camera className="w-3 h-3" /> Headshot Photo
                                </label>
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-secondary transition-colors cursor-pointer group bg-white/[0.02]">
                                    <Upload className="w-8 h-8 text-white/20 group-hover:text-secondary transition-colors" />
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest text-center">Upload Professional Headshot</p>
                                </div>
                            </div>
                        </div>

                        {/* General Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Company / Agency Name</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Richard Homes Ltd"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">WhatsApp Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold">+234</span>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        required
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        placeholder="703 ..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-5 py-4 text-white focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Service Areas</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        name="serviceAreas"
                                        required
                                        value={formData.serviceAreas}
                                        onChange={handleInputChange}
                                        placeholder="Asaba, Lagos, Abuja..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Years of Experience</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="number"
                                        name="experience"
                                        required
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 5"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Short Bio / Professional Pitch</label>
                            <textarea
                                name="bio"
                                required
                                rows={4}
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself and your expertise..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1 flex items-center justify-between">
                                <span>YouTube Introduction Link (Optional)</span>
                                <span className="text-secondary/60 lowercase italic font-normal tracking-normal">+50% Approval Speed</span>
                            </label>
                            <div className="relative">
                                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="url"
                                    name="youtubeLink"
                                    value={formData.youtubeLink}
                                    onChange={handleInputChange}
                                    placeholder="https://youtube.com/..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs text-center rounded-xl">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-secondary text-primary py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50 group shadow-2xl shadow-secondary/10"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Verification Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
