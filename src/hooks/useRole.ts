// src/hooks/useRole.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/integrations/supabase/types';

export const useRole = () => {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRole = async () => {
            if (!user) {
                setRole(null);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setRole(data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [user]);

    const isLister = role === 'lister';
    const isSeeker = role === 'seeker';

    return { role, loading, isLister, isSeeker };
};