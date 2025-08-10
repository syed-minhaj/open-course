import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? " ",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? " ",
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          'x-api-key': process.env.SUPABASE_BUCKET_API_KEY ?? " ",
        },
      },
    },
);

export {supabase};