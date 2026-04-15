import React, { useEffect, useRef } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    pannellum: any;
  }
}

interface VirtualTourProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const VirtualTour = ({ isOpen, onClose, imageUrl, title }: VirtualTourProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    if (isOpen && imageUrl) {
      // Load pannellum scripts dynamically if not already loaded
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      const loadStyle = (href: string) => {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      };

      const initViewer = async () => {
        try {
          loadStyle("https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css");
          await loadScript("https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js");
          
          if (window.pannellum && viewerRef.current) {
            window.pannellum.viewer(viewerRef.current, {
              type: "equirectangular",
              panorama: imageUrl,
              autoLoad: true,
              title: title,
              author: "Hamilton Property Center",
              compass: true,
              showFullscreenCtrl: false, // We'll handle fullscreen ourselves or use their UI
            });
          }
        } catch (err) {
          console.error("Failed to load pannellum:", err);
        }
      };

      initViewer();
    }
  }, [isOpen, imageUrl, title]);

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-xl p-4 md:p-10"
        >
          <div className="relative w-full h-full max-w-6xl bg-black rounded-custom overflow-hidden shadow-2xl border border-secondary/20 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-primary border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-secondary text-[10px] uppercase font-bold tracking-widest">Virtual Experience</span>
                <h3 className="text-white font-primary text-xl">{title}</h3>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleFullscreen}
                  className="text-white/60 hover:text-secondary transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={onClose}
                  className="bg-white/10 hover:bg-secondary hover:text-primary text-white p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Container */}
            <div className="flex-grow relative">
              <div ref={viewerRef} className="w-full h-full"></div>
              
              {/* Overlay Instructions */}
              <div className="absolute bottom-6 left-6 bg-primary/80 backdrop-blur-md p-4 rounded-custom border border-white/10 pointer-events-none">
                <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">Navigation Guide</p>
                <p className="text-white text-xs">Click and drag to explore the 360° view. Use scroll to zoom.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
