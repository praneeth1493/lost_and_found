// ============================================
// ADMIN PANEL — JavaScript
// ============================================

const API = 'http://localhost:5000/api/admin';

// ── Auth guard: redirect if not admin ──────
const token = localStorage.getItem('token');
const user  = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user || user.role !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = '/';
}

// Show admin name in sidebar
document.getElementById('adminName').textContent = user?.name || 'Admin';

// ── Helpers ────────────────────────────────
function authHeader() {
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function notify(msg, type = 'info') {
    const container = document.getElementById('adminNotif');
    const el = document.createElement('div');
    el.className = `notif ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    el.innerHTML = `<i class="fas ${icons[type]}"></i> ${msg}`;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(60px)'; setTimeout(() => el.remove(), 300); }, 4000);
}

function formatDate(d) {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}

// ── Tab Navigation ─────────────────────────
const tabTitles = { overview: 'Overview', users: 'Manage Users', items: 'Manage Items' };

document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;

        // Update active link
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show correct tab
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');

        // Update page title
        document.getElementById('pageTitle').textContent = tabTitles[tab];

        // Load data
        if (tab === 'overview') loadStats();
        if (tab === 'users')    loadUsers();
        if (tab === 'items')    loadItems();

        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');
    });
});

// Mobile sidebar toggle
document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
});

// ── Confirm Modal ──────────────────────────
let confirmCallback = null;

function showConfirm(title, msg, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent   = msg;
    document.getElementById('confirmModal').classList.add('show');
    confirmCallback = onConfirm;
}

document.getElementById('confirmCancel').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('show');
    confirmCallback = null;
});

document.getElementById('confirmOk').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('show');
    if (confirmCallback) confirmCallback();
    confirmCallback = null;
});

// ── STATS ──────────────────────────────────
async function loadStats() {
    try {
        const res  = await fetch(`${API}/stats`, { headers: authHeader() });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const s = data.stats;
        document.getElementById('s-users').textContent    = s.totalUsers;
        document.getElementById('s-items').textContent    = s.totalItems;
        document.getElementById('s-lost').textContent     = s.lostItems;
        document.getElementById('s-found').textContent    = s.foundItems;
        document.getElementById('s-matched').textContent  = s.matchedItems;
        document.getElementById('s-resolved').textContent = s.resolvedItems;
        document.getElementById('s-active').textContent   = s.activeItems;
        document.getElementById('s-blocked').textContent  = s.blockedUsers;
    } catch (err) {
        notify('Failed to load stats: ' + err.message, 'error');
    }
}

// ── USERS ──────────────────────────────────
async function loadUsers() {
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = `<tr><td colspan="8" class="loading-row"><div class="spinner-sm"></div> Loading users...</td></tr>`;

    try {
        const res  = await fetch(`${API}/users`, { headers: authHeader() });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        if (data.users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="loading-row">No users found.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.users.map((u, i) => `
            <tr id="user-row-${u._id}">
                <td>${i + 1}</td>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}</td>
                <td>${u.phone || '—'}</td>
                <td><span class="badge badge-active">${u.itemCount}</span></td>
                <td>
                    <span class="badge ${u.isBlocked ? 'badge-blocked' : 'badge-active-user'}">
                        ${u.isBlocked ? '🔴 Blocked' : '🟢 Active'}
                    </span>
                </td>
                <td>${formatDate(u.createdAt)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-block" onclick="toggleBlock('${u._id}', ${u.isBlocked})">
                            <i class="fas fa-${u.isBlocked ? 'unlock' : 'ban'}"></i>
                            ${u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button class="btn-del" onclick="deleteUser('${u._id}', '${u.name}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" class="loading-row">⚠️ ${err.message}</td></tr>`;
        notify('Failed to load users: ' + err.message, 'error');
    }
}

async function deleteUser(id, name) {
    showConfirm(
        `Delete "${name}"?`,
        'This will permanently delete the user and ALL their reported items.',
        async () => {
            try {
                const res  = await fetch(`${API}/users/${id}`, { method: 'DELETE', headers: authHeader() });
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                document.getElementById(`user-row-${id}`)?.remove();
                notify(`User "${name}" deleted successfully.`, 'success');
                loadStats();
            } catch (err) {
                notify('Delete failed: ' + err.message, 'error');
            }
        }
    );
}

async function toggleBlock(id, isCurrentlyBlocked) {
    try {
        const res  = await fetch(`${API}/users/${id}/block`, { method: 'PATCH', headers: authHeader() });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        notify(data.message, 'success');
        loadUsers();   // refresh table
        loadStats();
    } catch (err) {
        notify('Action failed: ' + err.message, 'error');
    }
}

// ── ITEMS ──────────────────────────────────
async function loadItems() {
    const tbody  = document.getElementById('itemsBody');
    const type   = document.getElementById('itemTypeFilter')?.value   || '';
    const status = document.getElementById('itemStatusFilter')?.value || '';
    const search = document.getElementById('itemSearch')?.value       || '';

    tbody.innerHTML = `<tr><td colspan="9" class="loading-row"><div class="spinner-sm"></div> Loading items...</td></tr>`;

    const params = new URLSearchParams();
    if (type)   params.append('type',   type);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    try {
        const res  = await fetch(`${API}/items?${params}`, { headers: authHeader() });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        if (data.items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="loading-row">No items found.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.items.map((item, i) => `
            <tr id="item-row-${item._id}">
                <td>${i + 1}</td>
                <td><strong>${item.title}</strong></td>
                <td><span class="badge badge-${item.type}">${item.type.toUpperCase()}</span></td>
                <td>${item.category}</td>
                <td>${item.location}</td>
                <td>
                    ${item.user
                        ? `${item.user.name}<br><small style="color:#94a3b8;">${item.user.email}</small>`
                        : '<span style="color:#94a3b8;">Deleted user</span>'
                    }
                </td>
                <td>
                    <select class="status-select" onchange="updateStatus('${item._id}', this.value)">
                        <option value="active"   ${item.status === 'active'   ? 'selected' : ''}>Active</option>
                        <option value="matched"  ${item.status === 'matched'  ? 'selected' : ''}>Matched</option>
                        <option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </td>
                <td>${formatDate(item.date)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-del" onclick="deleteItem('${item._id}', '${item.title.replace(/'/g,"\\'")}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="9" class="loading-row">⚠️ ${err.message}</td></tr>`;
        notify('Failed to load items: ' + err.message, 'error');
    }
}

async function updateStatus(id, status) {
    try {
        const res  = await fetch(`${API}/items/${id}/status`, {
            method: 'PATCH',
            headers: authHeader(),
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        notify(`Status updated to "${status}"`, 'success');
        loadStats();
    } catch (err) {
        notify('Status update failed: ' + err.message, 'error');
    }
}

async function deleteItem(id, title) {
    showConfirm(
        `Delete "${title}"?`,
        'This item will be permanently removed from the system.',
        async () => {
            try {
                const res  = await fetch(`${API}/items/${id}`, { method: 'DELETE', headers: authHeader() });
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                document.getElementById(`item-row-${id}`)?.remove();
                notify(`Item "${title}" deleted.`, 'success');
                loadStats();
            } catch (err) {
                notify('Delete failed: ' + err.message, 'error');
            }
        }
    );
}

// ── Init: load overview on page load ───────
loadStats();
