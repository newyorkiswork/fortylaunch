import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env with VITE_ prefix
declare global {
    interface ImportMeta {
        env: {
            VITE_SUPABASE_URL?: string;
            VITE_SUPABASE_ANON_KEY?: string;
        };
    }
}

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('Supabase credentials not found. Running in offline mode with localStorage.');
}

export const supabase = supabaseClient;

// Helper to check if Supabase is connected
export const isSupabaseConnected = (): boolean => supabase !== null;

// Re-export database types for consumers
export type { Database } from './database.types';

