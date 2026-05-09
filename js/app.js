document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screenContainer');
    const toast = document.getElementById('toast');

    let state = {
        isBalanceHidden: false,
        userName: "JASMINE AZZAHRA",
        balance: "12.450.000"
    };

    function showToast(message) {
        console.log("Showing toast:", message);
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    const screens = {
        home: () => `
            <div class="home-screen">
                <header class="home-header">
                    <div class="logo-mybca">my<span>BCA</span></div>
                    <div class="header-actions">
                        <div class="header-btn" id="btnNotification" style="cursor:pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </div>
                        <div class="header-btn" id="btnSettings" style="cursor:pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </div>
                        <div class="header-btn" id="btnLogout" style="cursor:pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </div>
                    </div>
                </header>
                <div class="greeting">
                    <p>HELLO,</p>
                    <h2>${state.userName}</h2>
                </div>
                
                <div class="account-card">
                    <div class="card-top">
                        <div class="bca-id-pill">🆔 BCA ID ></div>
                        <div class="account-number" id="btnCopyAccount" style="cursor:pointer">Account: 527 - 198 - 4813 <span style="font-size: 1.2rem;">📋</span></div>
                    </div>
                    <div class="card-bottom">
                        <p class="balance-label">Active Balance</p>
                        <div class="balance-amount">
                            <span id="balanceText" class="${state.isBalanceHidden ? 'balance-hidden' : ''}">
                                ${state.isBalanceHidden ? '••••••••' : 'IDR ' + state.balance}
                            </span>
                            <div id="btnToggleBalance" style="cursor: pointer; padding: 5px;">
                                ${state.isBalanceHidden ? 
                                    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` :
                                    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
                                }
                            </div>
                        </div>
                        <div class="card-links">
                            <div class="card-link" id="btnTransactions" style="cursor:pointer">🧾 Account Transactions</div>
                            <div class="card-link" style="cursor:pointer">💳 Other Accounts</div>
                        </div>
                    </div>
                </div>

                <div class="promo-banner" style="cursor:pointer" id="btnPromo">
                    <span>The New Gebyar Hadiah BCA</span>
                    <span>Click to Win ></span>
                </div>

                <div class="main-menu-section">
                    <div class="main-menu-header">
                        <h3>Main Menu</h3>
                        <div class="btn-edit-menu" style="cursor:pointer">✏️ Edit</div>
                    </div>
                    <div class="home-menu-grid">
                        <div class="menu-item"><div class="home-menu-icon h-transfer"></div><span>Transfer</span></div>
                        <div class="menu-item"><div class="home-menu-icon h-payment"></div><span>Payment & Top Up</span></div>
                        <div class="menu-item"><div class="home-menu-icon h-invest"></div><span>Investment</span></div>
                        <div class="menu-item"><div class="home-menu-icon h-lifestyle"></div><span>Lifestyle</span></div>
                        <div class="menu-item"><div class="home-menu-icon h-flazz"></div><span>Flazz</span></div>
                        <div class="menu-item"><div class="home-menu-icon h-cardless"></div><span>Cardless</span></div>
                        <div class="menu-item" id="btnBankProducts"><div class="home-menu-icon h-products"></div><span>Bank Products</span></div>
                        <div class="menu-item"><div class="home-menu-icon h-protection"></div><span>Protection</span></div>
                    </div>
                </div>
            </div>
            <nav class="bottom-nav">
                <div class="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    <span>Home</span>
                </div>
                <div class="nav-item" id="btnActivity">
                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                    <span>Activity</span>
                </div>
                <div class="qris-btn-container" id="btnQRIS" style="cursor:pointer">
                    <div class="qris-btn">
                        <svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm2 2v3h3V6H6zm8-2h7v7h-7V4zm2 2v3h3V6h-3zM4 13h7v7H4v-7zm2 2v3h3v-3H6zm8 0h3v3h-3v-3zm3-3h3v3h-3v-3zm0 6h3v3h-3v-3zm-3 3h3v-3h-3v3zm3-3v-3h-3v3h3z"/></svg>
                    </div>
                    <div class="qris-label">QRIS</div>
                </div>
                <div class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <span>For You</span>
                </div>
                <div class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                    <span>Account</span>
                </div>
            </nav>
        `,
        menuSelection: () => `
            <header class="blue-header">
                <div class="back-btn" id="btnBackToHome">
                    <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                </div>
                <h2 class="header-title">All Menus</h2>
            </header>
            <div class="menu-body">
                <div class="search-container">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" placeholder="Search">
                </div>
                <div class="menu-section">
                    <div class="section-header">
                        <span class="section-title">Bank Products</span>
                        <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
                    </div>
                    <div class="menu-grid">
                        <div class="menu-item"><div class="menu-icon icon-card"></div><span>Credit Card</span></div>
                        <div class="menu-item"><div class="menu-icon icon-paylater"></div><span>Paylater</span></div>
                        <div class="menu-item"><div class="menu-icon icon-credit"></div><span>Consumer Credit</span></div>
                        <div class="menu-item" id="itemPockets">
                            <div class="menu-icon-wrapper">
                                <div class="menu-icon icon-pockets"></div>
                                <div class="new-badge">NEW</div>
                            </div>
                            <span>Pockets</span>
                        </div>
                        <div class="menu-item"><div class="menu-icon icon-deposit"></div><span>Time Deposit</span></div>
                        <div class="menu-item"><div class="menu-icon icon-savings"></div><span>Tahapan Berjangka</span></div>
                    </div>
                </div>
            </div>
        `,
        onboarding: () => `
            <main class="content onboarding">
                <div class="header-image"></div>
                <h1 class="title">Buat Poket Rupiah Agar Mudah Atur Keuangan Sesuai Kebutuhan</h1>
                <div class="features-list">
                    <div class="feature-item">
                        <div class="icon-wrapper"><div class="feature-icon icon-target"></div></div>
                        <div class="feature-text"><p>Fokus dengan Target Menabung</p></div>
                    </div>
                    <div class="feature-item">
                        <div class="icon-wrapper"><div class="feature-icon icon-check"></div></div>
                        <div class="feature-text"><p>Bisa Cek Mutasi dari myBCA</p></div>
                    </div>
                    <div class="feature-item">
                        <div class="icon-wrapper"><div class="feature-icon icon-withdraw"></div></div>
                        <div class="feature-text"><p>Dana Dicairkan Kapanpun</p></div>
                    </div>
                    <div class="feature-item">
                        <div class="icon-wrapper"><div class="feature-icon icon-lock"></div></div>
                        <div class="feature-text"><p>Poket Bisa Dikunci Sesuai Kebutuhan</p></div>
                    </div>
                </div>
                <div class="action-footer">
                    <button id="btnCreatePocket" class="primary-button">Buat Poket Rupiah</button>
                </div>
            </main>
        `,
        createForm: () => `
            <header class="app-header">
                <div class="back-btn" id="btnBackToOnboarding">
                    <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                </div>
                <h2 class="header-title">Buat Poket</h2>
            </header>
            <main class="content" style="padding-top: 10px;">
                <div class="form-container">
                    <div class="input-group">
                        <label>Nama Poket</label>
                        <input type="text" id="pocketName" placeholder="Contoh: Liburan, Dana Darurat">
                    </div>
                    <div class="input-group">
                        <label>Pilih Kategori</label>
                        <select id="pocketCategory">
                            <option value="">Pilih Kategori</option>
                            <option value="liburan">Liburan</option>
                            <option value="belanja">Belanja</option>
                            <option value="pendidikan">Pendidikan</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Target Dana (Opsional)</label>
                        <input type="number" placeholder="Rp 0">
                    </div>
                    <div class="input-group">
                        <label>Target Waktu (Opsional)</label>
                        <input type="date">
                    </div>
                    <div class="info-box">
                        <p>Poket ini akan terhubung dengan rekening utama Anda untuk memudahkan pengaturan keuangan.</p>
                    </div>
                </div>
                <div class="action-footer">
                    <button id="btnSavePocket" class="primary-button">Simpan Poket</button>
                </div>
            </main>
        `,
        tracker: () => `
            <header class="app-header tracker-header">
                <h2 class="header-title" style="margin-right: 0; text-align: left; padding-left: 16px; font-size: 1.4rem;">Tracker</h2>
                <div class="header-tabs">
                    <div class="tab-item active">Mutasi</div>
                    <div class="tab-item">Analisis</div>
                </div>
            </header>
            <main class="content tracker-content" style="padding: 0;">
                <div class="tracker-summary">
                    <div class="summary-card">
                        <p class="label">Total Pengeluaran</p>
                        <h3 class="amount">Rp 4.250.000</h3>
                        <p class="trend negative">↑ 12% dari bulan lalu</p>
                    </div>
                </div>
                <div class="transaction-list">
                    <div class="date-header">Hari Ini, 09 Mei</div>
                    <div class="transaction-item">
                        <div class="tx-icon spending">🍔</div>
                        <div class="tx-details">
                            <p class="tx-title">GrabFood - McDonald's</p>
                            <p class="tx-category">Makanan & Minuman</p>
                        </div>
                        <div class="tx-amount spending">-Rp 85.000</div>
                    </div>
                </div>
            </main>
            <nav class="bottom-nav">
                <div class="nav-item" id="navHomeFromTracker">
                    <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    <span>Home</span>
                </div>
                <div class="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                    <span>Tracker</span>
                </div>
                <div class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <span>Info</span>
                </div>
            </nav>
        `
    };

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function navigateTo(screenName) {
        screenContainer.style.opacity = '0';
        setTimeout(() => {
            const screenContent = screens[screenName];
            screenContainer.innerHTML = typeof screenContent === 'function' ? screenContent() : screenContent;
            screenContainer.style.opacity = '1';
            attachListeners(screenName);
        }, 300);
    }

    function attachListeners(screenName) {
        if (screenName === 'home') {
            const btnToggle = document.getElementById('btnToggleBalance');
            if (btnToggle) {
                btnToggle.onclick = () => {
                    state.isBalanceHidden = !state.isBalanceHidden;
                    navigateTo('home');
                };
            }
            
            const btnCopy = document.getElementById('btnCopyAccount');
            if (btnCopy) btnCopy.onclick = () => showToast("Account number copied!");

            const btnNotif = document.getElementById('btnNotification');
            if (btnNotif) btnNotif.onclick = () => showToast("No new notifications");

            const btnSet = document.getElementById('btnSettings');
            if (btnSet) btnSet.onclick = () => showToast("Settings opened");

            const btnOut = document.getElementById('btnLogout');
            if (btnOut) btnOut.onclick = () => showToast("Logging out...");

            const btnProd = document.getElementById('btnBankProducts');
            if (btnProd) btnProd.onclick = () => navigateTo('menuSelection');

            const btnAct = document.getElementById('btnActivity');
            if (btnAct) btnAct.onclick = () => navigateTo('tracker');

            const btnQris = document.getElementById('btnQRIS');
            if (btnQris) btnQris.onclick = () => showToast("Opening QRIS Scanner...");

            const btnTx = document.getElementById('btnTransactions');
            if (btnTx) btnTx.onclick = () => showToast("Viewing transactions...");
            
            const btnPromo = document.getElementById('btnPromo');
            if (btnPromo) btnPromo.onclick = () => showToast("Opening Gebyar Hadiah BCA...");
        } else if (screenName === 'menuSelection') {
            document.getElementById('btnBackToHome').onclick = () => navigateTo('home');
            document.getElementById('itemPockets').onclick = () => navigateTo('onboarding');
        } else if (screenName === 'onboarding') {
            const btnCreate = document.getElementById('btnCreatePocket');
            if (btnCreate) {
                btnCreate.onclick = (e) => {
                    createRipple(e, btnCreate);
                    setTimeout(() => navigateTo('createForm'), 400);
                };
            }
        } else if (screenName === 'createForm') {
            document.getElementById('btnBackToOnboarding').onclick = () => navigateTo('onboarding');
            const btnSave = document.getElementById('btnSavePocket');
            if (btnSave) {
                btnSave.onclick = (e) => {
                    const name = document.getElementById('pocketName').value;
                    if (!name) {
                        showToast("Please enter a pocket name");
                        return;
                    }
                    createRipple(e, btnSave);
                    setTimeout(() => navigateTo('tracker'), 600);
                };
            }
        } else if (screenName === 'tracker') {
            document.getElementById('navHomeFromTracker').onclick = () => navigateTo('home');
        }
    }

    function createRipple(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    // Initial Load
    navigateTo('home');
});
