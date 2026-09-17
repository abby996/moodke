/* =========================================================
   MOODKE — App Logic (vèsyon final, yon sèl kopi)
   ========================================================= */

/* ========== US STATES (50 + DC + PR = 52) ========== */
const US_STATES = Object.freeze([
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "PR", name: "Puerto Rico" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
]);

const stateName = (code) =>
  US_STATES.find(s => s.code === code)?.name || code || "";

/* ========== CATEGORIES ========== */
const CATEGORIES = Object.freeze([
  { name: "All",      icon: "✨" },
  { name: "Food",     icon: "🍽️" },
  { name: "Beauty",   icon: "💇🏽‍♀️" },
  { name: "Fitness",  icon: "🏋🏽" },
  { name: "Events",   icon: "🎉" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Nightlife",icon: "🌙" },
  { name: "Travel",   icon: "✈️" },
  { name: "Family",   icon: "👨‍👩‍👧" },
  { name: "Services", icon: "🛠️" },
  { name: "Cafés",    icon: "☕" },
  { name: "Wellness", icon: "🧘🏽‍♀️" }
]);

/* ========== DEFAULT OFFERS ========== */
const DEFAULT_OFFERS = Object.freeze([
  {
    id: 1,
    title: "Caribbean Brunch for Two",
    business: "Ti Kay Bistro",
    category: "Food",
    state: "MA", city: "Boston", address: "88 Dorchester Ave",
    price: "$29", oldPrice: "$48",
    distance: "0.8 mi", ends: "2h 18m", vip: true,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Enjoy a flavorful Caribbean brunch for two with one drink per person."
  },
  {
    id: 2,
    title: "Luxury Silk Press",
    business: "Glow Beauty Studio",
    category: "Beauty",
    state: "MA", city: "Boston", address: "120 Tremont St",
    price: "$65", oldPrice: "$95",
    distance: "1.3 mi", ends: "Today", vip: false,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Professional wash, conditioning treatment and silk press."
  },
  {
    id: 3,
    title: "Sunset Rooftop Party",
    business: "Skyline Boston",
    category: "Events",
    state: "MA", city: "Boston", address: "500 Atlantic Ave",
    price: "$15", oldPrice: "$30",
    distance: "2.1 mi", ends: "5h 40m", vip: true,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    description: "Live DJ, city views and a welcome drink. 21+ with valid ID."
  },
  {
    id: 4,
    title: "One-Month Gym Pass",
    business: "CoreLab Fitness",
    category: "Fitness",
    state: "MA", city: "Cambridge", address: "45 Mass Ave",
    price: "$39", oldPrice: "$79",
    distance: "1.7 mi", ends: "2 days", vip: false,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    description: "Unlimited gym access and one free personal training assessment."
  },
  {
    id: 5,
    title: "Coffee + Pastry Combo",
    business: "Harbor Café",
    category: "Cafés",
    state: "MA", city: "Boston", address: "10 Long Wharf",
    price: "$7", oldPrice: "$12",
    distance: "0.4 mi", ends: "1h 05m", vip: false,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    description: "Choose any medium coffee and one fresh pastry."
  },
  {
    id: 6,
    title: "Weekend Hotel Escape",
    business: "Beacon Stay",
    category: "Travel",
    state: "NY", city: "New York", address: "200 5th Ave",
    price: "$149", oldPrice: "$229",
    distance: "3.5 mi", ends: "3 days", vip: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "One-night stay, breakfast for two and late checkout."
  },
  {
    id: 7,
    title: "Beach Yoga Session",
    business: "Ocean Flow",
    category: "Wellness",
    state: "CA", city: "Los Angeles", address: "Santa Monica Pier",
    price: "$18", oldPrice: "$35",
    distance: "0.2 mi", ends: "Today", vip: false,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    description: "Sunrise beach yoga — all levels welcome."
  },
  {
    id: 8,
    title: "Deep Dish Pizza Tour",
    business: "Chicago Bites",
    category: "Food",
    state: "IL", city: "Chicago", address: "410 N Michigan Ave",
    price: "$35", oldPrice: "$55",
    distance: "1.0 mi", ends: "2 days", vip: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description: "Taste 3 legendary deep dish pizzas across downtown Chicago."
  }
]);

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

/* ========== SAFE STORAGE ========== */
const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn(`localStorage read failed for "${key}"`, e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`localStorage write failed for "${key}"`, e);
    }
  }
};

