import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, User, Briefcase, Building2, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type AccountType = "buyer" | "agent" | "developer";

export const RegisterForm = () => {
    const [accountType, setAccountType] = useState<AccountType>("buyer");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length >= 8) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        setPasswordStrength(score);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "password") calculateStrength(value);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (passwordStrength < 50) {
            setError("Please use a stronger password");
            return;
        }

        setLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                        role: accountType,
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                // Insert into profiles table
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        id: authData.user.id,
                        full_name: formData.fullName,
                        phone: formData.phone,
                        role: accountType,
                        verified: false,
                    });

                if (profileError) throw profileError;

                // Smart Redirects
                if (accountType === "buyer") navigate("/dashboard");
                else if (accountType === "agent") navigate("/verify-agent");
                else navigate("/verify-developer");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl"
        >
            <div className="flex items-center gap-2 mb-8">
                <div className="bg-secondary/20 text-secondary px-3 py-1 rounded-full flex items-center gap-1.5 border border-secondary/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Registration</span>
                </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-primary text-white mb-2">Create Your Account</h2>
            <p className="text-white/60 text-sm mb-10 font-light tracking-wide">Enter your details to join Hamilton Property Center.</p>

            <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10"
                            placeholder="e.g. Richard Udeh"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10"
                            placeholder="+234 ..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10"
                        placeholder="richard@example.com"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 bottom-4 text-white/40 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {/* Password Strength Meter */}
                        <div className="absolute -bottom-1 left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${passwordStrength}%` }}
                                className={`h-full ${passwordStrength <= 25 ? 'bg-red-500' : passwordStrength <= 50 ? 'bg-orange-500' : passwordStrength <= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Account Type Selector */}
                <div className="space-y-4 pt-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Who are you?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(["buyer", "agent", "developer"] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setAccountType(type)}
                                className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all group ${accountType === type
                                        ? "bg-secondary border-secondary text-primary"
                                        : "bg-white/5 border-white/10 text-white hover:border-white/20"
                                    }`}
                            >
                                {accountType === type && (
                                    <motion.div layoutId="activeCheck" className="absolute top-3 right-3">
                                        <Check className="w-4 h-4" />
                                    </motion.div>
                                )}
                                <div className={`p-2 rounded-lg mb-3 ${accountType === type ? 'bg-primary/10' : 'bg-white/5'}`}>
                                    {type === "buyer" && <User className="w-4 h-4" />}
                                    {type === "agent" && <Briefcase className="w-4 h-4" />}
                                    {type === "developer" && <Building2 className="w-4 h-4" />}
                                </div>
                                <span className="text-sm font-bold capitalize">{type}</span>
                                <span className={`text-[10px] mt-1 ${accountType === type ? 'text-primary/60' : 'text-white/40'}`}>
                                    {type === "buyer" ? "Looking for property" : type === "agent" ? "I want to list" : "I market projects"}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Benefits */}
                <motion.div
                    key={accountType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-secondary/5 border border-secondary/20 p-6 rounded-2xl"
                >
                    <h4 className="text-secondary text-[10px] uppercase tracking-widest font-bold mb-4">Membership Benefits</h4>
                    <ul className="space-y-3">
                        {(accountType === "buyer" ? ["Browse trusted listings", "Contact verified agents", "Save searches"] :
                            accountType === "agent" ? ["Apply for verification", "Premium portfolio page", "Receive buyer leads", "QR identity profile"] :
                                ["Promote large projects", "Generate investor leads", "Featured branding", "Analytics dashboard"]
                        ).map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/80 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-primary py-5 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 group"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Secure Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                </button>

                <div className="text-center">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Already have an account? </span>
                    <Link to="/login" className="text-secondary text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors">Sign In</Link>
                </div>

                <p className="text-[10px] text-white/20 text-center leading-relaxed">
                    We protect buyers by verifying professionals before listings go live. <br /> Only verified professionals can publish listings.
                </p>
            </form>
        </motion.div>
    );
};
