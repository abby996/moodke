/* =========================================================
   MOODKE — Configuration
   =========================================================
   ⚠️ Ranpli SUPABASE_URL ak SUPABASE_ANON_KEY ak pwòp valè w.
   Jwenn yo nan: Supabase Dashboard → Settings → API
   ========================================================= */

window.MOODKE_CONFIG = {
  // ⚙️ Aktive oswa dezaktive Supabase
  // false = app la mache ak localStorage (dev mode)
  // true  = app la konekte ak Supabase
  USE_SUPABASE: false,

  // 🔗 Ranpli sa yo soti nan Supabase Settings → API
  SUPABASE_URL: "https://YOUR-PROJECT-ID.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-KEY-HERE",

  // 🔐 Modpas admin panel (chanje l!)
  ADMIN_PASSWORD: "moodke-admin-2024"
};