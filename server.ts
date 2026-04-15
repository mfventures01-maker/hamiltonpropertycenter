import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Hamilton Property Center API is running" });
  });

  // Auth routes (placeholder for now)
  app.post("/api/auth/login", (req, res) => {
    // Mock login
    res.json({ token: "mock-token", user: { email: req.body.email, role: "admin" } });
  });

  // Property routes
  const mockProperties = [
    { 
      id: 1, 
      title: "Luxury Villa in Lagos", 
      price: "$2,500,000", 
      location: "Ikoyi, Lagos", 
      type: "Villa", 
      image: "https://picsum.photos/seed/villa1/1920/1080",
      virtualTourUrl: "https://pannellum.org/images/alma.jpg",
      description: "A masterpiece of modern architecture located in the heart of Ikoyi. This villa offers unparalleled luxury with smart home features, a private cinema, and an infinity pool overlooking the lagoon.",
      bedrooms: 6,
      bathrooms: 7,
      sqft: "8,500",
      amenities: ["Private Pool", "Home Cinema", "Smart Home System", "Wine Cellar", "Gym", "24/7 Security", "Elevator", "Staff Quarters"]
    },
    { 
      id: 2, 
      title: "Modern Penthouse", 
      price: "$1,800,000", 
      location: "Victoria Island, Lagos", 
      type: "Penthouse", 
      image: "https://picsum.photos/seed/penthouse1/1920/1080",
      virtualTourUrl: "https://pannellum.org/images/cerro-toco-0.jpg",
      description: "Experience the height of urban living in this stunning penthouse. Featuring floor-to-ceiling windows with panoramic city views, a private rooftop terrace, and bespoke finishes throughout.",
      bedrooms: 4,
      bathrooms: 5,
      sqft: "5,200",
      amenities: ["Rooftop Terrace", "Private Elevator", "Concierge Service", "Automated Blinds", "Gourmet Kitchen", "Spa Bathroom"]
    },
    { 
      id: 3, 
      title: "Exclusive Estate", 
      price: "$5,000,000", 
      location: "Abuja, FCT", 
      type: "Estate", 
      image: "https://picsum.photos/seed/estate1/1920/1080",
      virtualTourUrl: "https://pannellum.org/images/jfk.jpg",
      description: "An expansive estate set on multiple acres of lush greenery. This property provides ultimate privacy and grandeur, with a private lake, guest houses, and world-class equestrian facilities.",
      bedrooms: 8,
      bathrooms: 10,
      sqft: "15,000",
      amenities: ["Private Lake", "Guest Houses", "Equestrian Center", "Helipad", "Tennis Court", "Olympic Pool", "Grand Ballroom"]
    },
  ];

  app.get("/api/properties", (req, res) => {
    res.json(mockProperties);
  });

  app.get("/api/properties/:id", (req, res) => {
    const prop = mockProperties.find(p => p.id.toString() === req.params.id);
    if (prop) res.json(prop);
    else res.status(404).json({ message: "Property not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
