import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserRole = async (user: User) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // Profile not found, create it
          const nameParts = (user.user_metadata?.full_name || 'New User').split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Check if user is a lister from metadata
          const isLister = user.user_metadata?.is_lister === true;

          const { error: insertError } = await supabase.from('profiles').insert([
            {
              user_id: user.id,
              first_name: firstName,
              last_name: lastName,
              email: user.email,
              phone: null,
              avatar_url: null,
              role: isLister ? 'lister' : 'renter',
              is_admin: false
            },
          ]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        } else if (data) {
          // If profile exists, ensure role is correct based on metadata
          const isLister = user.user_metadata?.is_lister === true;
          if (isLister && data.role !== 'lister') {
            // Update role if user should be a lister but isn't
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role: 'lister' })
              .eq('user_id', user.id);

            if (updateError) {
              console.error('Error updating profile role:', updateError);
            }
          }
        }
      } catch (err) {
        console.error('Error syncing user profile:', err);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          syncUserRole(session.user);
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        syncUserRole(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
