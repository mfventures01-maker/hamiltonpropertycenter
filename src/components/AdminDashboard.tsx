import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Check, X, LayoutDashboard, Home, Users, MessageSquare, Settings, Loader2, Image as ImageIcon, MapPin, DollarSign, Type, Eye, HelpCircle, ExternalLink, Copy, Search } from "lucide-react";
import { db, collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "../lib/firebase";
import { useFirebase } from "../context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export const AdminDashboard = () => {
  const { profile, loading: authLoading, isAuthReady } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    type: "Villa",
    image: "",
    virtualTourUrl: "",
    description: "",
    bedrooms: "5",
    bathrooms: "6",
    sqft: "4,500",
    amenities: "Private Pool, Home Cinema, Gym"
  });

  useEffect(() => {
    if (isAuthReady && (!profile || profile.role !== 'admin')) {
      navigate("/");
    }
  }, [isAuthReady, profile, navigate]);

  useEffect(() => {
    if (!isAuthReady || profile?.role !== 'admin') return;

    const qProps = query(collection(db, "properties"), orderBy("createdAt", "desc"));
    const unsubProps = onSnapshot(qProps, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const qInq = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubInq = onSnapshot(qInq, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qUsers = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubProps();
      unsubInq();
      unsubUsers();
    };
  }, [isAuthReady, profile]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await addDoc(collection(db, "properties"), {
        ...newProperty,
        amenities: newProperty.amenities.split(",").map(s => s.trim()),
        authorUid: profile.uid,
        createdAt: serverTimestamp()
      });
      setIsAddModalOpen(false);
      setNewProperty({
        title: "",
        location: "",
        price: "",
        type: "Villa",
        image: "",
        virtualTourUrl: "",
        description: "",
        bedrooms: "5",
        bathrooms: "6",
        sqft: "4,500",
        amenities: "Private Pool, Home Cinema, Gym"
      });
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteDoc(doc(db, "properties", id));
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { status });
    } catch (error) {
      console.error("Error updating inquiry:", error);
    }
  };

  const handleUpdateUserRole = async (uid: string, newRole: 'admin' | 'client') => {
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (authLoading || !isAuthReady) return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <Loader2 className="w-8 h-8 text-secondary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white p-8 space-y-12 shrink-0 border-r border-white/5">
        <div className="flex flex-col gap-2">
          <Logo />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mt-2 px-1">Administrative Portal</span>
        </div>
        <nav className="space-y-2">
          {[
            { id: "properties", icon: <Home className="w-4 h-4" />, label: "Properties" },
            { id: "inquiries", icon: <MessageSquare className="w-4 h-4" />, label: "Inquiries" },
            { id: "users", icon: <Users className="w-4 h-4" />, label: "Users" },
            { id: "media", icon: <ImageIcon className="w-4 h-4" />, label: "Media Library" },
            { id: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" },
            { id: "help", icon: <HelpCircle className="w-4 h-4" />, label: "Help Center" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-custom text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id ? "bg-secondary text-primary" : "text-white/60 hover:bg-white/5"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-x-hidden">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-primary text-primary capitalize">{activeTab} Management</h1>
          {activeTab === "properties" && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-secondary text-primary px-6 py-3 rounded-custom font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Property
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "properties" && (
              <div className="bg-white rounded-custom shadow-sm border border-gray/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray/10">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Property</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Location</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Price</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Type</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray/10">
                    {properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={prop.image} alt={prop.title} className="w-12 h-12 rounded-custom object-cover" referrerPolicy="no-referrer" />
                            <span className="font-bold text-primary">{prop.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray">{prop.location}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">{prop.price}</td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary/20 text-primary px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                            {prop.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-primary/40 hover:text-secondary transition-colors"><Edit className="w-4 h-4" /></button>
                            <button 
                              onClick={() => handleDeleteProperty(prop.id)}
                              className="text-primary/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "inquiries" && (
              <div className="space-y-6">
                {inquiries.length === 0 ? (
                  <div className="text-center py-20 text-gray/40 uppercase tracking-widest text-sm">No inquiries yet</div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="bg-white p-8 rounded-custom border border-gray/10 shadow-sm flex flex-col md:flex-row justify-between gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                              inq.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {inq.status}
                            </span>
                            <span className="text-xs text-gray/40 uppercase tracking-widest">{new Date(inq.createdAt?.toDate()).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-2xl font-primary text-primary">{inq.propertyTitle}</h3>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-primary">{inq.userName}</p>
                            <p className="text-sm text-secondary">{inq.userEmail}</p>
                          </div>
                          <p className="text-gray text-sm italic">"{inq.message}"</p>
                        </div>
                        <div className="flex flex-col gap-3 justify-center">
                          <button 
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                            className="bg-primary text-white px-6 py-2 rounded-custom text-[10px] uppercase font-bold tracking-widest hover:bg-secondary hover:text-primary transition-all"
                          >
                            Mark Contacted
                          </button>
                          <button 
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'closed')}
                            className="border border-primary text-primary px-6 py-2 rounded-custom text-[10px] uppercase font-bold tracking-widest hover:bg-primary hover:text-white transition-all"
                          >
                            Close Inquiry
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white rounded-custom shadow-sm border border-gray/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray/10">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">User</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Email</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Joined</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Role</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-primary/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray/10">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/5 rounded-full overflow-hidden flex items-center justify-center text-primary font-bold">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                u.email?.[0].toUpperCase()
                              )}
                            </div>
                            <span className="font-bold text-primary">{u.displayName || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray">{u.email}</td>
                        <td className="px-6 py-4 text-sm text-gray">
                          {u.createdAt?.toDate ? new Date(u.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                            u.role === 'admin' ? 'bg-secondary text-primary' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value as 'admin' | 'client')}
                            className="text-xs uppercase tracking-widest font-bold bg-transparent border-b border-gray/20 focus:outline-none focus:border-secondary py-1"
                          >
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <p className="text-gray text-sm">Manage all images used across your property listings.</p>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray/40" />
                    <input 
                      type="text" 
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray/10 rounded-custom py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {properties
                    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((prop) => (
                    <div key={prop.id} className="group relative aspect-square bg-white rounded-custom border border-gray/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-2">{prop.title}</p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(prop.image);
                            alert("Image URL copied to clipboard!");
                          }}
                          className="bg-secondary text-primary p-2 rounded-full hover:bg-white transition-colors"
                          title="Copy Image URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-2xl space-y-12">
                <div className="bg-white p-8 rounded-custom border border-gray/10 shadow-sm space-y-6">
                  <h3 className="text-2xl font-primary text-primary">System Tools</h3>
                  <p className="text-gray text-sm">Use these tools to manage the initial state of your application.</p>
                  <button 
                    onClick={async () => {
                      const seedProps = [
                        {
                          title: "The Hamilton Imperial Villa",
                          location: "GRA Asaba, Delta State",
                          price: "₦450,000,000",
                          type: "Villa",
                          image: "https://picsum.photos/seed/luxury-villa-gra-asaba-hd/1920/1080",
                          description: "An architectural masterpiece in the heart of GRA Asaba. Features include a private infinity pool, smart home automation, and 24/7 elite security.",
                          bedrooms: "6",
                          bathrooms: "7",
                          sqft: "5,200",
                          amenities: ["Private Pool", "Home Cinema", "Gym", "Smart Home", "Elite Security"],
                          createdAt: serverTimestamp()
                        },
                        {
                          title: "Azure Residential Estate",
                          location: "Okpanam, Asaba",
                          price: "₦120,000,000",
                          type: "Estate",
                          image: "https://picsum.photos/seed/modern-residential-development-asaba-hd/1920/1080",
                          description: "Sleek, modern design meets ultimate comfort in this stunning residential development. Located in the rapidly growing Okpanam axis.",
                          bedrooms: "4",
                          bathrooms: "5",
                          sqft: "3,500",
                          amenities: ["Garden", "Security", "Solar Power", "Ample Parking"],
                          createdAt: serverTimestamp()
                        },
                        {
                          title: "Strategic Commercial Hub",
                          location: "Ibusa Road, Asaba",
                          price: "₦280,000,000",
                          type: "Commercial",
                          image: "https://picsum.photos/seed/commercial-real-estate-development-nigeria-hd/1920/1080",
                          description: "A prime commercial asset along the strategic Ibusa corridor. Perfect for corporate headquarters or high-end retail space.",
                          bedrooms: "0",
                          bathrooms: "4",
                          sqft: "8,000",
                          amenities: ["Prime Location", "Ample Parking", "Security", "High Visibility"],
                          createdAt: serverTimestamp()
                        }
                      ];

                      try {
                        for (const prop of seedProps) {
                          await addDoc(collection(db, "properties"), prop);
                        }
                        alert("Seed data added successfully!");
                      } catch (error) {
                        console.error("Error seeding data:", error);
                      }
                    }}
                    className="bg-primary text-white px-8 py-4 rounded-custom font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-primary transition-all"
                  >
                    Seed Initial Properties
                  </button>
                </div>
              </div>
            )}

            {activeTab === "help" && (
              <div className="max-w-4xl space-y-12">
                <section className="space-y-6">
                  <h2 className="text-3xl font-primary text-primary">Platform Help Center</h2>
                  <p className="text-gray">Frequently asked questions about managing your Hamilton Property Center platform.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-custom border border-gray/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-primary">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-primary text-primary">How do I add photos?</h3>
                    <p className="text-gray text-sm leading-relaxed">
                      You can add photos by providing a direct URL in the "Add Property" form. 
                      To use your own photos, upload them to a service like Imgur, Cloudinary, or use the 
                      <strong> File Explorer</strong> in the AI Studio sidebar to upload images directly to the project folder.
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-custom border border-gray/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-primary">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-primary text-primary">How are user profiles created?</h3>
                    <p className="text-gray text-sm leading-relaxed">
                      Profiles are created <strong>automatically</strong> the first time a user signs in with Google. 
                      You can manage these users and their roles (Admin vs Client) in the <strong>Users</strong> tab of this dashboard.
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-custom border border-gray/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-primary">
                      <ExternalLink className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-primary text-primary">Where is the Export button?</h3>
                    <p className="text-gray text-sm leading-relaxed">
                      The Export button is located in the <strong>AI Studio interface</strong> (the window containing this chat). 
                      Click the <strong>Gear Icon (⚙️)</strong> in the top right corner of the AI Studio header, then select <strong>Export &gt; Download as ZIP</strong>.
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-custom border border-gray/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-primary">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-primary text-primary">System Configuration</h3>
                    <p className="text-gray text-sm leading-relaxed">
                      Your Firebase configuration is stored in <code>firebase-applet-config.json</code>. 
                      Do not modify this file manually unless you are moving to a production Firebase project.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Property Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-custom shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-primary p-8 flex items-center justify-between">
                <h2 className="text-2xl font-primary text-white">Add New Property</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddProperty} className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Title</label>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                      <input 
                        type="text" required
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                        placeholder="Luxury Villa in Lagos"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                      <input 
                        type="text" required
                        value={newProperty.location}
                        onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                        placeholder="Ikoyi, Lagos"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                      <input 
                        type="text" required
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                        placeholder="$2,500,000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                      <input 
                        type="url" required
                        value={newProperty.image}
                        onChange={(e) => setNewProperty({...newProperty, image: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Virtual Tour URL (360° Image)</label>
                    <div className="relative">
                      <Eye className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
                      <input 
                        type="url"
                        value={newProperty.virtualTourUrl}
                        onChange={(e) => setNewProperty({...newProperty, virtualTourUrl: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 pl-10 focus:outline-none focus:border-secondary transition-colors"
                        placeholder="https://pannellum.org/images/alma.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Beds</label>
                      <input 
                        type="text" required
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 px-4 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Baths</label>
                      <input 
                        type="text" required
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 px-4 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Sq Ft</label>
                      <input 
                        type="text" required
                        value={newProperty.sqft}
                        onChange={(e) => setNewProperty({...newProperty, sqft: e.target.value})}
                        className="w-full border border-gray/20 rounded-custom py-3 px-4 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Amenities (comma separated)</label>
                    <input 
                      type="text" required
                      value={newProperty.amenities}
                      onChange={(e) => setNewProperty({...newProperty, amenities: e.target.value})}
                      className="w-full border border-gray/20 rounded-custom py-3 px-4 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="Pool, Gym, Security"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Description</label>
                    <textarea 
                      required
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                      rows={4}
                      className="w-full border border-gray/20 rounded-custom py-3 px-4 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="Detailed description of the property..."
                    ></textarea>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-custom font-bold uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all">
                    Create Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
