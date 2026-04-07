import { createSupabaseServiceClient } from "@/lib/supabase";

export function getSupabaseAdmin() {
  return createSupabaseServiceClient();
}