/* ========== STATE ========== */
let offers = storage.get("moodkeOffers", [...DEFAULT_OFFERS]);
let favorites = storage.get("moodkeFavorites", []);
let selectedCategory = "All";
let profile = storage.get("moodkeProfile", null);
let currentRole = "user";
let uploadedImageData = null;
let customerLocation = storage.get("moodkeCustomerLocation", { state: "", city: "" });

/* ========== HELPERS ========== */
function persist() {
  storage.set("moodkeOffers", offers);
  storage.set("moodkeFavorites", favorites);
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeUrl(url) {
  if (!url) return FALLBACK_IMAGE;
  const trimmed = String(url).trim();
  if (/^(https?:|data:image\/)/i.test(trimmed)) return trimmed;
  return FALLBACK_IMAGE;
}

function uid() {
  return (crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
}

function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/* ========== LOCATION FILTERING ========== */
function matchesLocation(o) {
  if (!customerLocation.state) return true; // pa gen filt → montre tout
  if (o.state !== customerLocation.state) return false;
  if (customerLocation.city) {
    const needle = customerLocation.city.toLowerCase().trim();
    const hay = (o.city || "").toLowerCase();
    if (!hay.includes(needle)) return false;
  }
  return true;
}

function filteredOffers() {
  return offers.filter(matchesLocation);
}

function isNew(o) {
  if (!o.id || typeof o.id !== "string") return false;
  const created = Number(o.id);
  if (!Number.isFinite(created) || created < 1e12) return false;
  const week = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - created) < week;
}

function populateStateSelect(el, placeholder = "Select a state") {
  if (!el) return;
  const current = el.value;
  el.innerHTML = `<option value="">${placeholder}</option>` +
    US_STATES.map(s => `<option value="${s.code}">${s.name}</option>`).join("");
  if (current) el.value = current;
}

/* ========== CARD TEMPLATES ========== */
function offerCard(o) {
  const liked = favorites.includes(o.id);
  const img = sanitizeUrl(o.image);
  const loc = [o.city, stateName(o.state)].filter(Boolean).join(", ");

  const badgeHtml = isNew(o)
    ? `<div class="badge new">NEW</div>`
    : `<div class="badge ${o.vip ? 'vip' : ''}">${o.vip ? 'VIP' : 'SAVE'}</div>`;

  return `
    <div class="offer" onclick="openOffer('${o.id}')" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openOffer('${o.id}')}">
      <div class="offerimg" style="background-image:url('${escapeHtml(img)}')">
        ${badgeHtml}
        <button class="fav" type="button"
                onclick="event.stopPropagation();toggleFav('${o.id}')"
                aria-label="${liked ? 'Remove from favorites' : 'Add to favorites'}"
                aria-pressed="${liked}">
          ${liked ? '♥' : '♡'}
        </button>
      </div>
      <div class="offerbody">
        <div class="offertitle">${escapeHtml(o.title)}</div>
        <div class="business">${escapeHtml(o.business)} • ${escapeHtml(o.category)}</div>
        ${loc ? `<div class="bizloc">📍 ${escapeHtml(loc)}</div>` : ""}
        <div class="dealrow">
          <div>
            <span class="price">${escapeHtml(o.price)}</span>
            ${o.oldPrice ? `<span class="old">${escapeHtml(o.oldPrice)}</span>` : ""}
          </div>
          <div class="distance">${escapeHtml(o.distance || 'Nearby')}</div>
        </div>
        <div class="countdown">⏳ Ends ${escapeHtml(o.ends || 'soon')}</div>
      </div>
    </div>`;
}

function wideCard(o) {
  const liked = favorites.includes(o.id);
  const img = sanitizeUrl(o.image);
  const loc = [o.city, stateName(o.state)].filter(Boolean).join(", ");
  const isNewOffer = isNew(o);

  return `
    <div class="wideoffer" onclick="openOffer('${o.id}')" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openOffer('${o.id}')}">
      <div class="thumb" style="background-image:url('${escapeHtml(img)}')"></div>
      <div class="content">
        ${isNewOffer ? `<div style="font-size:10px;font-weight:900;color:#10b981;letter-spacing:.4px;margin-bottom:3px">🆕 NEW</div>` : ""}
        <div class="offertitle">${escapeHtml(o.title)}</div>
        <div class="business">${escapeHtml(o.business)} • ${escapeHtml(o.category)}</div>
        ${loc ? `<div class="bizloc">📍 ${escapeHtml(loc)}</div>` : ""}
        <div>
          <span class="price">${escapeHtml(o.price)}</span>
          ${o.oldPrice ? `<span class="old">${escapeHtml(o.oldPrice)}</span>` : ""}
        </div>
        <div class="countdown">⏳ ${escapeHtml(o.ends || 'Limited time')}</div>
      </div>
      <button class="fav" type="button"
              style="position:relative;top:9px;right:9px"
              onclick="event.stopPropagation();toggleFav('${o.id}')"
              aria-label="${liked ? 'Remove from favorites' : 'Add to favorites'}"
              aria-pressed="${liked}">
        ${liked ? '♥' : '♡'}
      </button>
    </div>`;
}

/* ========== RENDER ========== */
function renderAll() {
  const chipsEl = document.getElementById("categoryChips");
  if (chipsEl) {
    chipsEl.innerHTML = CATEGORIES.slice(0, 8)
      .map(c => `<button class="chip ${selectedCategory === c.name ? 'active' : ''}"
                        type="button"
                        onclick="selectCategory('${c.name}')">${c.icon} ${c.name}</button>`)
      .join("");
  }

  const homeEl = document.getElementById("homeOffers");
  if (homeEl) {
    const list = filteredOffers();
    const home = selectedCategory === "All"
      ? list
      : list.filter(o => o.category === selectedCategory);
    homeEl.innerHTML = home.slice(0, 4).map(offerCard).join("")
      || `<div class="empty">No offers available in your area yet.</div>`;
  }

  const newSection = document.getElementById("newSection");
  const newEl = document.getElementById("newOffers");
  if (newSection && newEl) {
    const newOnes = filteredOffers().filter(isNew).slice(0, 3);
    if (newOnes.length) {
      newSection.style.display = "block";
      newEl.innerHTML = newOnes.map(wideCard).join("");
    } else {
      newSection.style.display = "none";
      newEl.innerHTML = "";
    }
  }

  const endingEl = document.getElementById("endingOffers");
  if (endingEl) {
    endingEl.innerHTML = filteredOffers().slice(0, 3).map(wideCard).join("")
      || `<div class="empty">Nothing ending soon here.</div>`;
  }

  const catGridEl = document.getElementById("categoryGrid");
  if (catGridEl) {
    catGridEl.innerHTML = CATEGORIES
      .filter(c => c.name !== "All")
      .map(c => `<button class="category" type="button"
                        onclick="selectCategory('${c.name}');go('search')">
                  <span>${c.icon}</span>${c.name}
                </button>`)
      .join("");
  }

  const filterEl = document.getElementById("filterChips");
  if (filterEl) {
    filterEl.innerHTML = CATEGORIES.slice(0, 8)
      .map(c => `<button class="chip ${selectedCategory === c.name ? 'active' : ''}"
                        type="button"
                        onclick="selectCategory('${c.name}');renderSearch()">${c.name}</button>`)
      .join("");
  }

  renderSearch();
  renderFavorites();
  renderMap();
  renderBusiness();
  renderProfile();
  renderLocationLabel();

  const savedStat = document.getElementById("savedStat");
  const bizStat = document.getElementById("saveBizStat");
  if (savedStat) savedStat.textContent = favorites.length;
  if (bizStat) bizStat.textContent = 86 + favorites.length;
}

function renderLocationLabel() {
  const label = document.getElementById("locationLabel");
  const btn = document.getElementById("locationBtn");
  const mapLabel = document.getElementById("mapLocationLabel");
  if (label) {
    if (customerLocation.state) {
      const parts = [customerLocation.city, stateName(customerLocation.state)].filter(Boolean);
      label.textContent = parts.join(", ");
      btn?.classList.add("active");
    } else {
      label.textContent = "🌎 All locations";
      btn?.classList.remove("active");
    }
  }
  if (mapLabel) {
    mapLabel.textContent = customerLocation.state
      ? `Offers in ${[customerLocation.city, stateName(customerLocation.state)].filter(Boolean).join(", ")}`
      : "All offers";
  }
}

function renderSearch() {
  const searchInput = document.getElementById("searchInput");
  const resultsEl = document.getElementById("searchResults");
  const countEl = document.getElementById("resultCount");
  if (!resultsEl) return;

  const q = (searchInput?.value || "").toLowerCase().trim();
  const result = filteredOffers().filter(o => {
    const matchesCat = selectedCategory === "All" || o.category === selectedCategory;
    const haystack = `${o.title} ${o.business} ${o.category} ${o.city || ""} ${stateName(o.state)}`.toLowerCase();
    return matchesCat && haystack.includes(q);
  });

  resultsEl.innerHTML = result.map(wideCard).join("")
    || `<div class="empty">
          <div style="font-size:40px">🔍</div>
          <h3>No results</h3>
          <p>Try another category or change your location filter.</p>
        </div>`;
  if (countEl) countEl.textContent = `${result.length} found`;
}

function renderFavorites() {
  const el = document.getElementById("favoriteList");
  if (!el) return;
  const saved = filteredOffers().filter(o => favorites.includes(o.id));
  el.innerHTML = saved.map(wideCard).join("") || `
    <div class="empty">
      <div style="font-size:45px">♡</div>
      <h3>No favorites yet</h3>
      <p>Tap the heart on an offer to save it here.</p>
    </div>`;
}

function renderMap() {
  const el = document.getElementById("mapBox");
  if (!el) return;
  const positions = [[20, 18], [67, 22], [36, 48], [73, 62], [18, 72], [50, 80]];
  el.innerHTML =
    `<div class="road r1"></div><div class="road r2"></div>` +
    filteredOffers().slice(0, 6).map((o, i) => {
      const [left, top] = positions[i] || [50, 50];
      return `<button class="pin" type="button"
                      style="left:${left}%;top:${top}%"
                      onclick="openOffer('${o.id}')"
                      aria-label="Open ${escapeHtml(o.title)}">
                <span>$</span>
              </button>`;
    }).join("");
}

function renderBusiness() {
  const el = document.getElementById("businessOffers");
  if (!el) return;
  const mine = offers.slice(-3).reverse();
  el.innerHTML = mine.map(wideCard).join("")
    || `<div class="empty">You have no offers yet. Create your first one!</div>`;
}

/* ========== PROFILE ========== */
function renderProfile() {
  const noProf = document.getElementById("noProfile");
  const form = document.getElementById("createProfileForm");
  const active = document.getElementById("profileActive");
  if (!noProf || !form || !active) return;

  if (!profile) {
    noProf.style.display = "block";
    form.style.display = "none";
    active.style.display = "none";
    return;
  }

  noProf.style.display = "none";
  form.style.display = "none";
  active.style.display = "block";

  const initials = (profile.name || "?").trim().split(/\s+/)
    .map(w => w[0]?.toUpperCase() || "").slice(0, 2).join("") || "?";

  document.getElementById("profileAvatar").textContent = initials;
  document.getElementById("profileName").textContent = profile.name || "User";

  const meta = profile.type === "business"
    ? `${profile.businessName || "Business"} • ${profile.businessCategory || ""}`
    : "Moodke Explorer";
  document.getElementById("profileMeta").textContent = meta;

  const roleToggle = document.querySelector(".roleToggle");
  if (roleToggle) roleToggle.style.display = profile.type === "business" ? "flex" : "none";

  const bizNameLabel = document.getElementById("bizNameLabel");
  const bizCatLabel = document.getElementById("bizCatLabel");
  const bizAddrLabel = document.getElementById("bizAddrLabel");
  if (bizNameLabel) bizNameLabel.textContent = profile.businessName || "—";
  if (bizCatLabel) bizCatLabel.textContent = profile.businessCategory || "—";
  if (bizAddrLabel) {
    const parts = [profile.address, profile.city, stateName(profile.state)].filter(Boolean);
    bizAddrLabel.textContent = parts.join(", ") || "—";
  }

  if (profile.type === "personal") {
    document.getElementById("businessPanel").style.display = "none";
    document.getElementById("customerMenu").style.display = "block";
  } else {
    setRole(currentRole);
  }
}

function startProfile(type) {
  document.getElementById("noProfile").style.display = "none";
  document.getElementById("createProfileForm").style.display = "block";
  document.getElementById("profileActive").style.display = "none";

  document.getElementById("profileFormTitle").textContent =
    type === "business" ? "Create business profile" : "Create personal profile";

  document.getElementById("bizFields").style.display =
    type === "business" ? "block" : "none";

  const bizName = document.getElementById("pf-biz");
  if (bizName) bizName.required = type === "business";

  const stateSel = document.getElementById("pf-state");
  populateStateSelect(stateSel, "Select a state");
  if (stateSel) stateSel.required = type === "business";

  window.__pendingProfileType = type;
}

function cancelProfile() {
  window.__pendingProfileType = null;
  renderProfile();
}

function saveProfile(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const type = window.__pendingProfileType || "personal";

  profile = {
    type,
    name: (f.get("name") || "").trim(),
    email: (f.get("email") || "").trim(),
    phone: (f.get("phone") || "").trim(),
    businessName: type === "business" ? (f.get("businessName") || "").trim() : "",
    businessCategory: type === "business" ? (f.get("businessCategory") || "") : "",
    state: type === "business" ? (f.get("state") || "") : "",
    city: type === "business" ? (f.get("city") || "").trim() : "",
    address: type === "business" ? (f.get("address") || "").trim() : ""
  };

  storage.set("moodkeProfile", profile);
  window.__pendingProfileType = null;
  currentRole = "user";

  e.target.reset();
  renderProfile();
  showToast("Profile created ✓");
}

function logout() {
  if (!confirm("Log out and delete this profile?")) return;
  profile = null;
  currentRole = "user";
  storage.set("moodkeProfile", null);
  renderProfile();
  showToast("Logged out");
}

/* ========== LOCATION FILTER ========== */
function openLocationModal() {
  const modal = document.getElementById("locationModal");
  const stateSel = document.getElementById("loc-state");
  const cityInput = document.getElementById("loc-city");

  populateStateSelect(stateSel, "All states");
  if (stateSel) stateSel.value = customerLocation.state || "";
  if (cityInput) cityInput.value = customerLocation.city || "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function saveLocation(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  customerLocation = {
    state: f.get("state") || "",
    city: (f.get("city") || "").trim()
  };
  storage.set("moodkeCustomerLocation", customerLocation);
  closeModal("locationModal");
  renderAll();
  showToast(customerLocation.state
    ? `Showing offers in ${[customerLocation.city, stateName(customerLocation.state)].filter(Boolean).join(", ")}`
    : "Showing all offers");
}

