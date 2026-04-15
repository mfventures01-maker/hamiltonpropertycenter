export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  image: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  status: 'available' | 'sold' | 'pending';
  agentId: string;
  createdAt: any;
}

export const getProperties = async (): Promise<Property[]> => {
  const response = await fetch("/api/properties");
  if (!response.ok) throw new Error("Failed to fetch properties");
  return response.json();
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  const response = await fetch(`/api/properties/${id}`);
  if (!response.ok) return null;
  return response.json();
};
