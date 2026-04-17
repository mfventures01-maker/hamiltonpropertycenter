import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, HAS_SUPABASE_ENV } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export type Role = 'buyer' | 'agent' | 'admin';

interface Profile {
    id: string;
    full_name: string;
    email?: string;
    role: Role;
    verified?: boolean;
}

interface SupabaseContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    role: Role | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({} as SupabaseContextType);

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function getSession() {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error.message);
            }

            const currentSession = session || null;
            const currentUser = currentSession?.user || null;
            if (mounted) {
                setSession(currentSession);
                setUser(currentUser);
            }

            if (currentUser && mounted) {
                await fetchProfile(currentUser.id);
            } else if (mounted) {
                setLoading(false);
            }
        }

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentSession = session || null;
            const currentUser = currentSession?.user || null;
            if (mounted) {
                setSession(currentSession);
                setUser(currentUser);
            }

            if (currentUser && mounted) {
                await fetchProfile(currentUser.id);
            } else if (mounted) {
                setProfile(null);
                setRole(null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error.message);
            }
            if (data) {
                setProfile(data as Profile);
                setRole(data.role as Role);
            } else {
                setRole(null);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (!HAS_SUPABASE_ENV) return;
        await supabase.auth.signOut();
    };

    if (!HAS_SUPABASE_ENV) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white px-4 text-center">
                <div className="bg-white/5 p-12 rounded-custom border border-red-500/30 max-w-lg w-full flex flex-col items-center space-y-6">
                    <h1 className="text-2xl font-primary text-red-400">Configuration Error</h1>
                    <p className="text-white/60 text-sm font-light">
                        Supabase environment variables are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <SupabaseContext.Provider value={{ user, session, profile, role, loading, signOut }}>
            {children}
        </SupabaseContext.Provider>
    );
};