function clearLocation() {
  customerLocation = { state: "", city: "" };
  storage.set("moodkeCustomerLocation", customerLocation);
  closeModal("locationModal");
  renderAll();
  showToast("🌎 Showing all locations");
}

/* ========== ACTIONS ========== */
function selectCategory(name) {
  selectedCategory = name;
  renderAll();
}

function toggleFav(id) {
  id = String(id);
  favorites = favorites.includes(id)
    ? favorites.filter(x => String(x) !== id)
    : [...favorites, id];
  persist();
  renderAll();
  showToast(favorites.includes(id) ? "Saved to favorites" : "Removed from favorites");
}

function openOffer(id) {
  const o = offers.find(x => String(x.id) === String(id));
  if (!o) return;

  const liked = favorites.some(f => String(f) === String(o.id));
  const img = sanitizeUrl(o.image);
  const loc = [o.address, o.city, stateName(o.state)].filter(Boolean).join(", ");

  document.getElementById("detailContent").innerHTML = `
    <div class="detailimg" style="background-image:url('${escapeHtml(img)}')"></div>
    <div style="display:flex;justify-content:space-between;align-items:start;gap:10px;margin-top:16px">
      <div>
        <div class="badge ${isNew(o) ? 'new' : (o.vip ? 'vip' : '')}" style="position:static;display:inline-block">
          ${isNew(o) ? '🆕 NEW' : (o.vip ? 'VIP EXPERIENCE' : 'SPECIAL OFFER')}
        </div>
        <h2 style="margin:10px 0 4px">${escapeHtml(o.title)}</h2>
        <div class="business">${escapeHtml(o.business)} • ${escapeHtml(o.category)}</div>
        ${loc ? `<div class="bizloc" style="margin-top:6px">📍 ${escapeHtml(loc)}</div>` : ""}
      </div>
      <button class="iconbtn" type="button"
              onclick="toggleFav('${o.id}')"
              aria-label="${liked ? 'Remove from favorites' : 'Add to favorites'}"
              aria-pressed="${liked}">
        ${liked ? '♥' : '♡'}
      </button>
    </div>
    <p style="color:var(--muted);line-height:1.55">
      ${escapeHtml(o.description || 'A special local experience available for a limited time.')}
    </p>
    <div class="card" style="background:var(--primary-soft);box-shadow:none">
      <div class="dealrow">
        <div>
          ${o.oldPrice ? `<div class="old">${escapeHtml(o.oldPrice)}</div>` : ""}
          <div class="price" style="font-size:30px">${escapeHtml(o.price)}</div>
        </div>
        <div class="countdown">⏳ Ends ${escapeHtml(o.ends || 'soon')}</div>
      </div>
    </div>
    <button class="primarybtn" type="button" onclick="reserveOffer()">
      ${o.vip ? 'Reserve VIP offer' : 'Claim offer'}
    </button>
    <button class="secondarybtn" type="button" onclick="showToast('Directions opened')">
      Get directions
    </button>
  `;
  const modal = document.getElementById("detailModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function reserveOffer() {
  showToast("Offer reserved successfully ✓");
  closeModal("detailModal");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openCreateOffer() {
  if (profile?.type !== "business") {
    showToast("Only business accounts can create offers");
    return;
  }

  const stateSel = document.getElementById("of-state");
  const cityInput = document.getElementById("of-city");
  const addrInput = document.getElementById("of-addr");
  const bizInput = document.getElementById("of-biz");

  populateStateSelect(stateSel, "Select state");
  if (stateSel) stateSel.value = profile.state || "";
  if (cityInput) cityInput.value = profile.city || "";
  if (addrInput) addrInput.value = profile.address || "";
  if (bizInput && !bizInput.value) bizInput.value = profile.businessName || "";

  const modal = document.getElementById("createModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function createOffer(e) {
  e.preventDefault();
  if (profile?.type !== "business") {
    showToast("Only business accounts can publish offers");
    return;
  }

  const f = new FormData(e.target);

  const state = f.get("state") || "";
  const city = (f.get("city") || "").trim();
  if (!state || !city) {
    showToast("State and city are required");
    return;
  }

  const o = {
    id: uid(),
    title: (f.get("title") || "").trim(),
    business: (f.get("business") || "").trim(),
    category: f.get("category") || "Food",
    state,
    city,
    address: (f.get("address") || "").trim(),
    price: (f.get("price") || "").trim(),
    oldPrice: (f.get("oldPrice") || "").trim(),
    description: (f.get("description") || "").trim(),
    vip: f.get("vip") === "on",
    distance: "New",
    ends: "7 days",
    image: uploadedImageData || FALLBACK_IMAGE
  };

  if (!o.title || !o.business || !o.price) {
    showToast("Please fill in required fields");
    return;
  }

  offers.push(o);
  persist();
  renderAll();
  e.target.reset();
  clearUpload();
  closeModal("createModal");

  const locLabel = [city, stateName(state)].filter(Boolean).join(", ");
  showToast(`🆕 Offer published in ${locLabel} ✓`);
}

/* ========== IMAGE UPLOAD ========== */
function setupUpload() {
  const zone = document.getElementById("uploadZone");
  const input = document.getElementById("offerImage");
  if (!zone || !input) return;

  input.addEventListener("change", e => handleFile(e.target.files[0]));

  ["dragenter", "dragover"].forEach(ev =>
    zone.addEventListener(ev, e => {
      e.preventDefault();
      zone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach(ev =>
    zone.addEventListener(ev, e => {
      e.preventDefault();
      zone.classList.remove("dragover");
    })
  );
  zone.addEventListener("drop", e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  });
}

function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast("Image too large (max 5MB)");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    uploadedImageData = e.target.result;
    const preview = document.getElementById("uploadPreview");
    const placeholder = document.getElementById("uploadPlaceholder");
    const removeBtn = document.getElementById("uploadRemove");

    preview.src = uploadedImageData;
    preview.style.display = "block";
    placeholder.style.display = "none";
    removeBtn.style.display = "grid";
  };
  reader.onerror = () => showToast("Could not read image");
  reader.readAsDataURL(file);
}

function clearUpload() {
  uploadedImageData = null;
  const input = document.getElementById("offerImage");
  const preview = document.getElementById("uploadPreview");
  const placeholder = document.getElementById("uploadPlaceholder");
  const removeBtn = document.getElementById("uploadRemove");

  if (input) input.value = "";
  if (preview) { preview.src = ""; preview.style.display = "none"; }
  if (placeholder) placeholder.style.display = "flex";
  if (removeBtn) removeBtn.style.display = "none";
}

/* ========== ROLE ========== */
function setRole(role) {
  if (profile?.type === "personal") role = "user";
  const biz = role === "business";
  currentRole = role;

  const bizPanel = document.getElementById("businessPanel");
  const custMenu = document.getElementById("customerMenu");
  if (bizPanel) bizPanel.style.display = biz ? "block" : "none";
  if (custMenu) custMenu.style.display = biz ? "none" : "block";
  document.getElementById("businessRoleBtn")?.classList.toggle("active", biz);
  document.getElementById("userRoleBtn")?.classList.toggle("active", !biz);
}

/* ========== NAV ========== */
function go(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page)?.classList.add("active");
  document.querySelectorAll(".navbtn").forEach(b =>
    b.classList.toggle("active", b.dataset.page === page)
  );
  if (page === "search") renderSearch();
  if (page === "favorites") renderFavorites();
  if (page === "profile") renderProfile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => { t.style.display = "none"; }, 2400);
}

/* ========== EVENTS ========== */
function bindEvents() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(renderSearch, 180));
  }

  document.getElementById("searchBtn")
    ?.addEventListener("click", () => go("search"));

  document.getElementById("notifBtn")
    ?.addEventListener("click", () => showToast("No new notifications"));

  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", e => {
      if (e.target === m) closeModal(m.id);
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(m => closeModal(m.id));
    }
  });

  setupUpload();
}

/* ========== INIT ========== */
function init() {
  populateStateSelect(document.getElementById("loc-state"), "All states");
  populateStateSelect(document.getElementById("of-state"), "Select state");
  populateStateSelect(document.getElementById("pf-state"), "Select a state");

  bindEvents();
  renderAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* =========================================================
   PWA — Service Worker Registration
   ========================================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('✅ SW registered:', reg.scope))
      .catch(err => console.warn('⚠️ SW registration failed:', err));
  });
}

/* =========================================================
   PWA — Install prompt (Android / Desktop)
   ========================================================= */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Montre yon ti bouton enstale (opsyonèl)
  showInstallButton();
});

function showInstallButton() {
  if (document.getElementById('pwaInstallBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'pwaInstallBtn';
  btn.className = 'pwa-install';
  btn.type = 'button';
  btn.textContent = '📲 Install Moodke';
  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('Install outcome:', outcome);
    deferredPrompt = null;
    btn.remove();
  });
  document.body.appendChild(btn);
}

window.addEventListener('appinstalled', () => {
  console.log('✅ Moodke installed');
  const btn = document.getElementById('pwaInstallBtn');
  if (btn) btn.remove();
  showToast('🎉 Moodke installed!');
});