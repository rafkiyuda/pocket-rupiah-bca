document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screenContainer');
    const toast = document.getElementById('toast');

    let state = {
        isBalanceHidden: false,
        userName: "JASMINE AZZAHRA",
        balance: "12.450.000",
        pockets: [
            { id: 1, name: "makan", category: "Food & Drink", balance: "2.500.000", target: "5.000.000", progress: 50, type: "personal", locked: false },
            { id: 2, name: "Dana Darurat", category: "Emergency", balance: "6.000.000", target: "15.000.000", progress: 40, type: "emergency", locked: true },
            { id: 3, name: "Liburan Keluarga", category: "Travel", balance: "1.200.000", target: "10.000.000", progress: 12, type: "shared", members: 3 }
        ],
        roundUpActive: true,
        onboardingStep: 0,
        showTour: false,
        selectedQrisPocketId: null,
        newPocketData: {
            name: "",
            type: "personal",
            locked: false,
            category: "Others"
        }
    };

    function showToast(message) {
        console.log("Showing toast:", message);
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function initTour() {
        const appContainer = document.querySelector('.app-container');
        if (!document.getElementById('tourOverlay')) {
            const tourHTML = screens.onboardingTour();
            const div = document.createElement('div');
            div.id = 'tourOverlay';
            div.innerHTML = tourHTML;
            appContainer.appendChild(div);
            attachTourListeners();
        }
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
            <div class="create-pocket-screen">
                <header class="blue-header">
                    <div class="back-btn" id="btnBackToPockets">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Create Pocket</h2>
                </header>
                
                <div class="create-form-content">
                    <div class="source-account-card">
                        <div class="account-info">
                            <span class="acc-number">568 - 121 - 2222</span>
                            <span class="acc-type">TAHAPAN XPRESI - IDR</span>
                        </div>
                        <div class="acc-arrow">></div>
                    </div>

                    <div class="form-scroll-area">
                        <div class="form-group">
                            <label>Purpose</label>
                            <div class="form-value">Savings</div>
                        </div>

                        <div class="form-group">
                            <label>Pocket Name</label>
                            <input type="text" class="underlined-input" placeholder="Pocket Name">
                        </div>

                        <div class="form-group has-arrow" id="btnSelectCategory" style="cursor: pointer;">
                            <label>Category</label>
                            <div class="form-value" id="categoryValue">Travel</div>
                            <div class="field-arrow">></div>
                        </div>

                        <div class="form-group-row">
                            <div class="row-label">Initial Deposit</div>
                            <div class="amount-input-group">
                                <span class="currency-label">IDR</span>
                                <input type="text" class="underlined-input amount-field" placeholder="Amount (Optional)">
                            </div>
                        </div>

                        <div class="form-group-row">
                            <div class="row-label">Target</div>
                            <div class="amount-input-group">
                                <span class="currency-label">IDR</span>
                                <input type="text" class="underlined-input amount-field" placeholder="Amount (Optional)">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Pocket Type</label>
                            <div class="type-selector">
                                <div class="type-btn active" data-type="personal">Personal</div>
                                <div class="type-btn" data-type="shared">Shared</div>
                                <div class="type-btn" data-type="emergency">Emergency</div>
                            </div>
                        </div>

                        <div class="form-group-toggle">
                            <div class="toggle-label-group">
                                <label>Locked Pocket</label>
                                <span class="interest-badge">+2.5% Bunga Ekstra</span>
                            </div>
                            <div class="toggle-switch">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Smart Auto-Allocation</label>
                            <p class="field-subtext">AI suggestion based on your spending</p>
                            <div class="allocation-options">
                                <div class="alloc-item">
                                    <div class="alloc-check"></div>
                                    <span>Connect to <strong>BCA Ecosystem</strong></span>
                                </div>
                                <div class="ecosystem-pills">
                                    <span class="eco-pill">🏫 Sekolah</span>
                                    <span class="eco-pill">🛡️ Asuransi</span>
                                    <span class="eco-pill">📈 Investasi</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Recurring Transfer Type</label>
                            <input type="text" class="underlined-input" placeholder="">
                        </div>
                    </div>
                </div>

                <div class="form-footer">
                    <button class="continue-btn" id="btnContinue">Continue</button>
                </div>

                <!-- Category Selection Modal -->
                <div id="categoryModal" class="modal-overlay">
                    <div class="modal-content bottom-sheet">
                        <div class="modal-header">
                            <h3>Select Category</h3>
                            <div class="close-modal" id="btnCloseModal">&times;</div>
                        </div>
                        <div class="category-list">
                            <div class="category-option" data-value="Travel">Travel</div>
                            <div class="category-option" data-value="Shopping">Shopping</div>
                            <div class="category-option" data-value="Education">Education</div>
                            <div class="category-option" data-value="Food & Drink">Food & Drink</div>
                            <div class="category-option" data-value="Others">Others</div>
                        </div>
                    </div>
                </div>
            </div>
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
        `,
        pocketsDashboard: () => `
            <div class="pockets-dashboard">
                <header class="home-header">
                    <div class="logo-mybca">my<span>BCA</span></div>
                    <div class="header-actions">
                        <div class="header-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>
                        <div class="header-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
                        <div class="header-btn" id="btnBackToHomeFromPockets"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></div>
                    </div>
                </header>

                <div class="pockets-content">
                    <div class="ai-insight-card dashboard-insight">
                        <div class="insight-header">
                            <span class="sparkle-icon">✨</span>
                            <h4>Smart AI Recommendation</h4>
                        </div>
                        <p class="insight-main-desc">AI analyzes transaction patterns and automatically allocates funds to help you reach your goals faster.</p>
                        <div class="ecosystem-feature-info">
                            <span class="eco-label">Integrated with BCA Ecosystem:</span>
                            <p>Auto-payment to schools, BCA Insurance, and BCA Sekuritas.</p>
                        </div>
                        <button class="insight-action">Aktifkan Sekarang ></button>
                    </div>

                    <div class="banner-carousel">
                        <div class="banner-item">
                            <div class="banner-text">
                                <h3>Easy Way to Buy <span>Flazz</span></h3>
                                <p>in Lifestyle Feature</p>
                                <button class="banner-btn">bca.id/flazzspesial</button>
                            </div>
                            <div class="banner-icon-box">
                                <div class="lifestyle-icon"></div>
                                <span>Lifestyle</span>
                            </div>
                        </div>
                        <div class="carousel-dots">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot active"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                    </div>

                    <div class="pockets-section">
                        <div class="section-title-row">
                            <h3>Pockets</h3>
                            <div class="round-up-badge ${state.roundUpActive ? 'active' : ''}">
                                Round-up: <span>${state.roundUpActive ? 'ON' : 'OFF'}</span>
                            </div>
                        </div>
                        <div class="pocket-tabs">
                            <div class="pocket-tab active">Personal</div>
                            <div class="pocket-tab">Shared</div>
                            <div class="pocket-tab">Emergency</div>
                        </div>

                        <div class="pocket-cards-scroll">
                            ${state.pockets.map(p => `
                                <div class="pocket-idr-card ${p.type}">
                                    <div class="pocket-card-icon">${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🥖'}</div>
                                    <div class="pocket-card-info">
                                        <span class="currency">IDR ${p.balance}</span>
                                        <div class="pocket-label-row">
                                            <span class="label-text">${p.name}</span>
                                            ${p.locked ? '<span class="lock-icon">🔒</span>' : ''}
                                        </div>
                                        <div class="progress-bar-container">
                                            <div class="progress-fill" style="width: ${p.progress}%"></div>
                                        </div>
                                        <span class="time-to-goal">Predictive: ${Math.ceil((100 - p.progress) / 5)} bulan lagi</span>
                                    </div>
                                </div>
                            `).join('')}
                            <div class="pocket-view-all-card" id="btnAddNewPocket">
                                <div class="view-all-icon">+</div>
                                <span>Add New</span>
                            </div>
                        </div>
                    </div>

                    <div class="ecosystem-integration">
                        <h3>BCA Ecosystem</h3>
                        <div class="eco-grid">
                            <div class="eco-item"><div class="eco-icon school"></div><span>Sekolah</span></div>
                            <div class="eco-item"><div class="eco-icon insurance"></div><span>Insurance</span></div>
                            <div class="eco-item"><div class="eco-icon invest"></div><span>Sekuritas</span></div>
                        </div>
                    </div>

                    <div class="wallet-section">
                        <h3>e-Wallet</h3>
                        <div class="wallet-grid">
                            <div class="wallet-item">
                                <div class="wallet-icon sakuku"></div>
                                <span>Sakuku</span>
                            </div>
                            <div class="wallet-item">
                                <div class="wallet-icon dana"></div>
                                <span>DANA</span>
                            </div>
                            <div class="wallet-item">
                                <div class="wallet-icon ovo"></div>
                                <span>OVO</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-section-dashboard">
                        <h3>Card</h3>
                        <div class="card-grid-placeholders">
                            <div class="card-placeholder"></div>
                            <div class="card-placeholder"></div>
                        </div>
                    </div>
                </div>

                <nav class="bottom-nav">
                    <div class="nav-item active">
                        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        <span>Home</span>
                    </div>
                    <div class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                        <span>Activity</span>
                    </div>
                    <div class="qris-btn-container">
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
                            <span>My Account</span>
                        </div>
                    </nav>
                </div>
            `,
        qrisSelection: () => `
            <div class="qris-selection-screen">
                <header class="blue-header">
                    <div class="back-btn" id="btnBackToHomeFromQRIS">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Bayar Pakai QRIS</h2>
                </header>
                <div class="qris-content">
                    <div class="qris-info">
                        <h3>Pilih Poket Sumber Dana</h3>
                        <p>Kontrol pengeluaranmu dengan memilih poket yang sesuai.</p>
                    </div>
                    <div class="qris-pocket-list">
                        ${state.pockets.map(p => `
                            <div class="qris-pocket-item" data-id="${p.id}">
                                <div class="pocket-icon">${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🥖'}</div>
                                <div class="pocket-details">
                                    <span class="name">${p.name}</span>
                                    <span class="balance">Saldo: IDR ${p.balance}</span>
                                </div>
                                <div class="select-radio"></div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="primary-button" id="btnStartScan">Buka Scanner</button>
                </div>
            </div>
        `,
        onboardingTour: () => `
            <div class="tour-overlay ${state.showTour ? 'show' : ''}">
                <div class="tour-card" id="tourCard">
                    <div class="tour-step-info">Step ${state.onboardingStep + 1} of 3</div>
                    <h3 id="tourTitle">Smart Recommendation</h3>
                    <p id="tourDesc">AI kami akan membantu mengalokasikan tabunganmu secara otomatis berdasarkan kebiasaan transaksimu.</p>
                    <div class="tour-footer">
                        <button class="skip-btn" id="btnSkipTour">Skip</button>
                        <button class="next-btn" id="btnNextTour">Next</button>
                    </div>
                </div>
                <div class="tour-pointer" id="tourPointer"></div>
            </div>
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
            if (btnQris) btnQris.onclick = () => navigateTo('qrisSelection');

            const btnAdd = document.getElementById('btnAddNewPocket');
            if (btnAdd) btnAdd.onclick = () => navigateTo('createForm');
            
            const btnPromo = document.getElementById('btnPromo');
            if (btnPromo) btnPromo.onclick = () => {
                state.showTour = true;
                initTour();
                document.querySelector('.tour-overlay').classList.add('show');
            };
        } else if (screenName === 'menuSelection') {
            document.getElementById('btnBackToHome').onclick = () => navigateTo('home');
            document.getElementById('itemPockets').onclick = () => navigateTo('pocketsDashboard');
        } else if (screenName === 'pocketsDashboard') {
            const btnBack = document.getElementById('btnBackToHomeFromPockets');
            if (btnBack) btnBack.onclick = () => navigateTo('home');
            
            const btnInsight = document.querySelector('.insight-action');
            if (btnInsight) btnInsight.onclick = () => {
                showToast("Membuka Smart Allocation...");
                setTimeout(() => navigateTo('createForm'), 500);
            };

            // Add click for View All to go to createForm for now
            const btnViewAll = document.querySelector('.pocket-view-all-card');
            if (btnViewAll) btnViewAll.onclick = () => navigateTo('createForm');
        } else if (screenName === 'createForm') {
            document.getElementById('btnBackToPockets').onclick = () => navigateTo('pocketsDashboard');
            
            const typeBtns = document.querySelectorAll('.type-btn');
            typeBtns.forEach(btn => {
                btn.onclick = () => {
                    typeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    state.newPocketData.type = btn.getAttribute('data-type');
                    showToast(`Tipe Poket: ${btn.textContent}`);
                };
            });

            const toggle = document.querySelector('.toggle-switch');
            if (toggle) {
                toggle.onclick = () => {
                    toggle.classList.toggle('active');
                    state.newPocketData.locked = toggle.classList.contains('active');
                };
            }

            const btnCategory = document.getElementById('btnSelectCategory');
            const modal = document.getElementById('categoryModal');
            const btnClose = document.getElementById('btnCloseModal');
            const categoryValue = document.getElementById('categoryValue');
            
            if (btnCategory) {
                btnCategory.onclick = () => {
                    modal.classList.add('show');
                };
            }
            
            if (btnClose) {
                btnClose.onclick = () => {
                    modal.classList.remove('show');
                };
            }
            
            document.querySelectorAll('.category-option').forEach(option => {
                option.onclick = () => {
                    const val = option.getAttribute('data-value');
                    categoryValue.textContent = val;
                    state.newPocketData.category = val;
                    modal.classList.remove('show');
                    showToast(`Category changed to ${val}`);
                };
            });

            const nameInput = document.querySelector('.underlined-input');
            const continueBtn = document.getElementById('btnContinue');
            if (nameInput && continueBtn) {
                nameInput.oninput = () => {
                    state.newPocketData.name = nameInput.value;
                    if (nameInput.value.trim().length > 0) {
                        continueBtn.classList.add('active');
                        continueBtn.disabled = false;
                    } else {
                        continueBtn.classList.remove('active');
                        continueBtn.disabled = true;
                    }
                };
            }
            
            const allocItems = document.querySelectorAll('.alloc-item');
            allocItems.forEach(item => {
                item.onclick = () => item.classList.toggle('active');
            });

            const ecoPills = document.querySelectorAll('.eco-pill');
            ecoPills.forEach(pill => {
                pill.onclick = () => {
                    pill.classList.toggle('selected');
                    showToast(`Terhubung ke ${pill.textContent}`);
                };
            });

            if (continueBtn) {
                continueBtn.onclick = () => {
                    const newPocket = {
                        id: state.pockets.length + 1,
                        name: state.newPocketData.name,
                        category: state.newPocketData.category,
                        balance: "0",
                        target: "1.000.000",
                        progress: 0,
                        type: state.newPocketData.type,
                        locked: state.newPocketData.locked
                    };
                    state.pockets.push(newPocket);
                    showToast("Pocket Created Successfully!");
                    // Reset newPocketData
                    state.newPocketData = { name: "", type: "personal", locked: false, category: "Others" };
                    setTimeout(() => navigateTo('pocketsDashboard'), 1000);
                };
            }
        } else if (screenName === 'qrisSelection') {
            document.getElementById('btnBackToHomeFromQRIS').onclick = () => navigateTo('home');
            document.querySelectorAll('.qris-pocket-item').forEach(item => {
                item.onclick = () => {
                    document.querySelectorAll('.qris-pocket-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    state.selectedQrisPocketId = item.getAttribute('data-id');
                };
            });
            document.getElementById('btnStartScan').onclick = () => {
                if (!state.selectedQrisPocketId) {
                    showToast("Pilih poket terlebih dahulu!");
                    return;
                }
                const selectedPocket = state.pockets.find(p => p.id == state.selectedQrisPocketId);
                showToast(`Membayar menggunakan Poket: ${selectedPocket.name}...`);
            };
        } else if (screenName === 'onboarding') {
            document.getElementById('navHomeFromTracker').onclick = () => navigateTo('home');
        }
    }

    function attachTourListeners() {
        const overlay = document.querySelector('.tour-overlay');
        const nextBtn = document.getElementById('btnNextTour');
        const skipBtn = document.getElementById('btnSkipTour');
        
        const tourData = [
            { title: "Smart Recommendation", desc: "AI kami akan membantu mengalokasikan tabunganmu secara otomatis berdasarkan kebiasaan transaksimu." },
            { title: "Visual Goal Progress", desc: "Pantau kemajuan tabunganmu secara visual dengan prediksi waktu pencapaian yang akurat." },
            { title: "Integrated Ecosystem", desc: "Hubungkan poketmu langsung dengan asuransi, investasi, dan pembayaran sekolah di ekosistem BCA." }
        ];

        nextBtn.onclick = () => {
            state.onboardingStep++;
            if (state.onboardingStep < tourData.length) {
                document.querySelector('.tour-step-info').textContent = `Step ${state.onboardingStep + 1} of 3`;
                document.getElementById('tourTitle').textContent = tourData[state.onboardingStep].title;
                document.getElementById('tourDesc').textContent = tourData[state.onboardingStep].desc;
            } else {
                overlay.classList.remove('show');
                state.onboardingStep = 0;
            }
        };

        skipBtn.onclick = () => {
            overlay.classList.remove('show');
            state.onboardingStep = 0;
        };
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
