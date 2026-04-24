// ============================================
// LOST & FOUND SYSTEM - Frontend JavaScript
// ============================================

// const API_URL = 'http://localhost:5000/api';

// // Initialize Socket.IO
// const socket = io('http://localhost:5000');

// Auto-detect: works on localhost AND any other device/deployment
const API_URL = window.location.origin + '/api';
const socket = io(window.location.origin);

// State
let currentUser = null;
let authToken = null;

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    setupSocketListeners();
    handleNavigation();

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    // Modal close button
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

    // Close modal on overlay click
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
});

// ============================================
// AUTH
// ============================================
function checkAuth() {
    authToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (authToken && user) {
        currentUser = JSON.parse(user);
        updateUIForAuth(true);
    } else {
        updateUIForAuth(false);
    }
}

function updateUIForAuth(isAuthenticated) {
    document.querySelectorAll('.auth-required').forEach(el => {
        el.style.display = isAuthenticated ? '' : 'none';
    });
    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = isAuthenticated ? 'none' : '';
    });
    // Show admin nav link only for admins
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = (isAuthenticated && currentUser && currentUser.role === 'admin') ? '' : 'none';
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('reportForm').addEventListener('submit', handleReportItem);
    document.getElementById('applyFilters').addEventListener('click', loadItems);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);

    // Show selected filename on file input
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const label = document.querySelector('.file-upload-label span');
            if (label && e.target.files[0]) {
                label.textContent = e.target.files[0].name;
            }
        });
    }
}

// ============================================
// LOGIN
// ============================================
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            authToken = data.token;
            currentUser = data.user;
            updateUIForAuth(true);
            showNotification('Login successful! Welcome back 👋', 'success');
            window.location.hash = '#dashboard';
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch {
        showNotification('Login failed. Is the server running?', 'error');
    }
}

// ============================================
// SIGNUP
// ============================================
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            authToken = data.token;
            currentUser = data.user;
            updateUIForAuth(true);
            showNotification('Account created! Welcome 🎉', 'success');
            window.location.hash = '#dashboard';
        } else {
            showNotification(data.message || 'Signup failed', 'error');
        }
    } catch {
        showNotification('Signup failed. Is the server running?', 'error');
    }
}

// ============================================
// LOGOUT
// ============================================
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authToken = null;
    currentUser = null;
    updateUIForAuth(false);
    showNotification('Logged out successfully', 'success');
    window.location.hash = '#home';
}

// ============================================
// REPORT ITEM
// ============================================
async function handleReportItem(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const res = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            const matchMsg = data.matchesFound > 0 ? ` ${data.matchesFound} potential match(es) found!` : '';
            showNotification(`Item reported successfully!${matchMsg}`, 'success');
            e.target.reset();
            document.querySelector('.file-upload-label span').textContent = 'Click to upload or drag and drop';
            window.location.hash = '#dashboard';
        } else {
            showNotification(data.message || 'Failed to report item', 'error');
        }
    } catch {
        showNotification('Failed to report item. Is the server running?', 'error');
    }
}

