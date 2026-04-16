import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logo } from "./Logo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (err) throw err;
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (err) throw err;

      onClose();
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-custom shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-10 text-center space-y-6 flex flex-col items-center">
              <Logo />
              <div className="space-y-2">
                <h2 className="text-2xl font-primary text-white">Welcome Back</h2>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold">Elite Real Estate Network</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-custom text-xs text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray/20 py-4 rounded-custom font-bold uppercase tracking-widest text-xs hover:bg-gray/5 transition-all"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray/10"></div>
                </div>
                <span className="relative bg-white px-4 text-[10px] uppercase tracking-widest text-primary/40">Or continue with email</span>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-primary/60">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-primary/60">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-custom font-bold uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
              <div className="text-center space-y-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary/40">
                  Don't have an account? <Link to="/register" onClick={onClose} className="text-secondary hover:text-primary transition-colors">Create one</Link>
                </p>
                <button type="button" className="text-primary/40 text-[10px] hover:text-secondary transition-colors uppercase tracking-[0.2em]">
                  Forgot Password?
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
