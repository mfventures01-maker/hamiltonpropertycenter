import React from "react";
import { motion } from "framer-motion";

interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const ServiceCard = ({ icon, title, desc }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 border border-gray/10 rounded-custom hover:shadow-2xl transition-all group bg-white"
    >
      <div className="text-secondary mb-6 w-12 h-12 flex items-center justify-center bg-primary/5 rounded-full group-hover:bg-secondary group-hover:text-primary transition-all">
        {icon}
      </div>
      <h3 className="text-xl mb-4 text-primary font-primary">{title}</h3>
      <p className="text-gray text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
};
