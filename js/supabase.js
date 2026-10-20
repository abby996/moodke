/* =========================================================
   MOODKE — Supabase Client + API Helpers
   ========================================================= */

(function () {
  const cfg = window.MOODKE_CONFIG || {};
  const enabled = cfg.USE_SUPABASE === true && 
                  cfg.SUPABASE_URL && 
                  !cfg.SUPABASE_URL.includes("YOUR-PROJECT");

  // ========== CLIENT ==========
  let supabase = null;

  if (enabled && window.supabase) {
    supabase = window.supabase.createClient(
      cfg.SUPABASE_URL,
      cfg.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
    console.log("✅ Supabase connected:", cfg.SUPABASE_URL);
  } else {
    console.log("⚠️ Supabase disabled — using localStorage mode");
  }

  // ========== HELPERS ==========
  const API = {
    enabled: !!supabase,
    client: supabase,

    /* ---------- AUTH ---------- */
    async signUp(email, password, metadata) {
      if (!supabase) return { error: { message: "Supabase pa aktive" } };
      return await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
    },

    async signIn(email, password) {
      if (!supabase) return { error: { message: "Supabase pa aktive" } };
      return await supabase.auth.signInWithPassword({ email, password });
    },

    async signOut() {
      if (!supabase) return;
      await supabase.auth.signOut();
    },

    async getUser() {
      if (!supabase) return null;
      const { data } = await supabase.auth.getUser();
      return data?.user || null;
    },

    async getProfile() {
      if (!supabase) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    },

    /* ---------- OFFERS ---------- */
    async getOffers(filters = {}) {
      if (!supabase) return { data: [], error: null };

      let query = supabase
        .from("offers")
        .select(`
          *,
          business:businesses(name, category, city, state_code, plan, verified, address)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters.state) query = query.eq("state_code", filters.state);
      if (filters.city) query = query.ilike("city", `%${filters.city}%`);
      if (filters.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      return await query;
    },

    async createOffer(payload) {
      if (!supabase) return { error: { message: "Supabase pa aktive" } };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: { message: "Ou dwe konekte" } };

      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!biz) return { error: { message: "Ou pa gen yon biznis" } };

      return await supabase
        .from("offers")
        .insert({ ...payload, business_id: biz.id })
        .select()
        .single();
    },

    async deleteOffer(offerId) {
      if (!supabase) return;
      return await supabase.from("offers").delete().eq("id", offerId);
    },

    /* ---------- FAVORITES ---------- */
    async getFavorites() {
      if (!supabase) return [];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from("favorites")
        .select("offer_id")
        .eq("user_id", user.id);
      return (data || []).map(f => f.offer_id);
    },

    async toggleFavorite(offerId) {
      if (!supabase) return { error: "Supabase pa aktive" };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: "Ou dwe konekte" };

      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("offer_id", offerId)
        .maybeSingle();

      if (existing) {
        await supabase.from("favorites").delete().eq("id", existing.id);
        return { action: "removed" };
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          offer_id: offerId
        });
        return { action: "added" };
      }
    },

    /* ---------- BUSINESSES ---------- */
    async getMyBusiness() {
      if (!supabase) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      return data;
    },

    async createBusiness(payload) {
      if (!supabase) return { error: { message: "Supabase pa aktive" } };
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: { message: "Ou dwe konekte" } };
      return await supabase
        .from("businesses")
        .insert({ ...payload, owner_id: user.id })
        .select()
        .single();
    },

    /* ---------- STORAGE ---------- */
    async uploadImage(file, userId) {
      if (!supabase) return { error: "Supabase pa aktive" };
      const ext = file.name.split(".").pop();
      const filename = `${userId}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("offers")
        .upload(filename, file, { cacheControl: "3600", upsert: false });

      if (error) return { error };

      const { data } = supabase.storage.from("offers").getPublicUrl(filename);
      return { url: data.publicUrl };
    },

    /* ---------- STATES / CATEGORIES ---------- */
    async getStates() {
      if (!supabase) return [];
      const { data } = await supabase
        .from("us_states")
        .select("*")
        .order("name");
      return data || [];
    },

    async getCategories() {
      if (!supabase) return [];
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      return data || [];
    },

    /* ---------- RESERVATIONS ---------- */
    async createReservation(offerId, amount, serviceFee = 0) {
      if (!supabase) return { error: "Supabase pa aktive" };
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: "Ou dwe konekte" };

      return await supabase.from("reservations").insert({
        user_id: user.id,
        offer_id: offerId,
        amount,
        service_fee: serviceFee,
        status: "pending"
      }).select().single();
    }
  };

  window.MoodkeAPI = API;
  window.supabaseClient = supabase;
})();