// ============================================
// LOAD & DISPLAY ITEMS
// ============================================
async function loadItems() {
    const type = document.getElementById('typeFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const location = document.getElementById('locationFilter').value;
    const search = document.getElementById('searchFilter').value;

    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (search) params.append('search', search);

    const container = document.getElementById('itemsGrid');
    container.innerHTML = `<div class="loading-modern"><div class="spinner"></div><p>Loading items...</p></div>`;

    try {
        const res = await fetch(`${API_URL}/items?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
            displayItems(data.items, 'itemsGrid');
        }
    } catch {
        container.innerHTML = `<div class="loading-modern"><p>⚠️ Could not load items. Is the server running?</p></div>`;
    }
}

function displayItems(items, containerId) {
    const container = document.getElementById(containerId);

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No items found</h3>
                <p>Try adjusting your filters or report a new item</p>
            </div>`;
        return;
    }

    // Category emoji map
    const categoryIcons = {
        mobile: '📱', wallet: '👛', documents: '📄', keys: '🔑',
        bag: '🎒', electronics: '💻', jewelry: '💎', clothing: '👕', other: '📦'
    };

    container.innerHTML = items.map(item => `
        <div class="item-card-modern${item.status === 'matched' ? ' matched-highlight' : ''}" onclick="showItemDetails('${item._id}')">
            ${item.image
                ? `<img src="/uploads/${item.image}" alt="${item.title}" class="item-image-modern">`
                : `<div class="item-image-placeholder"><i class="fas fa-image"></i></div>`
            }
            <div class="item-badges">
                <span class="item-badge-modern badge-${item.type}-modern">
                    ${item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
                </span>
                ${item.status === 'matched' ? '<span class="item-badge-modern badge-matched-modern">✅ MATCHED</span>' : ''}
            </div>
            <h3 class="item-title-modern">${item.title}</h3>
            <p class="item-description-modern">
                ${item.description.substring(0, 90)}${item.description.length > 90 ? '...' : ''}
            </p>
            <div class="item-meta-modern">
                <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                <span>${categoryIcons[item.category] || '📦'} ${item.category}</span>
            </div>
            <div class="item-meta-modern" style="margin-top:0.5rem;">
                <span><i class="fas fa-calendar-alt"></i> ${new Date(item.date).toLocaleDateString()}</span>
                <span class="view-details-hint">View Details →</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// ITEM DETAILS MODAL
// ============================================
async function showItemDetails(itemId) {
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');

    // Show loading state
    modal.style.display = 'flex';
    modalBody.innerHTML = `<div class="loading-modern"><div class="spinner"></div><p>Loading...</p></div>`;

    try {
        const res = await fetch(`${API_URL}/items/${itemId}`);
        const data = await res.json();

        if (data.success) {
            const item = data.item;
            modalBody.innerHTML = `
                <div class="modal-item-header">
                    ${item.image
                        ? `<img src="/uploads/${item.image}" alt="${item.title}" class="modal-item-image">`
                        : ''
                    }
                    <div class="item-badges" style="margin-bottom:1rem;">
                        <span class="item-badge-modern badge-${item.type}-modern">
                            ${item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
                        </span>
                        ${item.status === 'matched' ? '<span class="item-badge-modern badge-matched-modern">✅ MATCHED</span>' : ''}
                    </div>
                    <h2 style="color:white;margin-bottom:1rem;">${item.title}</h2>
                </div>
                <div class="modal-detail-grid">
                    <div class="modal-detail-item">
                        <span class="detail-label"><i class="fas fa-align-left"></i> Description</span>
                        <span class="detail-value">${item.description}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="detail-label"><i class="fas fa-layer-group"></i> Category</span>
                        <span class="detail-value">${item.category}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Location</span>
                        <span class="detail-value">${item.location}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="detail-label"><i class="fas fa-calendar"></i> Date</span>
                        <span class="detail-value">${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="modal-contact-section">
                    <h3><i class="fas fa-address-card"></i> Contact Information</h3>
                    <div class="modal-detail-grid">
                        <div class="modal-detail-item">
                            <span class="detail-label"><i class="fas fa-user"></i> Name</span>
                            <span class="detail-value">${item.contactInfo?.name || 'N/A'}</span>
                        </div>
                        <div class="modal-detail-item">
                            <span class="detail-label"><i class="fas fa-envelope"></i> Email</span>
                            <span class="detail-value">${item.contactInfo?.email || 'N/A'}</span>
                        </div>
                        <div class="modal-detail-item">
                            <span class="detail-label"><i class="fas fa-phone"></i> Phone</span>
                            <span class="detail-value">${item.contactInfo?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                ${item.matchedWith ? `
                    <div class="modal-match-section">
                        <h3><i class="fas fa-link"></i> Matched With</h3>
                        <p style="color:rgba(255,255,255,0.8);">
                            <strong>${item.matchedWith.title}</strong> — ${item.matchedWith.type}
                        </p>
                    </div>
                ` : ''}
            `;
        }
    } catch {
        modalBody.innerHTML = `<p style="color:white;">Error loading item details.</p>`;
    }
}

function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// ============================================
// DASHBOARD
// ============================================
async function loadDashboard() {
    if (!authToken) return;

    const container = document.getElementById('myItemsGrid');
    container.innerHTML = `<div class="loading-modern"><div class="spinner"></div><p>Loading your items...</p></div>`;

    try {
        const res = await fetch(`${API_URL}/items/my-items`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();

        if (data.success) {
            const items = data.items;
            document.getElementById('totalItems').textContent = items.length;
            document.getElementById('matchedItems').textContent = items.filter(i => i.status === 'matched').length;
            document.getElementById('activeItems').textContent = items.filter(i => i.status === 'active').length;
            displayItems(items, 'myItemsGrid');
        }
    } catch {
        container.innerHTML = `<div class="loading-modern"><p>⚠️ Could not load dashboard.</p></div>`;
    }
}

// ============================================
// FILTERS
// ============================================
function clearFilters() {
    document.getElementById('typeFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('searchFilter').value = '';
    loadItems();
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const el = document.createElement('div');
    el.className = `notification ${type}`;

    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(el);

    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(100px)';
        setTimeout(() => el.remove(), 300);
    }, 4500);
}

// ============================================
// SOCKET.IO
// ============================================
function setupSocketListeners() {
    socket.on('match-found', (data) => {
        showNotification(`🎉 Match Found! ${data.message}`, 'success');
        const hash = window.location.hash;
        if (hash === '#browse' || hash === '' || hash === '#home') loadItems();
        if (hash === '#dashboard') loadDashboard();
    });
}

// ============================================
// NAVIGATION (hash-based SPA routing)
// ============================================
function handleNavigation() {
    const navigate = () => {
        const hash = window.location.hash || '#home';

        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

        const target = document.querySelector(hash);
        if (target) {
            target.style.display = 'block';
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (hash === '#dashboard') loadDashboard();
        if (hash === '#browse') loadItems();

        // Highlight active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });
    };

    window.addEventListener('hashchange', navigate);
    navigate(); // run on load
}
