import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, Bed, Bath, Square, CheckCircle, Mail, Phone, Loader2, Eye } from "lucide-react";
import { db, doc, getDoc, collection, addDoc } from "../lib/firebase";
import { useFirebase } from "../context/FirebaseContext";
import { VirtualTour } from "./VirtualTour";

export const PropertyDetails = () => {
  const { id } = useParams();
  const { user, isAuthReady } = useFirebase();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    if (!isAuthReady || !id) return;

    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAuthReady]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setInquiryLoading(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        propertyId: property.id,
        propertyTitle: property.title,
        userName: formData.name,
        userEmail: formData.email,
        message: formData.message,
        status: "pending",
        createdAt: new Date()
      });
      setInquirySent(true);
      setFormData(prev => ({ ...prev, message: "" }));
    } catch (error) {
      console.error("Error sending inquiry:", error);
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) return (
    <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      <p className="text-primary uppercase tracking-widest text-xs font-bold">Loading Property Details...</p>
    </div>
  );

  if (!property) return (
    <div className="pt-32 text-center space-y-6">
      <h2 className="text-3xl text-primary font-primary">Property Not Found</h2>
      <Link to="/" className="text-secondary uppercase tracking-widest text-xs font-bold hover:text-primary transition-colors">Return to Listings</Link>
    </div>
  );

  return (
    <main className="pt-32 pb-24">
      <div className="container-custom">
        <Link to="/" className="flex items-center gap-2 text-primary/40 hover:text-secondary transition-colors uppercase tracking-widest text-xs font-bold mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Listings
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-custom overflow-hidden shadow-2xl group"
            >
              <img src={property.image} alt={property.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              
              {property.virtualTourUrl && (
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <button 
                    onClick={() => setIsTourOpen(true)}
                    className="bg-white text-primary px-8 py-4 rounded-custom font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-secondary hover:scale-105 transition-all shadow-2xl"
                  >
                    <Eye className="w-4 h-4" /> Start Virtual Tour
                  </button>
                </div>
              )}
            </motion.div>

            <VirtualTour 
              isOpen={isTourOpen} 
              onClose={() => setIsTourOpen(false)} 
              imageUrl={property.virtualTourUrl} 
              title={property.title} 
            />

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-secondary text-sm uppercase tracking-widest font-bold">
                <MapPin className="w-4 h-4" /> {property.location}
              </div>
              <h1 className="text-5xl md:text-7xl text-primary font-primary">{property.title}</h1>
              <p className="text-secondary text-3xl font-bold">{property.price}</p>
            </div>

            <div className="grid grid-cols-3 gap-8 py-8 border-y border-gray/10">
              <div className="flex items-center gap-3">
                <Bed className="text-secondary w-6 h-6" />
                <div>
                  <p className="text-primary font-bold">{property.bedrooms || "5"}</p>
                  <p className="text-gray text-xs uppercase tracking-widest">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="text-secondary w-6 h-6" />
                <div>
                  <p className="text-primary font-bold">{property.bathrooms || "6"}</p>
                  <p className="text-gray text-xs uppercase tracking-widest">Bathrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Square className="text-secondary w-6 h-6" />
                <div>
                  <p className="text-primary font-bold">{property.sqft || "4,500"}</p>
                  <p className="text-gray text-xs uppercase tracking-widest">Sq Ft</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl text-primary font-primary">Description</h3>
              <p className="text-gray text-lg leading-relaxed">
                {property.description || "This exceptional property offers the pinnacle of luxury living. Designed with meticulous attention to detail, it features expansive living spaces, state-of-the-art amenities, and breathtaking views."}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl text-primary font-primary">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(property.amenities || ["Private Pool", "Home Cinema", "Smart Home System", "Wine Cellar", "Gym", "24/7 Security"]).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-gray">
                    <CheckCircle className="text-secondary w-4 h-4" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Contact Form */}
          <aside className="space-y-8">
            <div className="bg-primary p-8 rounded-custom text-white space-y-8 shadow-2xl">
              <div className="space-y-4">
                <h3 className="text-2xl font-primary text-secondary">Inquire About This Property</h3>
                <p className="text-white/60 text-sm">Our elite advisors are ready to assist you.</p>
              </div>
              
              {inquirySent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 p-6 rounded-custom border border-secondary/20 text-center space-y-4"
                >
                  <CheckCircle className="w-12 h-12 text-secondary mx-auto" />
                  <h4 className="text-xl font-primary">Inquiry Sent</h4>
                  <p className="text-white/60 text-sm">Thank you for your interest. An advisor will contact you shortly.</p>
                  <button 
                    onClick={() => setInquirySent(false)}
                    className="text-secondary text-xs uppercase tracking-widest font-bold hover:text-white transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-4">
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-custom py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-colors" 
                  />
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-custom py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-colors" 
                  />
                  <textarea 
                    required
                    placeholder="Your Message" 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-custom py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-colors"
                  ></textarea>
                  <button 
                    disabled={inquiryLoading}
                    className="w-full bg-secondary text-primary py-4 rounded-custom font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    {inquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Inquiry"}
                  </button>
                </form>
              )}

              <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <span className="text-xs uppercase tracking-widest font-bold text-white/40">Contact Agent</span>
              </div>
            </div>

            <div className="p-8 border border-gray/10 rounded-custom space-y-4">
              <h4 className="font-primary text-xl text-primary">Location Map</h4>
              <div className="aspect-square bg-gray-100 rounded-custom flex items-center justify-center text-gray/40 uppercase tracking-widest text-[10px] text-center p-8">
                Interactive Map Integration Coming Soon
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
