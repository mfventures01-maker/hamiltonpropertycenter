import React from "react";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, ArrowRight, Video, Image as ImageIcon, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export interface Agent {
  id: string;
  company_name: string;
  verified: boolean;
  photo_url: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  description: string;
  images: string[];
  has_video?: boolean;
  is_featured?: boolean;
  agents: Agent;
}

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group bg-white rounded-[2rem] overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500 border border-gray/5 relative ${property.is_featured ? 'ring-2 ring-secondary/30' : ''}`}
    >
      {/* Property Information Overlay Tags */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          {property.is_featured && (
            <div className="bg-secondary text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-xl animate-pulse">
              Featured
            </div>
          )}
          <div className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
            {property.type}
          </div>
        </div>
        {property.has_video && (
          <div className="bg-secondary text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-secondary/20 shadow-lg">
            <Video className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Video Tour</span>
          </div>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/property/${property.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images?.[0] || "https://picsum.photos/seed/hpc-property/800/600"}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              // Favorite logic
            }}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-full text-white hover:text-secondary hover:bg-white transition-all shadow-xl"
          >
            <Heart className="w-4 h-4" />
          </motion.button>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-white text-[10px] font-bold">{property.images?.length || 0} Photos</span>
          </div>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
              <MapPin className="w-3.5 h-3.5" />
              {property.location}
            </div>
            <h3 className="text-xl font-primary text-primary line-clamp-1 group-hover:text-secondary transition-colors duration-300">
              {property.title}
            </h3>
          </div>
        </div>

        <p className="text-gray/60 text-xs font-light leading-relaxed line-clamp-2">
          {property.description}
        </p>

        {/* Price & Agent Info */}
        <div className="pt-4 border-t border-gray/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-primary font-bold text-primary italic">
              {formattedPrice}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray/40 uppercase tracking-widest">{property.agents.company_name}</span>
              {property.agents.verified && (
                <div className="bg-secondary/10 p-1 rounded-full" title="Verified Agent">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Details Action */}
        <Link
          to={`/property/${property.id}`}
          className="w-full mt-4 bg-gray/5 text-primary py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group-hover:bg-secondary group-hover:text-primary transition-all duration-300"
        >
          View Property Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
