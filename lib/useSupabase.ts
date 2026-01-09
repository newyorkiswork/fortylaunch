import { useState, useEffect } from 'react';
import { supabase, isSupabaseConnected } from './supabase';

type TableName = 'opportunities' | 'interactions' | 'contracts' | 'calendar_events';

export function useSupabaseData<T>(
    table: TableName,
    fallbackData: T[]
) {
    const [data, setData] = useState<T[]>(fallbackData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isSupabaseConnected() || !supabase) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const { data: result, error: fetchError } = await supabase
                    .from(table)
                    .select('*');

                if (fetchError) throw fetchError;
                if (result) setData(result as T[]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error(`Error fetching ${table}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Real-time subscription
        const channel = supabase
            .channel(`${table}_changes`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                (payload) => {
                    console.log('Real-time update:', payload);
                    fetchData(); // Refetch on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table]);

    return { data, loading, error, isConnected: isSupabaseConnected() };
}

// Insert helper - uses any to bypass strict Supabase types
export async function insertRecord(table: TableName, record: Record<string, unknown>) {
    if (!isSupabaseConnected() || !supabase) {
        return { data: null, error: 'Not connected to Supabase' };
    }

    const { data, error } = await (supabase.from(table) as any).insert(record).select().single();
    return { data, error: error?.message || null };
}

// Update helper
export async function updateRecord(table: TableName, id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConnected() || !supabase) {
        return { data: null, error: 'Not connected to Supabase' };
    }

    const { data, error } = await (supabase.from(table) as any).update(updates).eq('id', id).select().single();
    return { data, error: error?.message || null };
}

// Delete helper
export async function deleteRecord(table: TableName, id: string) {
    if (!isSupabaseConnected() || !supabase) {
        return { error: 'Not connected to Supabase' };
    }

    const { error } = await (supabase.from(table) as any).delete().eq('id', id);
    return { error: error?.message || null };
}
