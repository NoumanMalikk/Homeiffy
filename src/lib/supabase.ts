/**
 * Optional Supabase client stub.
 * Production deployments should persist orders, quotes and customer data in Supabase
 * rather than the local `.data/orders.json` file store used for staging/single-instance.
 */

export interface SupabaseClientStub {
  from: (table: string) => {
    select: () => Promise<{ data: unknown[]; error: null }>;
    insert: (row: unknown) => Promise<{ data: unknown; error: null }>;
  };
}

let supabaseClient: SupabaseClientStub | null = null;

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Returns a no-op Supabase-compatible client when env vars are present.
 * Replace with `@supabase/supabase-js` when wiring production persistence.
 */
export function getSupabaseClient(): SupabaseClientStub | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = {
      from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async (row) => ({ data: row, error: null }),
      }),
    };
  }

  return supabaseClient;
}

export function isSupabaseEnabled(): boolean {
  return isSupabaseConfigured();
}
