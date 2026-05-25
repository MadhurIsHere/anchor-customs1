import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing! Check your .env file. Using a mock client to prevent app crash.');
} else {
  console.log('Supabase initialized with URL:', supabaseUrl);
}

// Create a safe client that won't throw on creation
let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
  // Fallback mock object to prevent crashes on method calls
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: () => Promise.resolve({ error: new Error('Mock client') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'mock' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://placeholder-url.supabase.co/mock.jpg' } })
      })
    },
    functions: {
      invoke: () => Promise.resolve({ data: null, error: new Error('Mock client') })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            limit: () => Promise.resolve({ data: [] }),
            single: () => Promise.resolve({ data: null, error: new Error('Mock client') }),
          }),
          limit: () => Promise.resolve({ data: [] }),
        }),
        limit: () => Promise.resolve({ data: [] }),
      }),
    }),
  };
}

export const supabase = supabaseClient;
