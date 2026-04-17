import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronRight, MapPin, Home as HomeIcon, Briefcase, Info, Mail, User, Eye, Check, Phone, MessageCircle, Instagram, Facebook, Linkedin } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { PropertyCard } from "./components/PropertyCard";
import { ServiceCard } from "./components/ServiceCard";
import { LoginModal } from "./components/LoginModal";
import { SupabaseProvider, useSupabase } from "./context/SupabaseContext";
import { supabase } from "./lib/supabase";
import { LoadingScreen } from "./components/LoadingScreen";
import Logo from "./components/Logo";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { lazyRetry } from "./lib/lazyRetry";

const AdminDashboard = lazyRetry(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const PropertyDetailsPage = lazyRetry(() => import('./pages/PropertyDetails').then(m => ({ default: m.PropertyDetailsPage })));
const AgentDashboard = lazyRetry(() => import('./pages/AgentDashboard').then(m => ({ default: m.AgentDashboard })));
const FavoritesPage = lazyRetry(() => import('./pages/Favorites').then(m => ({ default: m.FavoritesPage })));

// New Onboarding Pages
const Register = lazyRetry(() => import('./pages/Register').then(m => ({ default: m.Register })));
const VerifyAgent = lazyRetry(() => import('./pages/VerifyAgent').then(m => ({ default: m.VerifyAgent })));
const PropertiesPage = lazyRetry(() => import('./pages/Properties').then(m => ({ default: m.PropertiesPage })));

// --- COMPONENTS ---

const Header = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  const { user, profile, signOut } = useSupabase();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-8 lg:px-16 xl:px-24 py-10 flex items-center justify-between",
        isScrolled ? "bg-primary/80 backdrop-blur-xl py-6 shadow-2xl border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-12">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden xl:flex items-center gap-8 text-white/80 font-secondary text-sm uppercase tracking-widest">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
          <Link to="/services" className="hover:text-secondary transition-colors">Services</Link>
          <Link to="/locations" className="hover:text-secondary transition-colors">Locations</Link>
          <Link to="/insights" className="hover:text-secondary transition-colors">Insights</Link>
          <Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden lg:flex items-center">
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties, locations..."
                  className="bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-10 text-white text-xs focus:outline-none focus:border-secondary w-full backdrop-blur-md"
                />
                <button type="submit" className="absolute right-3 text-white/60 hover:text-secondary transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white/80 hover:text-secondary transition-colors p-2"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </AnimatePresence>
        </div>

        {user ? (
          <Link to="/profile" className="flex items-center gap-3 text-white group">
            <div className="w-8 h-8 bg-secondary rounded-full overflow-hidden flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user.email?.[0].toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:block leading-none group-hover:text-secondary transition-colors">{profile?.full_name || user.email?.split('@')[0]}</span>
              <span className="text-[8px] uppercase tracking-widest text-secondary/60 hidden lg:block">View Profile</span>
            </div>
          </Link>
        ) : (
          <button
            onClick={onOpenLogin}
            className="hidden lg:flex items-center gap-2 text-white/80 hover:text-secondary transition-colors uppercase tracking-widest text-xs font-bold"
          >
            <User className="w-4 h-4" /> Sign In
          </button>
        )}
        <button className="hidden lg:block bg-[#CBA34D] text-primary px-8 py-3 rounded-full font-secondary text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl">
          Schedule Consultation
        </button>
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-primary p-6 flex flex-col gap-6 md:hidden border-t border-white/10"
          >
            <form onSubmit={handleSearch} className="relative flex items-center mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="bg-white/10 border border-white/20 rounded-full py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-secondary w-full"
              />
              <button type="submit" className="absolute right-4 text-white/60">
                <Search className="w-5 h-5" />
              </button>
            </form>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-primary">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-primary">About</Link>
            <Link to="/services" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-primary">Services</Link>
            <Link to="/locations" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-primary">Locations</Link>
            <Link to="/insights" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-primary">Insights</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-primary">Contact</Link>
            {user ? (
              <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="text-white text-lg font-primary text-left">Sign Out</button>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); onOpenLogin(); }}
                className="text-white text-lg font-primary text-left"
              >
                Sign In
              </button>
            )}
            <button className="bg-secondary text-primary px-6 py-3 rounded-custom font-secondary text-sm uppercase tracking-widest font-bold">
              Schedule Consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-primary text-white py-24 border-t border-white/5">
    <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="space-y-8">
        <Logo />
        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
          Redefining the standards of global real estate through strategic excellence and unwavering integrity.
        </p>
        <div className="flex gap-4">
          {[
            { icon: Instagram, label: "Instagram" },
            { icon: Facebook, label: "Facebook" },
            { icon: Linkedin, label: "LinkedIn" }
          ].map((social, i) => (
            <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all cursor-pointer" aria-label={social.label}>
              <social.icon className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-primary text-lg mb-8 text-secondary uppercase tracking-widest text-xs font-bold">Company</h4>
        <ul className="space-y-4 text-white/40 text-sm">
          <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
          <li><Link to="/careers" className="hover:text-secondary transition-colors">Careers</Link></li>
          <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
          <li><Link to="/insights" className="hover:text-secondary transition-colors">Insights</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-primary text-lg mb-8 text-secondary uppercase tracking-widest text-xs font-bold">Locations</h4>
        <ul className="space-y-4 text-white/40 text-sm">
          <li><Link to="/locations" className="hover:text-secondary transition-colors">Okpanam</Link></li>
          <li><Link to="/locations" className="hover:text-secondary transition-colors">GRA Asaba</Link></li>
          <li><Link to="/locations" className="hover:text-secondary transition-colors">Ibusa</Link></li>
          <li><Link to="/locations" className="hover:text-secondary transition-colors">Oshimili North</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-primary text-lg mb-8 text-secondary uppercase tracking-widest text-xs font-bold">Services</h4>
        <ul className="space-y-4 text-white/40 text-sm">
          <li><Link to="/services" className="hover:text-secondary transition-colors">Property Acquisition</Link></li>
          <li><Link to="/services" className="hover:text-secondary transition-colors">Investment Advisory</Link></li>
          <li><Link to="/services" className="hover:text-secondary transition-colors">Land Verification</Link></li>
          <li><Link to="/services" className="hover:text-secondary transition-colors">Asset Management</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-primary text-lg mb-8 text-secondary uppercase tracking-widest text-xs font-bold">Office</h4>
        <ul className="space-y-4 text-white/40 text-sm">
          <li>SF- 02 La Jonic off Okpanam road Asaba, Delta State</li>
          <li>Lagos, Nigeria</li>
          <li>London, United Kingdom</li>
          <li>Dubai, UAE</li>
          <li className="pt-4 text-secondary font-bold">+234 703 793 6261</li>
        </ul>
      </div>
    </div>
    <div className="container-custom mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] tracking-[0.2em] uppercase font-bold">
      <span>&copy; {new Date().getFullYear()} Hamilton Property Center.</span>
      <div className="flex gap-8">
        <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
        <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
        <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
      </div>
    </div>
  </footer>
);

// --- PAGES ---

const Home = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const { loading: isAuthReady } = useSupabase();

  useEffect(() => {
    if (isAuthReady) return;

    const fetchProps = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) console.error("Supabase Error: ", error);
      else if (data) setProperties(data);
    };

    fetchProps();
  }, [isAuthReady]);

  const [leadForm, setLeadForm] = useState({ fullName: "", email: "" });
  const [leadErrors, setLeadErrors] = useState({ fullName: "", email: "" });
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = { fullName: "", email: "" };
    let isValid = true;

    if (!leadForm.fullName.trim()) {
      errors.fullName = "Full name is required";
      isValid = false;
    }
    if (!leadForm.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(leadForm.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    setLeadErrors(errors);
    if (isValid) {
      setLeadSuccess(true);
      setLeadForm({ fullName: "", email: "" });
      setTimeout(() => setLeadSuccess(false), 5000);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          {/* Enhanced Overlay: Deep Navy to Transparent */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/20 to-transparent z-10" />
          {/* High-Contrast Nav Protection Gradient */}
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-primary/40 z-10" />
          <img
            src="/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-20 container-custom w-full max-w-7xl px-8 flex flex-col items-center text-center">
          <div className="space-y-12 max-w-5xl">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center gap-6 mb-4"
              >
                <div className="h-px w-10 bg-secondary/40" />
                <span className="text-secondary text-[10px] uppercase tracking-[0.6em] font-bold">Trusted Excellence in Nigeria</span>
                <div className="h-px w-10 bg-secondary/40" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl md:text-[7rem] text-white font-primary leading-[1.1] md:leading-[1.1] mb-8 tracking-tighter font-medium drop-shadow-lg"
              >
                Real Estate Excellence <br /> <span className="italic font-normal text-secondary/90">Redefined in Asaba.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="space-y-12"
            >
              <p className="text-white text-lg md:text-xl font-secondary tracking-widest max-w-3xl mx-auto leading-relaxed font-light bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                Hamilton Property Center is defining the future of property investment through <span className="text-white font-bold italic drop-shadow-md">transparency, luxury, and global standards.</span>
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4">
                <button className="bg-white text-primary px-16 py-6 rounded-full font-secondary text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-all w-full md:w-auto shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:-translate-y-1 duration-300">
                  Explore Properties
                </button>
                <button className="border border-white bg-transparent text-white px-16 py-6 rounded-full font-secondary text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-primary transition-all w-full md:w-auto hover:-translate-y-1 duration-300">
                  Our Services
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Global Presence Center Label */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-40">
          <span className="text-white text-[9px] uppercase tracking-[0.8em] font-bold mb-2">Global Presence</span>
          <div className="h-12 w-px bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white py-16 border-b border-gray/5">
        <div className="container-custom flex flex-wrap items-center justify-between gap-12 opacity-20 grayscale hover:opacity-40 transition-opacity duration-500">
          <span className="text-xl font-primary tracking-widest">FORBES</span>
          <span className="text-xl font-primary tracking-widest">VOGUE</span>
          <span className="text-xl font-primary tracking-widest">BLOOMBERG</span>
          <span className="text-xl font-primary tracking-widest">REUTERS</span>
          <span className="text-xl font-primary tracking-widest">FINANCIAL TIMES</span>
        </div>
      </section>

      {/* Section 1: The Firm (Split Layout) */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="absolute -top-20 -left-20 text-[20rem] font-primary text-gray/5 leading-none select-none">01</div>
            <img
              src="https://picsum.photos/seed/modern-office-building-luxury-real-estate/1000/1200"
              alt="The Firm"
              className="rounded-custom shadow-2xl w-full aspect-[4/5] object-cover relative z-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 bg-secondary p-12 rounded-custom shadow-2xl z-20 hidden md:block">
              <p className="text-primary text-5xl font-primary mb-2">15+</p>
              <p className="text-primary/60 text-[10px] uppercase tracking-[0.4em] font-bold">Years of Excellence</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <span className="text-secondary text-xs uppercase tracking-[0.6em] font-bold">The Institution</span>
              <h2 className="text-5xl md:text-7xl text-primary leading-[0.9] font-primary">Redefining <br /> Real Estate <br /> Standards.</h2>
            </div>
            <p className="text-gray text-xl leading-relaxed font-light">
              Hamilton Property Center is not just a real estate firm; we are a strategic institution dedicated to the preservation and growth of wealth through property.
            </p>
            <p className="text-gray/60 text-lg leading-relaxed">
              Our approach is rooted in deep market intelligence, rigorous legal verification, and an unwavering commitment to our clients' long-term success in the Asaba market and beyond.
            </p>
            <div className="pt-8">
              <button className="group flex items-center gap-4 text-primary font-bold uppercase tracking-[0.4em] text-xs hover:text-secondary transition-colors">
                Discover Our Story <div className="w-12 h-px bg-primary group-hover:w-20 group-hover:bg-secondary transition-all" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Global Reach (Stats) */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        </div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
            {[
              { label: "Global Offices", value: "04", sub: "Lagos, Asaba, London, Dubai" },
              { label: "Assets Managed", value: "$250M+", sub: "Strategic property portfolios" },
              { label: "Verified Land", value: "100%", sub: "Zero legal disputes recorded" },
              { label: "Client Retention", value: "98%", sub: "Long-term wealth partners" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="space-y-6 border-l border-white/10 pl-8"
              >
                <span className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold">{stat.label}</span>
                <p className="text-6xl md:text-8xl font-primary leading-none">{stat.value}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Prime Locations (Gallery) */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div className="space-y-6">
              <span className="text-secondary text-xs uppercase tracking-[0.6em] font-bold">The Portfolio</span>
              <h2 className="text-5xl md:text-7xl text-primary font-primary leading-none">Prime <br /> Locations.</h2>
            </div>
            <p className="text-gray/60 text-lg max-w-md text-right font-light">
              We focus exclusively on high-growth micro-locations in Asaba that offer the highest appreciation potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Okpanam", desc: "The Future of Residential Living", img: "https://picsum.photos/seed/modern-residential-development-asaba/1000/1200" },
              { name: "GRA Asaba", desc: "Elite Neighborhood & Secure Assets", img: "https://picsum.photos/seed/luxury-villa-gra-asaba/1000/1200" },
              { name: "Ibusa", desc: "Strategic Commercial Corridor", img: "https://picsum.photos/seed/commercial-real-estate-development-nigeria/1000/1200" },
            ].map((loc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative overflow-hidden aspect-[3/4] cursor-pointer"
              >
                <img src={loc.img} alt={loc.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 p-12 space-y-4 w-full">
                  <div className="h-px w-12 bg-secondary group-hover:w-full transition-all duration-700" />
                  <h3 className="text-4xl font-primary text-white">{loc.name}</h3>
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-700">{loc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: CEO/Founder (Split Layout) */}
      <section className="py-32 bg-gray/5 overflow-hidden">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-12 order-2 lg:order-1"
          >
            <div className="space-y-6">
              <span className="text-secondary text-xs uppercase tracking-[0.6em] font-bold">Leadership</span>
              <h2 className="text-5xl md:text-7xl text-primary leading-[0.9] font-primary">Precision. <br /> Strategy. <br /> Results.</h2>
            </div>
            <p className="text-gray text-xl leading-relaxed font-light italic">
              "Our mission is to provide a secure bridge for global investors to access the immense potential of the Nigerian real estate market, starting with the strategic hub of Asaba."
            </p>
            <div className="space-y-2">
              <p className="text-primary font-bold uppercase tracking-[0.2em] text-sm">Mr. Richard Udeh</p>
              <p className="text-secondary text-xs uppercase tracking-[0.4em] font-bold">CEO & Founder</p>
            </div>
            <div className="pt-8">
              <button className="bg-primary text-white px-12 py-5 rounded-custom font-secondary text-xs uppercase tracking-[0.2em] font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl">
                Read Executive Bio
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="absolute -top-20 -right-20 text-[20rem] font-primary text-primary/5 leading-none select-none">04</div>
            <img
              src="https://picsum.photos/seed/executive-man-richard-udeh-real-estate/1000/1200"
              alt="Mr. Richard Udeh"
              className="rounded-custom shadow-2xl w-full aspect-[4/5] object-cover relative z-10"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Section 5: Verified Listings (Grid) */}
      <section className="py-32 bg-primary text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div className="space-y-6">
              <span className="text-secondary text-xs uppercase tracking-[0.6em] font-bold">The Listings</span>
              <h2 className="text-5xl md:text-7xl font-primary leading-none">Verified <br /> Assets.</h2>
            </div>
            <button className="group flex items-center gap-4 text-secondary font-bold uppercase tracking-[0.4em] text-xs hover:text-white transition-colors">
              View All Listings <div className="w-12 h-px bg-secondary group-hover:w-20 group-hover:bg-white transition-all" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={{
                  ...prop,
                  agents: prop.agents || {
                    company_name: "Hamilton Verified",
                    verified: true
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Insights (Cards) */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <div className="text-left mb-24 space-y-6">
            <span className="text-secondary text-xs uppercase tracking-[0.6em] font-bold">Intelligence</span>
            <h2 className="text-5xl md:text-7xl text-primary font-primary">Market Insights.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Complete Guide to Real Estate Investment in Asaba (2026)", date: "April 01, 2026", image: "https://picsum.photos/seed/real-estate-market-analysis-luxury/1000/700", category: "Pillar Page" },
              { title: "Cost of Land in Asaba 2026: Market Breakdown", date: "March 28, 2026", image: "https://picsum.photos/seed/land-verification-nigeria/1000/700", category: "Market Update" },
              { title: "How to Verify Land in Nigeria: The Ultimate Checklist", date: "March 25, 2026", image: "https://picsum.photos/seed/modern-home-interior-luxury/1000/700", category: "Legal Guide" },
            ].map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer space-y-8"
              >
                <div className="overflow-hidden aspect-[16/10] relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6 bg-secondary text-primary px-4 py-1 text-[10px] uppercase font-bold tracking-[0.2em]">
                    {article.category}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold">{article.date}</p>
                  <h3 className="text-3xl font-primary text-primary group-hover:text-secondary transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <div className="pt-4">
                    <Link to="/insights" className="inline-flex items-center gap-4 text-primary font-bold uppercase tracking-[0.4em] text-[10px] hover:text-secondary transition-colors">
                      Read More <div className="w-8 h-px bg-primary group-hover:w-12 group-hover:bg-secondary transition-all" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Conversion (Lead Magnet) */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary -skew-x-12 translate-x-1/4" />
        </div>
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-secondary text-xs uppercase tracking-[0.6em] font-bold">Next Steps</span>
              <h2 className="text-5xl md:text-7xl font-primary leading-[0.9]">Secure Your <br /> Future in <br /> Asaba.</h2>
            </div>
            <p className="text-white/50 text-xl leading-relaxed font-light">
              Join an elite group of investors receiving weekly market intelligence and exclusive off-market opportunities.
            </p>
            <div className="flex flex-wrap gap-8">
              <button className="bg-secondary text-primary px-12 py-5 rounded-custom font-secondary text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-2xl">
                Request Portfolio
              </button>
              <button className="border border-white/20 text-white px-12 py-5 rounded-custom font-secondary text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-primary transition-all">
                Book Consultation
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-16 rounded-custom shadow-2xl text-primary space-y-10 relative"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-primary">Investment Guide</h3>
              <p className="text-gray/60 text-sm font-light">Receive our comprehensive 2026 Asaba Market Analysis directly to your inbox.</p>
            </div>
            {leadSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 p-8 rounded-custom text-green-800 text-center space-y-4 border border-green-100"
              >
                <Check className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-bold uppercase tracking-widest text-xs">Thank you!</p>
                <p className="text-sm">The guide has been sent to your email.</p>
              </motion.div>
            ) : (
              <form className="space-y-8" onSubmit={handleLeadSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray/40">Full Name</label>
                  <input
                    type="text"
                    value={leadForm.fullName}
                    onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    className={cn(
                      "w-full border-b py-4 focus:outline-none transition-colors bg-transparent",
                      leadErrors.fullName ? "border-red-500" : "border-gray/20 focus:border-secondary"
                    )}
                  />
                  {leadErrors.fullName && <p className="text-[8px] text-red-500 uppercase font-bold tracking-widest">{leadErrors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray/40">Email Address</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className={cn(
                      "w-full border-b py-4 focus:outline-none transition-colors bg-transparent",
                      leadErrors.email ? "border-red-500" : "border-gray/20 focus:border-secondary"
                    )}
                  />
                  {leadErrors.email && <p className="text-[8px] text-red-500 uppercase font-bold tracking-widest">{leadErrors.email}</p>}
                </div>
                <button type="submit" className="w-full bg-primary text-white py-6 rounded-custom font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-secondary hover:text-primary transition-all shadow-xl">
                  Download Guide
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/2347037936261"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-12 left-12 z-[100] bg-green-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group opacity-40 hover:opacity-100"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-4 transition-all duration-500 whitespace-nowrap text-xs uppercase tracking-widest font-bold">Chat with an Advisor</span>
      </a>
    </main>
  );
};

const AboutPage = () => (
  <main className="pt-32 pb-24">
    <section className="container-custom space-y-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl text-primary leading-tight">Strategic Excellence. Global Reach.</h1>
          <div className="w-20 h-1 bg-secondary" />
          <p className="text-gray text-lg leading-relaxed">
            Founded on the principles of precision and integrity, Hamilton Property Center has emerged as a leader in the global luxury real estate market. Our firm serves as a strategic partner to high-net-worth individuals, families, and institutional investors seeking exceptional property assets and expert advisory.
          </p>
          <p className="text-gray text-lg leading-relaxed">
            With a presence in major global financial hubs, we provide our clients with unparalleled access to off-market opportunities and deep market intelligence. Our team of seasoned advisors brings decades of collective experience in real estate strategy, financial analysis, and risk management.
          </p>
        </div>
        <div className="relative">
          <img src="https://picsum.photos/seed/richard-udeh-ceo-hamilton-property/800/1000" alt="Mr. Richard Udeh - CEO" className="rounded-custom shadow-2xl w-full aspect-[4/5] object-cover" referrerPolicy="no-referrer" />
          <div className="absolute -bottom-10 -left-10 bg-secondary p-10 rounded-custom shadow-2xl hidden md:block">
            <p className="text-primary text-4xl font-primary mb-2">CEO</p>
            <p className="text-primary/60 text-xs uppercase tracking-widest">Mr. Richard Udeh</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20">
        {[
          { title: "Our Vision", desc: "To be the most trusted strategic partner for global real estate investment, defined by excellence and discretion." },
          { title: "Our Mission", desc: "To empower our clients with data-driven insights and exclusive access to the world's most exceptional property assets." },
          { title: "Our Values", desc: "Integrity, Precision, Discretion, and a relentless pursuit of results for our distinguished clientele." },
        ].map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-2xl text-primary font-primary">{item.title}</h3>
            <p className="text-gray text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);

const ServicesPage = () => (
  <main className="pt-32 pb-24">
    <section className="container-custom space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl text-primary">Our Services</h1>
        <div className="w-20 h-1 bg-secondary mx-auto" />
        <p className="text-gray text-lg">
          Comprehensive advisory and investment solutions tailored for the sophisticated global investor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          {
            title: "Strategy Consulting",
            desc: "We develop comprehensive strategic frameworks for complex real estate portfolios, aligning property assets with broader financial goals and market dynamics.",
            image: "https://picsum.photos/seed/strategic-consulting-real-estate/800/500"
          },
          {
            title: "Financial Advisory",
            desc: "Our experts provide sophisticated guidance on capital structures, investment financing, and fiscal optimization for high-value property transactions.",
            image: "https://picsum.photos/seed/financial-advisory-luxury/800/500"
          },
          {
            title: "Investment Solutions",
            desc: "Gain exclusive access to off-market luxury properties and institutional-grade real estate opportunities across the globe's most desirable locations.",
            image: "https://picsum.photos/seed/investment-solutions-modern/800/500"
          },
          {
            title: "Risk Management",
            desc: "We provide rigorous risk assessment and mitigation strategies, ensuring our clients navigate the complexities of global property markets with security.",
            image: "https://picsum.photos/seed/risk-management-security/800/500"
          },
        ].map((service, idx) => (
          <div key={idx} className="group overflow-hidden rounded-custom border border-gray/10 hover:shadow-2xl transition-all">
            <div className="aspect-video overflow-hidden">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="p-10 space-y-4">
              <h3 className="text-3xl text-primary font-primary">{service.title}</h3>
              <p className="text-gray leading-relaxed">{service.desc}</p>
              <button className="text-secondary font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

const LocationsPage = () => (
  <main className="pt-32 pb-24">
    <section className="container-custom space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl text-primary font-primary">Prime Locations in Asaba</h1>
        <div className="w-20 h-1 bg-secondary mx-auto" />
        <p className="text-gray text-lg">
          We specialize in high-growth micro-locations across Asaba and Oshimili North.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          {
            name: "Okpanam",
            desc: "Okpanam is one of the fastest-growing residential and commercial hubs in Asaba. Its proximity to the airport and major developments makes it a prime target for land investment.",
            features: ["Rapid Appreciation", "New Infrastructure", "Residential Hub"],
            img: "https://picsum.photos/seed/okpanam-asaba-aerial/800/500"
          },
          {
            name: "GRA Asaba",
            desc: "The Government Reserved Area (GRA) remains the most prestigious and secure neighborhood in Asaba. Ideal for luxury residential builds and high-value property holdings.",
            features: ["Elite Security", "Premium Titles", "High Demand"],
            img: "https://picsum.photos/seed/gra-asaba-luxury-street/800/500"
          },
          {
            name: "Ibusa",
            desc: "Ibusa offers incredible value for long-term investors. With the expansion of Asaba, Ibusa is becoming a key satellite town with massive potential for land banking.",
            features: ["Land Banking", "Future Growth", "Affordable Entry"],
            img: "https://picsum.photos/seed/ibusa-asaba-development/800/500"
          },
          {
            name: "Oshimili North",
            desc: "The broader Oshimili North region is the engine room of Asaba's expansion. We help you navigate the various communities to find verified, high-ROI opportunities.",
            features: ["Strategic Expansion", "Verified Titles", "Diverse Options"],
            img: "https://picsum.photos/seed/oshimili-north-real-estate/800/500"
          },
        ].map((loc, idx) => (
          <div key={idx} className="group overflow-hidden rounded-custom border border-gray/10 hover:shadow-2xl transition-all bg-white">
            <div className="aspect-video overflow-hidden">
              <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="p-10 space-y-6">
              <h3 className="text-3xl text-primary font-primary">{loc.name}</h3>
              <p className="text-gray leading-relaxed">{loc.desc}</p>
              <div className="flex flex-wrap gap-3">
                {loc.features.map((f, i) => (
                  <span key={i} className="bg-secondary/10 text-primary text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm">
                    {f}
                  </span>
                ))}
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-custom text-xs uppercase tracking-widest font-bold hover:bg-secondary hover:text-primary transition-all">
                View Properties in {loc.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

const InsightsPage = () => (
  <main className="pt-32 pb-24">
    <section className="container-custom space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl text-primary font-primary">Insights & Investment Guides</h1>
        <div className="w-20 h-1 bg-secondary mx-auto" />
      </div>

      {/* Featured Pillar Page */}
      <div className="bg-primary rounded-custom overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center mb-20">
        <div className="p-12 lg:p-20 space-y-8">
          <span className="bg-secondary text-primary px-4 py-1 text-xs uppercase font-bold tracking-widest rounded-sm">Pillar Page</span>
          <h2 className="text-4xl md:text-6xl text-white font-primary leading-tight">Complete Guide to Real Estate Investment in Asaba (2026)</h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Everything you need to know about the Asaba property market, from price trends and legal verification to the best micro-locations for ROI.
          </p>
          <button className="bg-secondary text-primary px-10 py-4 rounded-custom font-secondary text-sm uppercase tracking-widest font-bold hover:bg-white transition-all">
            Read Full Guide
          </button>
        </div>
        <div className="aspect-square lg:aspect-auto h-full">
          <img src="https://picsum.photos/seed/asaba-market-analysis-2026/1000/1000" alt="Pillar Guide" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { title: "Cost of Land in Asaba 2026: Market Breakdown", category: "Market Update", img: "https://picsum.photos/seed/land-cost-asaba/800/500" },
          { title: "Best Places to Buy Land in Asaba", category: "Location Guide", img: "https://picsum.photos/seed/property-investment-guide/800/500" },
          { title: "How to Verify Land in Nigeria: The Ultimate Checklist", category: "Legal Guide", img: "https://picsum.photos/seed/land-verification-checklist/800/500" },
          { title: "Is Asaba Safe for Property Investment?", category: "Investment Tips", img: "https://picsum.photos/seed/asaba-city-safety/800/500" },
          { title: "Documents Required for Land Purchase in Delta State", category: "Legal Guide", img: "https://picsum.photos/seed/delta-state-land-documents/800/500" },
          { title: "Why Asaba Will Be Nigeria’s Next Real Estate Boom City", category: "Authority Content", img: "https://picsum.photos/seed/asaba-real-estate-boom/800/500" },
        ].map((article, i) => (
          <div key={i} className="group cursor-pointer space-y-4">
            <div className="aspect-video overflow-hidden rounded-custom relative">
              <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 bg-secondary text-primary px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-sm">
                {article.category}
              </div>
            </div>
            <p className="text-secondary text-xs uppercase tracking-widest">March {i + 15}, 2026</p>
            <h3 className="text-2xl font-primary text-primary group-hover:text-secondary transition-colors leading-tight">{article.title}</h3>
            <p className="text-gray text-sm line-clamp-2">Expert insights into the {article.category.toLowerCase()} of the Asaba real estate market.</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);

const ContactPage = () => {
  const [form, setForm] = useState({ fullName: "", email: "", subject: "Property Inquiry", message: "" });
  const [errors, setErrors] = useState({ fullName: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { fullName: "", email: "", message: "" };
    let isValid = true;

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      setSuccess(true);
      setForm({ fullName: "", email: "", subject: "Property Inquiry", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <main className="pt-32 pb-24">
      <section className="container-custom space-y-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl text-primary">Contact Us</h1>
          <div className="w-20 h-1 bg-secondary mx-auto" />
          <p className="text-gray text-lg">
            Connect with our expert advisors to discuss your real estate investment goals in Asaba and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-3xl text-primary font-primary">Get in Touch</h3>
              <p className="text-gray leading-relaxed">
                Whether you're looking to acquire land, invest in property, or need expert advisory on the Asaba market, our team is here to help.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Office Address</h4>
                  <p className="text-gray text-sm leading-relaxed">SF- 02 La Jonic off Okpanam road Asaba, Delta State, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Phone Number</h4>
                  <p className="text-gray text-sm leading-relaxed">+234 703 793 6261</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">WhatsApp</h4>
                  <a href="https://wa.me/2347037936261" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">
                    Chat with an Advisor
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-custom shadow-2xl border border-gray/10">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-primary text-primary">Message Sent</h3>
                  <p className="text-gray leading-relaxed">Thank you for reaching out. One of our advisors will contact you shortly.</p>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-secondary font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray">Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className={cn(
                        "w-full border-b py-3 focus:outline-none transition-colors",
                        errors.fullName ? "border-red-500" : "border-gray/20 focus:border-secondary"
                      )}
                    />
                    {errors.fullName && <p className="text-[8px] text-red-500 uppercase font-bold tracking-widest">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={cn(
                        "w-full border-b py-3 focus:outline-none transition-colors",
                        errors.email ? "border-red-500" : "border-gray/20 focus:border-secondary"
                      )}
                    />
                    {errors.email && <p className="text-[8px] text-red-500 uppercase font-bold tracking-widest">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border-b border-gray/20 py-3 focus:outline-none focus:border-secondary transition-colors bg-transparent"
                  >
                    <option>Property Inquiry</option>
                    <option>Investment Advisory</option>
                    <option>Land Verification</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={cn(
                      "w-full border-b py-3 focus:outline-none transition-colors resize-none",
                      errors.message ? "border-red-500" : "border-gray/20 focus:border-secondary"
                    )}
                  ></textarea>
                  {errors.message && <p className="text-[8px] text-red-500 uppercase font-bold tracking-widest">{errors.message}</p>}
                </div>
                <button type="submit" className="w-full bg-primary text-white py-5 rounded-custom font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-primary transition-all">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

const CareersPage = () => (
  <main className="pt-32 pb-24">
    <section className="container-custom space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl text-primary">Join Our Team</h1>
        <div className="w-20 h-1 bg-secondary mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto space-y-12">
        <p className="text-gray text-lg text-center">
          We are always looking for exceptional talent to join our global network of advisors and strategists.
        </p>
        <div className="space-y-6">
          {[
            { role: "Senior Investment Advisor", location: "London / Remote", type: "Full-time" },
            { role: "Real Estate Strategist", location: "Lagos / Hybrid", type: "Full-time" },
            { role: "Financial Analyst", location: "Abuja", type: "Full-time" },
          ].map((job, idx) => (
            <div key={idx} className="p-8 border border-gray/10 rounded-custom flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all">
              <div>
                <h3 className="text-2xl text-primary font-primary">{job.role}</h3>
                <p className="text-gray text-sm">{job.location} &bull; {job.type}</p>
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-custom text-xs uppercase tracking-widest font-bold hover:bg-secondary hover:text-primary transition-all">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const queryStr = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const filtered = data.filter(prop =>
          prop.title?.toLowerCase().includes(queryStr.toLowerCase()) ||
          prop.location?.toLowerCase().includes(queryStr.toLowerCase()) ||
          prop.property_type?.toLowerCase().includes(queryStr.toLowerCase())
        );
        setResults(filtered);
      }
      setLoading(false);
    };
    fetchProps();
  }, [queryStr]);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-gray-50">
      <section className="container-custom space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl text-primary font-primary">Search Results</h1>
          <p className="text-gray">
            {loading ? "Searching..." : `Showing ${results.length} results for "${queryStr}"`}
          </p>
          <div className="w-20 h-1 bg-secondary" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {results.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray text-lg">No properties found matching your search.</p>
            <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-custom font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-primary transition-all">
              Back to Home
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

const ProfilePage = () => {
  const { user, profile, loading, signOut } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <section className="container-custom">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white p-12 rounded-custom shadow-xl border border-gray/10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 bg-primary/5 rounded-full overflow-hidden flex items-center justify-center text-primary text-4xl font-bold border-4 border-secondary">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user.email?.[0].toUpperCase()
              )}
            </div>
            <div className="space-y-4 text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-4xl font-primary text-primary">{profile.displayName || 'Anonymous User'}</h1>
                  <p className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px]">{profile.role} Account</p>
                </div>
                {profile.role === 'admin' && (
                  <Link to="/admin" className="bg-primary text-white px-6 py-3 rounded-custom text-xs uppercase tracking-widest font-bold hover:bg-secondary hover:text-primary transition-all text-center">
                    Admin Dashboard
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray/10">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40">Email Address</p>
                  <p className="text-primary font-medium">{profile.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40">Member Since</p>
                  <p className="text-primary font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-custom shadow-xl border border-gray/10 space-y-8">
            <h2 className="text-2xl font-primary text-primary">Account Settings</h2>
            <div className="space-y-6">
              <p className="text-gray text-sm">Your account profile is automatically managed via Google Authentication. To update your profile picture or primary email, please manage your Google Account settings.</p>
              <div className="pt-8 border-t border-gray/10">
                <button
                  onClick={() => signOut()}
                  className="text-red-500 font-bold uppercase tracking-widest text-xs hover:text-red-700 transition-colors"
                >
                  Sign Out of All Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <ErrorBoundary fallback={<div className="p-4 bg-red-900 text-white">Header failed to load.</div>}>
            <Header onOpenLogin={() => setIsLoginOpen(true)} />
          </ErrorBoundary>
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingScreen text="Loading Admin Interface..." />}>
                    <AdminDashboard />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/property/:id" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingScreen text="Loading Property Details..." />}>
                    <PropertyDetailsPage />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/agent-dashboard" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingScreen text="Loading Agent Portal..." />}>
                    <AgentDashboard />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/favorites" element={
                <Suspense fallback={<LoadingScreen text="Loading Favorites..." />}>
                  <FavoritesPage />
                </Suspense>
              } />

              {/* Onboarding & Marketplace Routes */}
              <Route path="/register" element={
                <Suspense fallback={<LoadingScreen text="Loading Registration..." />}>
                  <Register />
                </Suspense>
              } />
              <Route path="/verify-agent" element={
                <Suspense fallback={<LoadingScreen text="Loading Verification..." />}>
                  <VerifyAgent />
                </Suspense>
              } />
              <Route path="/verify-developer" element={
                <Suspense fallback={<LoadingScreen text="Loading Verification..." />}>
                  <VerifyAgent />
                </Suspense>
              } />
              <Route path="/properties" element={
                <Suspense fallback={<LoadingScreen text="Loading Properties..." />}>
                  <PropertiesPage />
                </Suspense>
              } />
            </Routes>
          </div>
          <Footer />
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        </div>
      </Router>
    </SupabaseProvider>
  );
}
