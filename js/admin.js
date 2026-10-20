/* =========================================================
   MOODKE ADMIN — Logic
   ========================================================= */

const cfg = window.MOODKE_CONFIG;
const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

let currentAdmin = null;
let currentPage = "dashboard";
let allData = { users: [], businesses: [], offers: [], payments: [], boosts: [] };
let filters = { users: { q: "", role: "" }, payments: { type: "", status: "" } };

/* ========== HELPERS ========== */
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function esc(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtMoney(n) {
  const num = parseFloat(n) || 0;
  return "$" + num.toFixed(2);
}
function showToast(msg, type = "") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show " + type;
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => t.className = "toast", 2800);
}

/* ========== AUTH ========== */
async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return showLogin();

  const { data: profile, error } = await sb.from("profiles")
    .select("*").eq("id", session.user.id).single();

  if (error || !profile || profile.role !== "admin") {
    await sb.auth.signOut();
    return showLogin("Your account is not an admin.");
  }

  currentAdmin = { ...session.user, ...profile };
  showAdminApp();
}

function showLogin(err = "") {
  $("#loginScreen").style.display = "flex";
  $("#adminApp").style.display = "none";
  if (err) $("#loginError").textContent = err;
}

async function showAdminApp() {
  $("#loginScreen").style.display = "none";
  $("#adminApp").style.display = "grid";
  $("#adminUserEmail").textContent = currentAdmin.email || "admin";
  await loadAllData();
  renderPage();
}

async function handleLogin(e) {
  e.preventDefault();
  const email = $("#adminEmail").value.trim();
  const password = $("#adminPassword").value;
  $("#loginError").textContent = "";
  $("#adminLoginForm button").disabled = true;
  $("#adminLoginForm button").textContent = "Signing in...";

  const { data, error } = await sb.auth.signInWithPassword({ email, password });

  if (error) {
    $("#loginError").textContent = error.message;
    $("#adminLoginForm button").disabled = false;
    $("#adminLoginForm button").textContent = "Sign in";
    return;
  }

  const { data: profile } = await sb.from("profiles")
    .select("*").eq("id", data.user.id).single();

  if (!profile || profile.role !== "admin") {
    await sb.auth.signOut();
    $("#loginError").textContent = "This account is not an admin.";
    $("#adminLoginForm button").disabled = false;
    $("#adminLoginForm button").textContent = "Sign in";
    return;
  }

  currentAdmin = { ...data.user, ...profile };
  showAdminApp();
}

async function handleLogout() {
  await sb.auth.signOut();
  currentAdmin = null;
  showLogin();
}

/* ========== DATA LOADING ========== */
async function loadAllData() {
  const [users, businesses, offers, payments, boosts] = await Promise.all([
    sb.from("profiles").select("*").order("created_at", { ascending: false }),
    sb.from("businesses").select("*").order("created_at", { ascending: false }),
    sb.from("offers").select("*").order("created_at", { ascending: false }),
    sb.from("payments").select("*").order("created_at", { ascending: false }),
    sb.from("boosts").select("*").order("created_at", { ascending: false })
  ]);

  allData.users = users.data || [];
  allData.businesses = businesses.data || [];
  allData.offers = offers.data || [];
  allData.payments = payments.data || [];
  allData.boosts = boosts.data || [];

  if (users.error) console.error("Users:", users.error);
  if (businesses.error) console.error("Businesses:", businesses.error);
  if (offers.error) console.error("Offers:", offers.error);
  if (payments.error) console.error("Payments:", payments.error);
  if (boosts.error) console.error("Boosts:", boosts.error);
}

/* ========== NAVIGATION ========== */
function navigate(page) {
  currentPage = page;
  $$(".sb-btn").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  renderPage();
}

