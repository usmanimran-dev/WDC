import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getDeveloperProfile, DeveloperProfile } from '@/services/developer.api';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    isDeveloper: boolean;
    developerProfile: DeveloperProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isAdmin: false,
    isDeveloper: false,
    developerProfile: null,
    loading: true,
    refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string;

    const loadProfile = async (userId: string) => {
        try {
            const profile = await getDeveloperProfile(userId);
            setDeveloperProfile(profile);
        } catch {
            setDeveloperProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (user) await loadProfile(user.id);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) loadProfile(session.user.id);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id);
            } else {
                setDeveloperProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const isAdmin = !!user && (adminEmail ? user.email === adminEmail : true);
    const isDeveloper = !!developerProfile;

    return (
        <AuthContext.Provider value={{ user, session, isAdmin, isDeveloper, developerProfile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
