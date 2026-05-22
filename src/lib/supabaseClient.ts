import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(
  rawUrl && 
  (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) && 
  rawAnonKey
);

const supabaseUrl = isSupabaseConfigured 
  ? rawUrl 
  : 'https://placeholder-project-not-configured.supabase.co';

const supabaseAnonKey = rawAnonKey || 'placeholder-anonymous-key-not-provided';

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials are not fully configured or are invalid in your environment configuration. Running in Local Storage sandbox fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function safeParse(val: any): any {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}

export async function saveEntry(key: string, data: any) {
  if (!isSupabaseConfigured) {
    return { success: false, error: new Error('Supabase is not configured.') };
  }
  try {
    // We try to upsert based on standard database schema options:
    // Option A: { id: key, value: data }
    const payloadA = { id: key, value: data };
    const { error: errA } = await supabase.from('entries').upsert(payloadA);
    if (!errA) return { success: true };

    // Option B: { key: key, value: data }
    const payloadB = { key: key, value: data };
    const { error: errB } = await supabase.from('entries').upsert(payloadB);
    if (!errB) return { success: true };

    // Option C: { key: key, data: data }
    const payloadC = { key: key, data: data };
    const { error: errC } = await supabase.from('entries').upsert(payloadC);
    if (!errC) return { success: true };

    // Option D: { id: key, data: data }
    const payloadD = { id: key, data: data };
    const { error: errD } = await supabase.from('entries').upsert(payloadD);
    if (!errD) return { success: true };

    console.error('Supabase saveEntry failed across all schema options. Errors:', { errA, errB, errC, errD });
    return { success: false, error: errA || errB || errC || errD };
  } catch (err) {
    console.error('Exception in saveEntry:', err);
    return { success: false, error: err };
  }
}

export async function getEntries() {
  if (!isSupabaseConfigured) {
    return { success: false, data: [], error: new Error('Supabase is not configured.') };
  }
  try {
    const { data, error } = await supabase.from('entries').select('*');
    if (error) {
      console.error('Error fetching entries:', error);
      return { success: false, data: [], error };
    }

    const parsedEntries: Record<string, any> = {};
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        const keyVal = row.id || row.key;
        const rawContent = row.value !== undefined ? row.value : row.data;
        if (keyVal) {
          parsedEntries[keyVal] = safeParse(rawContent);
        }
      });
    }
    return { success: true, data: parsedEntries };
  } catch (err) {
    console.error('Exception in getEntries:', err);
    return { success: false, data: [], error: err };
  }
}
