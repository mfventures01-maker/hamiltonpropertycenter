export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'buyer' | 'agent' | 'admin';
  photoURL?: string;
  createdAt: any;
}

export const login = async (email: string): Promise<{ token: string; user: User }> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};