/* ========== PAGE RENDERER ========== */
function renderPage() {
  const titles = {
    dashboard: ["Dashboard", "Overview of your platform"],
    users: ["Users", "All accounts on your platform"],
    businesses: ["Businesses", "Businesses and their subscription plans"],
    offers: ["Offers", "All published offers"],
    payments: ["Payments", "All transactions"],
    boosts: ["Boosts", "Active and past boosts"],
    reports: ["Reports", "Platform analytics"]
  };
  $("#pageTitle").textContent = titles[currentPage][0];
  $("#pageSubtitle").textContent = titles[currentPage][1];

  const content = $("#pageContent");
  const renderers = {
    dashboard: renderDashboard,
    users: renderUsers,
    businesses: renderBusinesses,
    offers: renderOffers,
    payments: renderPayments,
    boosts: renderBoosts,
    reports: renderReports
  };
  content.innerHTML = renderers[currentPage]();
}

/* ========== DASHBOARD ========== */
function renderDashboard() {
  const totalUsers = allData.users.length;
  const totalBusinesses = allData.users.filter(u => u.role === "business").length;
  const totalOffers = allData.offers.length;
  const activeBoosts = allData.boosts.filter(b => b.status === "active").length;

  const totalRevenue = allData.payments
    .filter(p => p.status === "succeeded")
    .reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  const monthlyRevenue = allData.payments
    .filter(p => p.status === "succeeded" && new Date(p.created_at) > new Date(Date.now() - 30 * 864e5))
    .reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  const revenueByType = {};
  allData.payments.filter(p => p.status === "succeeded").forEach(p => {
    revenueByType[p.type] = (revenueByType[p.type] || 0) + parseFloat(p.amount);
  });

  const recentUsers = allData.users.slice(0, 5);

  return `
    <div class="stat-grid">
      <div class="stat-card highlight">
        <div class="stat-label">💰 Total revenue</div>
        <div class="stat-value">${fmtMoney(totalRevenue)}</div>
        <div class="stat-sub">${fmtMoney(monthlyRevenue)} last 30 days</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">👥 Users</div>
        <div class="stat-value">${totalUsers}</div>
        <div class="stat-sub">${totalBusinesses} businesses</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">🎁 Offers</div>
        <div class="stat-value">${totalOffers}</div>
        <div class="stat-sub">Published</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">🚀 Active boosts</div>
        <div class="stat-value">${activeBoosts}</div>
        <div class="stat-sub">${allData.boosts.length} total</div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar"><h2>💰 Revenue breakdown</h2></div>
      <table class="data-table">
        <thead><tr><th>Type</th><th>Amount</th></tr></thead>
        <tbody>
          <tr>
            <td><span class="badge type-subscription">Subscription</span></td>
            <td>${fmtMoney(revenueByType.subscription || 0)}</td>
          </tr>
          <tr>
            <td><span class="badge type-boost">Boost</span></td>
            <td>${fmtMoney(revenueByType.boost || 0)}</td>
          </tr>
          <tr>
            <td><span class="badge type-service_fee">Service fee</span></td>
            <td>${fmtMoney(revenueByType.service_fee || 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar"><h2>🆕 Recent signups</h2></div>
      <table class="data-table">
        <thead><tr><th>User</th><th>Role</th><th>Joined</th></tr></thead>
        <tbody>
          ${recentUsers.map(u => `
            <tr>
              <td>
                <div class="cell-user">
                  <div class="avatar ${u.role === 'business' ? 'biz' : ''}">
                    ${(u.full_name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div class="cell-user-info">
                    <strong>${esc(u.full_name || '—')}</strong>
                    <small>${esc(u.email || '—')}</small>
                  </div>
                </div>
              </td>
              <td><span class="badge ${u.role}">${u.role}</span></td>
              <td>${fmtDate(u.created_at)}</td>
            </tr>
          `).join("") || `<tr><td colspan="3" class="empty-state"><p>No users yet</p></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== USERS ========== */
function renderUsers() {
  const q = filters.users.q.toLowerCase();
  const role = filters.users.role;

  let list = allData.users;
  if (q) list = list.filter(u =>
    `${u.full_name} ${u.email}`.toLowerCase().includes(q)
  );
  if (role) list = list.filter(u => u.role === role);

  return `
    <div class="table-wrapper">
      <div class="table-toolbar">
        <h2>All users (${list.length})</h2>
        <div class="table-toolbar-filters">
          <input type="search" class="search-input" placeholder="Search name or email..."
                 value="${esc(filters.users.q)}"
                 oninput="filters.users.q=this.value;renderPage()" />
          <select class="filter-select" onchange="filters.users.role=this.value;renderPage()">
            <option value="">All roles</option>
            <option value="personal" ${role==='personal'?'selected':''}>Personal</option>
            <option value="business" ${role==='business'?'selected':''}>Business</option>
            <option value="admin" ${role==='admin'?'selected':''}>Admin</option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(u => `
            <tr>
              <td>
                <div class="cell-user">
                  <div class="avatar ${u.role === 'business' ? 'biz' : ''} ${u.status === 'suspended' ? 'suspended' : ''}">
                    ${(u.full_name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div class="cell-user-info">
                    <strong>${esc(u.full_name || '—')}</strong>
                    <small>${esc(u.email || '—')}</small>
                  </div>
                </div>
              </td>
              <td><span class="badge ${u.role}">${u.role}</span></td>
              <td>
                <span class="badge ${u.status === 'suspended' ? 'suspended' : 'active'}">
                  ${u.status || 'active'}
                </span>
              </td>
              <td>${fmtDate(u.created_at)}</td>
              <td>
                <div class="row-actions">
                  <button class="btn-icon" title="Toggle status"
                          onclick="toggleUserStatus('${u.id}')">
                    ${u.status === 'suspended' ? '✅' : '⏸'}
                  </button>
                  ${u.role !== 'admin' ? `
                    <button class="btn-icon" title="Make admin"
                            onclick="makeAdmin('${u.id}')">👑</button>
                    <button class="btn-icon danger" title="Delete"
                            onclick="deleteUser('${u.id}')">🗑</button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `).join("") || `
            <tr><td colspan="5">
              <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>No users found</h3>
                <p>Try changing your filters</p>
              </div>
            </td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== BUSINESSES ========== */
function renderBusinesses() {
  return `
    <div class="table-wrapper">
      <div class="table-toolbar">
        <h2>All businesses (${allData.businesses.length})</h2>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Business</th>
            <th>Location</th>
            <th>Plan</th>
            <th>Offers</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${allData.businesses.map(b => {
            const owner = allData.users.find(u => u.id === b.owner_id);
            const offerCount = allData.offers.filter(o => o.business_id === b.id).length;
            return `
              <tr>
                <td>
                  <div class="cell-user">
                    <div class="avatar biz">🏪</div>
                    <div class="cell-user-info">
                      <strong>${esc(b.name)}</strong>
                      <small>${esc(owner?.email || '—')}</small>
                    </div>
                  </div>
                </td>
                <td>${esc(b.city)}, ${esc(b.state_code)}</td>
                <td><span class="badge plan-${b.plan}">${(b.plan || 'free').toUpperCase()}</span></td>
                <td>${offerCount}</td>
                <td>
                  <div class="row-actions">
                    <button class="btn-icon" title="Change plan"
                            onclick="cycleBizPlan('${b.id}')">💎</button>
                    <button class="btn-icon danger" title="Delete business"
                            onclick="deleteBusiness('${b.id}')">🗑</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("") || `
            <tr><td colspan="5">
              <div class="empty-state">
                <div class="empty-icon">🏪</div>
                <h3>No businesses yet</h3>
              </div>
            </td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== OFFERS ========== */
function renderOffers() {
  return `
    <div class="table-wrapper">
      <div class="table-toolbar">
        <h2>All offers (${allData.offers.length})</h2>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Offer</th>
            <th>Business</th>
            <th>Location</th>
            <th>Price</th>
            <th>Boost</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${allData.offers.map(o => {
            const biz = allData.businesses.find(b => b.id === o.business_id);
            const isBoosted = allData.boosts.some(bo =>
              bo.offer_id === o.id && bo.status === "active" &&
              new Date(bo.ends_at) > new Date()
            );
            return `
              <tr>
                <td>
                  <div class="cell-user">
                    <div class="avatar" style="background-image:url('${esc(o.image_url)}');background-size:cover;color:transparent">
                      ${esc(o.title[0] || '?')}
                    </div>
                    <div class="cell-user-info">
                      <strong>${esc(o.title)}</strong>
                      <small>${esc(o.category)}</small>
                    </div>
                  </div>
                </td>
                <td>${esc(biz?.name || '—')}</td>
                <td>${esc(o.city)}, ${esc(o.state_code)}</td>
                <td>${fmtMoney(o.price)}</td>
                <td>
                  ${isBoosted
                    ? `<span class="badge boosted">🚀 Boosted</span>`
                    : o.vip ? `<span class="badge vip">VIP</span>` : `—`}
                </td>
                <td>
                  <div class="row-actions">
                    <button class="btn-icon" title="Toggle VIP"
                            onclick="toggleOfferVip('${o.id}', ${o.vip})">⭐</button>
                    <button class="btn-icon danger" title="Delete"
                            onclick="deleteOffer('${o.id}')">🗑</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("") || `
            <tr><td colspan="6">
              <div class="empty-state">
                <div class="empty-icon">🎁</div>
                <h3>No offers yet</h3>
              </div>
            </td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== PAYMENTS ========== */
function renderPayments() {
  const type = filters.payments.type;
  const status = filters.payments.status;

  let list = allData.payments;
  if (type) list = list.filter(p => p.type === type);
  if (status) list = list.filter(p => p.status === status);

  const total = list.filter(p => p.status === "succeeded")
    .reduce((s, p) => s + parseFloat(p.amount), 0);

  return `
    <div class="table-wrapper">
      <div class="table-toolbar">
        <h2>Payments (${list.length}) • ${fmtMoney(total)}</h2>
        <div class="table-toolbar-filters">
          <select class="filter-select" onchange="filters.payments.type=this.value;renderPage()">
            <option value="">All types</option>
            <option value="subscription" ${type==='subscription'?'selected':''}>Subscription</option>
            <option value="boost" ${type==='boost'?'selected':''}>Boost</option>
            <option value="service_fee" ${type==='service_fee'?'selected':''}>Service fee</option>
          </select>
          <select class="filter-select" onchange="filters.payments.status=this.value;renderPage()">
            <option value="">All statuses</option>
            <option value="succeeded" ${status==='succeeded'?'selected':''}>Succeeded</option>
            <option value="pending" ${status==='pending'?'selected':''}>Pending</option>
            <option value="failed" ${status==='failed'?'selected':''}>Failed</option>
            <option value="refunded" ${status==='refunded'?'selected':''}>Refunded</option>
          </select>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Business</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(p => {
            const biz = allData.businesses.find(b => b.id === p.business_id);
            return `
              <tr>
                <td>${fmtDate(p.created_at)}</td>
                <td><span class="badge type-${p.type}">${p.type.replace('_', ' ')}</span></td>
                <td>${esc(biz?.name || '—')}</td>
                <td><strong>${fmtMoney(p.amount)}</strong></td>
                <td><span class="badge ${p.status}">${p.status}</span></td>
              </tr>
            `;
          }).join("") || `
            <tr><td colspan="5">
              <div class="empty-state">
                <div class="empty-icon">💰</div>
                <h3>No payments yet</h3>
              </div>
            </td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== BOOSTS ========== */
function renderBoosts() {
  return `
    <div class="table-wrapper">
      <div class="table-toolbar">
        <h2>Boosts (${allData.boosts.length})</h2>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Offer</th>
            <th>Business</th>
            <th>Amount</th>
            <th>Period</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${allData.boosts.map(b => {
            const offer = allData.offers.find(o => o.id === b.offer_id);
            const biz = allData.businesses.find(x => x.id === b.business_id);
            return `
              <tr>
                <td>${esc(offer?.title || '—')}</td>
                <td>${esc(biz?.name || '—')}</td>
                <td><strong>${fmtMoney(b.amount)}</strong></td>
                <td>${fmtDate(b.starts_at)} → ${fmtDate(b.ends_at)}</td>
                <td><span class="badge ${b.status}">${b.status}</span></td>
              </tr>
            `;
          }).join("") || `
            <tr><td colspan="5">
              <div class="empty-state">
                <div class="empty-icon">🚀</div>
                <h3>No boosts yet</h3>
              </div>
            </td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== REPORTS ========== */
function renderReports() {
  const revenueByMonth = {};
  allData.payments.filter(p => p.status === "succeeded").forEach(p => {
    const key = new Date(p.created_at).toISOString().slice(0, 7);
    revenueByMonth[key] = (revenueByMonth[key] || 0) + parseFloat(p.amount);
  });

  const months = Object.keys(revenueByMonth).sort().slice(-6);
  const max = Math.max(...months.map(m => revenueByMonth[m]), 1);

  return `
    <div class="table-wrapper">
      <div class="table-toolbar"><h2>📊 Revenue last 6 months</h2></div>
      <div style="padding:24px">
        ${months.map(m => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span>${m}</span>
              <strong>${fmtMoney(revenueByMonth[m])}</strong>
            </div>
            <div style="height:8px;background:var(--bg-soft);border-radius:999px;overflow:hidden">
              <div style="height:100%;width:${(revenueByMonth[m] / max) * 100}%;background:var(--gradient);border-radius:999px"></div>
            </div>
          </div>
        `).join("") || `<p style="color:var(--muted);text-align:center">No revenue data yet</p>`}
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar"><h2>📈 Users by role</h2></div>
      <table class="data-table">
        <tbody>
          ${["personal", "business", "admin"].map(role => `
            <tr>
              <td><span class="badge ${role}">${role}</span></td>
              <td>${allData.users.filter(u => u.role === role).length} users</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* ========== ACTIONS ========== */
async function toggleUserStatus(userId) {
  const user = allData.users.find(u => u.id === userId);
  const newStatus = user.status === "suspended" ? "active" : "suspended";
  const { error } = await sb.from("profiles").update({ status: newStatus }).eq("id", userId);
  if (error) return showToast(error.message, "error");
  user.status = newStatus;
  showToast(`User ${newStatus}`, "success");
  renderPage();
}

async function makeAdmin(userId) {
  if (!confirm("Promote this user to admin?")) return;
  const { error } = await sb.from("profiles").update({ role: "admin" }).eq("id", userId);
  if (error) return showToast(error.message, "error");
  showToast("User is now admin", "success");
  await loadAllData();
  renderPage();
}

async function deleteUser(userId) {
  if (!confirm("Delete this user permanently? This will cascade to their business and offers.")) return;
  const { error } = await sb.from("profiles").delete().eq("id", userId);
  if (error) return showToast(error.message, "error");
  showToast("User deleted", "success");
  await loadAllData();
  renderPage();
}

async function cycleBizPlan(bizId) {
  const biz = allData.businesses.find(b => b.id === bizId);
  const plans = ["free", "pro", "premium"];
  const idx = plans.indexOf(biz.plan || "free");
  const newPlan = plans[(idx + 1) % plans.length];
  const { error } = await sb.from("businesses").update({ plan: newPlan }).eq("id", bizId);
  if (error) return showToast(error.message, "error");
  biz.plan = newPlan;
  showToast(`Plan: ${newPlan.toUpperCase()}`, "success");
  renderPage();
}

async function deleteBusiness(bizId) {
  if (!confirm("Delete this business and all its offers?")) return;
  const { error } = await sb.from("businesses").delete().eq("id", bizId);
  if (error) return showToast(error.message, "error");
  showToast("Business deleted", "success");
  await loadAllData();
  renderPage();
}

async function toggleOfferVip(offerId, currentVip) {
  const { error } = await sb.from("offers").update({ vip: !currentVip }).eq("id", offerId);
  if (error) return showToast(error.message, "error");
  showToast(`VIP ${!currentVip ? 'enabled' : 'disabled'}`, "success");
  await loadAllData();
  renderPage();
}

async function deleteOffer(offerId) {
  if (!confirm("Delete this offer?")) return;
  const { error } = await sb.from("offers").delete().eq("id", offerId);
  if (error) return showToast(error.message, "error");
  showToast("Offer deleted", "success");
  await loadAllData();
  renderPage();
}

/* ========== BOOT ========== */
document.addEventListener("DOMContentLoaded", () => {
  $("#adminLoginForm").addEventListener("submit", handleLogin);
  $("#logoutBtn").addEventListener("click", handleLogout);
  $$(".sb-btn").forEach(b => b.addEventListener("click", () => navigate(b.dataset.page)));
  checkAuth();
});

sb.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") showLogin();
});