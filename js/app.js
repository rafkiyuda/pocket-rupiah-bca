document.addEventListener('DOMContentLoaded', () => {
    const screenContainer = document.getElementById('screenContainer');
    const toast = document.getElementById('toast');

    let state = {
        isBalanceHidden: false,
        userName: "JASMINE AZZAHRA",
        balance: "12.450.000",
        pockets: [
            { id: 1, name: "makan", category: "Food & Drink", balance: "2.500.000", target: "5.000.000", progress: 50, type: "personal", locked: false, qrisEnabled: true },
            { id: 2, name: "Dana Darurat", category: "Emergency", balance: "6.000.000", target: "15.000.000", progress: 40, type: "emergency", locked: true, qrisEnabled: false },
            { id: 3, name: "Liburan Keluarga", category: "Travel", balance: "1.200.000", target: "10.000.000", progress: 12, type: "shared", members: 3, qrisEnabled: true }
        ],
        roundUpActive: true,
        onboardingStep: 0,
        showTour: false,
        hasSeenPocketTour: false,
        selectedQrisPocketId: null,
        newPocketData: {
            name: "",
            type: "personal",
            locked: false,
            category: "Others"
        },
        pendingAllocation: true, // Mock incoming fund state
        showAllocationModal: false,
        rewards: {
            points: 1250,
            level: "Budget Boss",
            nextLevelPts: 2000,
            streak: 5,
            badges: [
                { id: 1, name: "Early Bird", icon: "🌅", unlocked: true },
                { id: 2, name: "Smart Saver", icon: "🧠", unlocked: true },
                { id: 3, name: "Wealth Wizard", icon: "🧙‍♂️", unlocked: false }
            ]
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

                <div class="reward-widget" id="btnRewardHub" style="cursor: pointer;">
                    <div class="reward-icon">🏆</div>
                    <div class="reward-info">
                        <div class="reward-level">${state.rewards.level}</div>
                        <div class="reward-points-row">
                            <span class="reward-points">${state.rewards.points} Pts</span>
                            <span class="reward-next-level">${state.rewards.nextLevelPts} Pts to next level</span>
                        </div>
                        <div class="reward-progress-mini">
                            <div class="reward-progress-fill" style="width: ${(state.rewards.points / state.rewards.nextLevelPts) * 100}%"></div>
                        </div>
                    </div>
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

                        <div class="form-group-toggle">
                            <div class="toggle-label-group">
                                <label>Enable QRIS Payments</label>
                                <span class="interest-badge" style="background: #E0F2FE; color: #0077C8;">Pay directly from pocket</span>
                            </div>
                            <div class="toggle-switch active">
                                <div class="toggle-knob"></div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="toggle-label-group" style="margin-bottom: 12px;">
                                <div>
                                    <label>Auto-Debit (Recurring Transfer)</label>
                                    <p class="field-subtext" style="margin-top: 4px;">Set schedule for automatic saving</p>
                                </div>
                                <div class="toggle-switch" id="autodebitToggle">
                                    <div class="toggle-knob"></div>
                                </div>
                            </div>
                            
                            <div id="autodebitSettings" style="display: none; padding-top: 12px; border-top: 1px dashed #E2E8F0;">
                                <div class="form-group-row">
                                    <div class="row-label">Amount</div>
                                    <div class="amount-input-group">
                                        <span class="currency-label">IDR</span>
                                        <input type="text" class="underlined-input amount-field" placeholder="1.000.000">
                                    </div>
                                </div>
                                
                                <!-- AI Recommendation Attachment -->
                                <div class="ai-recommendation-box" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border-radius: 12px; padding: 16px; margin-top: 16px; border: 1px solid #BAE6FD;">
                                    <div class="toggle-label-group" style="margin-bottom: 8px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 1.2rem;">✨</span>
                                            <label style="color: #0369A1;">AI Recommended Auto-Debit</label>
                                        </div>
                                        <div class="toggle-switch active" id="aiAutodebitToggle">
                                            <div class="toggle-knob"></div>
                                        </div>
                                    </div>
                                    <p style="font-size: 0.8rem; color: #334155; line-height: 1.4;">
                                        Let AI analyze your monthly transactions and adjust this auto-debit amount dynamically to maximize your savings without disrupting your cash flow.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Connect to BCA Ecosystem</label>
                            <p class="field-subtext">Link pocket for auto-payments</p>
                            <div class="ecosystem-pills" style="margin-top: 12px;">
                                <span class="eco-pill" data-eco="QRIS">🔄 QRIS & Auto-Pay</span>
                                <span class="eco-pill" data-eco="BCALife">🛡️ BCA Life</span>
                                <span class="eco-pill" data-eco="Sekuritas">📈 BCA Sekuritas</span>
                                <span class="eco-pill locked" data-eco="Finance">🚗 BCA Finance</span>
                            </div>
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
            <div class="account-info-screen" style="background: #F1F5F9; height: 100%; overflow-y: auto; overflow-x: hidden; padding-bottom: 40px;">
                <header class="blue-header" style="height: 160px; align-items: flex-start; padding-top: 40px; padding-bottom: 0;">
                    <div class="back-btn" id="btnBackToHomeFromPockets">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Account Information</h2>
                </header>

                <div class="account-info-content" style="margin-top: -60px; padding: 0 16px; position: relative; z-index: 1;">
                    <!-- Top Account Card -->
                    <div class="ai-account-card">
                        <div class="ai-acc-top">
                            <span class="ai-label">Account No.</span>
                            <div class="ai-number">
                                <strong>547 - 078 - 4808</strong>
                                <span class="copy-icon" style="color: white; font-size: 0.9rem;">📋</span>
                            </div>
                        </div>
                        <div class="ai-acc-bottom">
                            <div class="ai-balance-row">
                                <div class="ai-balance-info">
                                    <span class="ai-label-dark">Active Balance</span>
                                    <div class="ai-balance-amount">
                                        <strong>IDR</strong>
                                        <span class="dots">●●●●●●●</span>
                                    </div>
                                    <span class="ai-type">TAHAPAN XPRESI - IDR</span>
                                    <span class="ai-date">17 May 2026 19:29:00 UTC+7</span>
                                </div>
                                <div class="ai-eye-icon" style="color: #0077C8;">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tabs -->
                    <div class="ai-tabs-container" style="overflow-x: auto; white-space: nowrap; scrollbar-width: none;">
                        <div class="ai-tab" data-target="transactions">Account Transactions</div>
                        <div class="ai-tab" data-target="card">Card</div>
                        <div class="ai-tab active" data-target="pocket">Pocket</div>
                        <div class="ai-tab" data-target="insight" id="tour-target-3">Insight</div>
                    </div>
                    
                    <!-- Tab Contents -->
                    
                    <!-- TRANSACTIONS TAB -->
                    <div class="ai-tab-content" id="tab-transactions" style="display: none;">
                        <div class="pd-search-row" style="margin-bottom: 20px;">
                            <div class="pd-search-box">
                                <span class="search-icon">🔍</span>
                                <input type="text" placeholder="Search" style="background: transparent;">
                            </div>
                            <div class="pd-filter-btn" style="width: 44px; margin-left: 12px;">📄</div>
                            <div class="pd-filter-btn" style="width: 44px; margin-left: 8px;">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                            </div>
                        </div>
                        <h4 style="color: #003366; font-size: 0.85rem; margin-bottom: 16px;">May</h4>
                        
                        <div class="transaction-list">
                            <div class="transaction-item">
                                <div class="tx-date">
                                    <span class="tx-day">16</span>
                                    <span class="tx-month">May</span>
                                    <span class="tx-year">2026</span>
                                </div>
                                <div class="tx-details">
                                    <div class="tx-desc">TRANSFER DR 535 MUHAMMAD RAFLI YUD BI-FAST CR</div>
                                    <div class="tx-amount in">IDR 50,000.00</div>
                                </div>
                            </div>
                            <div class="transaction-item">
                                <div class="tx-date">
                                    <span class="tx-day">16</span>
                                    <span class="tx-month">May</span>
                                    <span class="tx-year">2026</span>
                                </div>
                                <div class="tx-details">
                                    <div class="tx-desc">1605/FTFVA/WS95031 70001/GOPAY TOPUP -- 085283971917<br>TRSF E-BANKING DB</div>
                                    <div class="tx-amount out">IDR 17,000.00</div>
                                </div>
                            </div>
                            <div class="transaction-item">
                                <div class="tx-date">
                                    <span class="tx-day">16</span>
                                    <span class="tx-month">May</span>
                                    <span class="tx-year">2026</span>
                                </div>
                                <div class="tx-details">
                                    <div class="tx-desc">TGL: 0516 QR 914 00000.00Nasi Goren<br>TRANSAKSI DEBIT</div>
                                    <div class="tx-amount out">IDR 16,000.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CARD TAB -->
                    <div class="ai-tab-content" id="tab-card" style="display: none;">
                        <div class="card-item-box">
                            <div class="card-img-placeholder">💳</div>
                            <div class="card-info">
                                <strong>6019 - **** - **** - **59</strong>
                                <span>PASPOR BCA GPN XPRESI</span>
                            </div>
                            <span class="acc-arrow" style="font-size: 1.4rem; color: #0077C8; font-weight: 300;">></span>
                        </div>
                    </div>
                    
                    <!-- POCKET TAB -->
                    <div class="ai-tab-content active" id="tab-pocket">
                        ${state.pendingAllocation ? `
                        <div class="ai-allocation-banner" style="background: linear-gradient(135deg, #0077C8, #00A3E0); border-radius: 16px; padding: 16px; margin-bottom: 24px; color: white; position: relative; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 119, 200, 0.2);">
                            <div style="position: absolute; top: -10px; right: -10px; font-size: 4rem; opacity: 0.1;">✨</div>
                            <div style="display: flex; gap: 12px; align-items: flex-start; position: relative; z-index: 1;">
                                <div style="background: rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; flex-shrink: 0;">🤖</div>
                                <div>
                                    <h4 style="font-size: 0.9rem; margin-bottom: 4px; font-weight: 700;">Smart Recommendation</h4>
                                    <p style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 12px; line-height: 1.4;">Incoming fund <strong>IDR 2.500.000</strong> detected from Payroll. AI has generated an optimal allocation plan.</p>
                                    <button id="btnReviewAllocation" style="background: #FDE047; color: #003366; border: none; padding: 6px 16px; border-radius: 16px; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">Review & Approve <span style="font-size: 1rem;">></span></button>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <div class="rp-main-container" style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid #F1F5F9; margin-bottom: 24px;">
                            <div class="rupiah-pocket-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div style="display: flex; align-items: flex-start; gap: 12px;">
                                    <div class="rp-wallet-illustration" style="position: relative; width: 40px; height: 40px; background: #0077C8; border-radius: 8px 12px 12px 12px; display: flex; justify-content: center; align-items: center; margin-top: 4px;">
                                        <div style="position: absolute; top: -4px; left: 6px; width: 24px; height: 12px; background: #E0F2FE; border-radius: 4px; transform: rotate(-10deg);"></div>
                                        <div style="position: absolute; bottom: -6px; left: -8px; background: #FDE047; color: #b45309; font-size: 0.6rem; font-weight: bold; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 2px solid white;">Rp</div>
                                    </div>
                                    <div>
                                        <div style="color: #475569; font-size: 0.85rem; margin-bottom: 4px;">Rupiah Pocket</div>
                                        <div style="font-size: 1.25rem; font-weight: 800; color: #1e293b;">IDR <span class="dots">●●●●●●●</span></div>
                                    </div>
                                </div>
                                <div class="ai-eye-icon" style="color: #0077C8; cursor: pointer; padding: 4px;">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                                </div>
                            </div>
                            
                            <div style="font-size: 0.75rem; color: #475569; margin-bottom: 20px;">Viewing pockets of account <strong>547 - 078 - 4808</strong></div>
                            
                            <div class="helper-link" style="color: #0077C8; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 12px; margin-bottom: 28px;">
                                <div style="width: 24px; height: 24px; border: 2px solid #0077C8; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-evenly; align-items: flex-start; padding: 2px;">
                                    <div style="width: 12px; height: 2px; background: #0077C8; border-radius: 2px;"></div>
                                    <div style="width: 16px; height: 2px; background: #0077C8; border-radius: 2px;"></div>
                                    <div style="width: 14px; height: 2px; background: #0077C8; border-radius: 2px;"></div>
                                </div>
                                Select Pocket on the Homepage
                            </div>

                            <div class="pocket-list-items" style="margin-bottom: 20px;">
                                ${state.pockets.map(p => `
                                    <div class="pocket-item-box pocket-idr-card" data-id="${p.id}" ${p.id === 1 ? 'id="tour-target-2"' : ''} style="cursor: pointer; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; background: white; transition: all 0.3s ease;">
                                        <div class="pd-icon" style="font-size: 1.5rem; color: #0077C8; position: relative;">
                                            ${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🚗'}
                                            ${p.qrisEnabled ? `<div ${p.id === 1 ? 'id="tour-target-4"' : ''} style="position: absolute; bottom: -2px; right: -6px; background: white; border-radius: 50%; padding: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"><div style="background: #0077C8; color: white; font-size: 0.35rem; font-weight: bold; width: 12px; height: 12px; display: flex; justify-content: center; align-items: center; border-radius: 50%;">QR</div></div>` : ''}
                                        </div>
                                        <div class="pi-info" style="flex: 1;">
                                            <div style="font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 4px;">IDR <span class="dots">●●●●●●●</span></div>
                                            <div style="font-size: 0.8rem; color: #64748B; margin-bottom: 6px;">${p.name}</div>
                                            <!-- Mini Progress Bar -->
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <div style="flex: 1; height: 4px; background: #E2E8F0; border-radius: 2px; overflow: hidden;">
                                                    <div style="height: 100%; width: ${p.progress}%; background: ${p.progress >= 50 ? '#10B981' : '#0077C8'}; border-radius: 2px;"></div>
                                                </div>
                                                <span style="font-size: 0.65rem; color: #64748B; font-weight: 700;">${p.progress}%</span>
                                            </div>
                                        </div>
                                        <span class="acc-arrow" style="font-size: 1.4rem; color: #0077C8; font-weight: 300;">></span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div style="text-align: center;">
                                <span class="pocket-view-all-card" id="tour-target-1" style="color: #0077C8; font-weight: 800; font-size: 0.95rem; display: inline-block; cursor: pointer; padding: 8px; background: white; border-radius: 8px;">More</span>
                            </div>
                        </div>

                        <div class="forex-pocket-card" style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; gap: 16px; margin-bottom: 32px;">
                            <div class="fp-icon-cluster" style="position: relative; width: 50px; height: 50px; flex-shrink: 0;">
                                <div style="width: 40px; height: 40px; background: #0077C8; border-radius: 8px; position: absolute; top: 5px; left: 0;"></div>
                                <div style="position: absolute; top: -5px; right: 0; background: #FDE047; color: #1e293b; font-size: 0.7rem; font-weight: bold; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">$</div>
                                <div style="position: absolute; bottom: 0; left: -5px; background: #4ADE80; color: white; font-size: 0.7rem; font-weight: bold; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">¥</div>
                            </div>
                            <div class="fp-info" style="flex: 1;">
                                <h4 style="font-size: 0.85rem; color: #003366; margin-bottom: 4px;">Forex Pocket</h4>
                                <p style="font-size: 0.75rem; color: #64748B; margin-bottom: 8px; line-height: 1.4;">With Forex Pocket, transactions in various currencies are easier and more convenient.</p>
                                <span style="color: #0077C8; font-size: 0.8rem; font-weight: 700;">Activate Now</span>
                            </div>
                        </div>
                        
                        <!-- RE-ADDED INTELLIGENT CONTROL & REWARDS -->
                        <div style="display: none;">
                            <div class="intelligent-control-section" style="margin-bottom: 32px;">
                            <div class="section-title-row" style="margin-bottom: 12px;">
                                <h3 style="margin: 0; color: #003366; font-size: 1rem;">Intelligent Control</h3>
                                <span class="sparkle-icon" style="background: rgba(0,96,175,0.1); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: var(--primary-blue);">✨ AI Powered</span>
                            </div>
                            <div class="control-features-list">
                                <div class="control-feature-item" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                    <div class="cf-icon" style="background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; flex-shrink: 0;">✨</div>
                                    <div class="cf-content" style="flex: 1;">
                                        <h4 style="font-size: 0.85rem; color: #003366; margin-bottom: 4px;">AI Recommended Auto-Debit</h4>
                                        <p style="font-size: 0.7rem; color: #64748B; line-height: 1.4;">AI dynamically adjusts your auto-debit amount based on your spending habits to maximize savings.</p>
                                    </div>
                                    <div class="cf-toggle">
                                        <div class="toggle-switch active"><div class="toggle-knob"></div></div>
                                    </div>
                                </div>
                                
                                <div class="control-feature-item" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                    <div class="cf-icon" style="background: linear-gradient(135deg, #FEF08A 0%, #FDE047 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; flex-shrink: 0;">📱</div>
                                    <div class="cf-content" style="flex: 1;">
                                        <h4 style="font-size: 0.85rem; color: #003366; margin-bottom: 4px;">QRIS-Linked Pocket</h4>
                                        <p style="font-size: 0.7rem; color: #64748B; line-height: 1.4;">Pay with QRIS directly from your pocket (food, shopping, and more).</p>
                                    </div>
                                    <button class="cf-action-btn" id="btnQrisLink" style="background: #0077C8; color: white; border: none; border-radius: 16px; padding: 6px 16px; font-size: 0.75rem; font-weight: 600;">Link</button>
                                </div>

                                <div class="control-feature-item" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                    <div class="cf-icon" style="background: linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; flex-shrink: 0;">🚨</div>
                                    <div class="cf-content" style="flex: 1;">
                                        <h4 style="font-size: 0.85rem; color: #003366; margin-bottom: 4px;">Emergency Separation</h4>
                                        <p style="font-size: 0.7rem; color: #64748B; line-height: 1.4;">Automatically set aside money for emergencies and prioritize what matters most.</p>
                                    </div>
                                    <div class="cf-toggle">
                                        <div class="toggle-switch active"><div class="toggle-knob"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="challenges-section" style="background: transparent; padding: 0; padding-bottom: 40px;">
                            <h3 style="margin-bottom: 16px; color: #003366; font-size: 1rem;">Active Challenges</h3>
                            
                            <div class="challenge-card completed" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <div class="challenge-icon" style="font-size: 1.5rem;">✅</div>
                                <div class="challenge-content" style="flex: 1;">
                                    <div class="challenge-title" style="font-size: 0.85rem; color: #003366; font-weight: 700; margin-bottom: 4px;">First Pocket Created</div>
                                    <div class="challenge-desc" style="font-size: 0.7rem; color: #64748B; line-height: 1.4;">Start your journey by creating your first saving pocket.</div>
                                    <div class="challenge-reward" style="color: #10B981; font-weight: 700; font-size: 0.75rem; margin-top: 4px;">+500 Pts</div>
                                </div>
                            </div>

                            <div class="challenge-card" style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <div class="challenge-icon" style="font-size: 1.5rem;">📈</div>
                                <div class="challenge-content" style="flex: 1;">
                                    <div class="challenge-title" style="font-size: 0.85rem; color: #003366; font-weight: 700; margin-bottom: 4px;">Reach 50% Goal</div>
                                    <div class="challenge-desc" style="font-size: 0.7rem; color: #64748B; line-height: 1.4;">Maintain your balance until you reach 50% of any goal.</div>
                                    <div class="challenge-reward" style="color: #0077C8; font-weight: 700; font-size: 0.75rem; margin-top: 4px;">+1000 Pts</div>
                                </div>
                            </div>

                            <h3 style="margin: 24px 0 16px 0; color: #003366; font-size: 1rem;">Your Badges</h3>
                            <div class="badges-row" style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px;">
                                ${state.rewards.badges.map(b => `
                                    <div class="badge-item ${b.unlocked ? 'unlocked' : ''}" style="display: flex; flex-direction: column; align-items: center; opacity: ${b.unlocked ? '1' : '0.5'}; min-width: 60px;">
                                        <div class="badge-circle" style="width: 50px; height: 50px; border-radius: 50%; background: ${b.unlocked ? '#FEF08A' : '#E2E8F0'}; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; margin-bottom: 8px;">${b.icon}</div>
                                        <span class="badge-name" style="font-size: 0.65rem; text-align: center; color: #64748B;">${b.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        </div>
                        <!-- END RE-ADDED FEATURES -->
                        
                    </div>
                    
                    <!-- INSIGHT TAB -->
                    <div class="ai-tab-content" id="tab-insight" style="display: none;">
                        <div class="goal-motivation-engine" style="margin-bottom: 24px;">
                            <h3 style="margin-bottom: 16px; color: #003366; font-size: 1rem;">Overall Progress</h3>
                            
                            <!-- Overall Progress Dashboard -->
                            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); margin-bottom: 16px; border: 1px solid #F1F5F9;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px;">
                                    <div>
                                        <h3 style="font-size: 0.95rem; color: #003366; margin-bottom: 4px; font-weight: 800;">Total Goals</h3>
                                        <div style="font-size: 0.75rem; color: #64748B;">Target: IDR 30.000.000</div>
                                    </div>
                                    <div style="font-size: 1.3rem; font-weight: 800; color: #0077C8;">32%</div>
                                </div>
                                
                                <!-- Progress Bar -->
                                <div style="height: 14px; background: #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                                    <div style="height: 100%; width: 32%; background: linear-gradient(90deg, #0077C8, #00A3E0); border-radius: 8px;"></div>
                                </div>
                                
                                <!-- Predictive Time-to-Goal -->
                                <div style="background: #F0F9FF; border-left: 3px solid #00A3E0; padding: 12px 16px; border-radius: 0 8px 8px 0; display: flex; gap: 12px; align-items: flex-start;">
                                    <div style="font-size: 1.2rem; margin-top: -2px;">🤖</div>
                                    <div>
                                        <h4 style="font-size: 0.8rem; color: #0369A1; font-weight: 800; margin-bottom: 4px;">AI Wealth Insight</h4>
                                        <p style="font-size: 0.75rem; color: #0284C7; line-height: 1.4; margin: 0;">You are saving consistently across 3 active pockets. At this rate, your total goals will be met by <strong>August 2028</strong>.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <h3 style="margin-bottom: 16px; margin-top: 24px; color: #003366; font-size: 1rem;">Pocket Performance</h3>
                            <div style="background: white; border-radius: 16px; padding: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid #F1F5F9;">
                                ${state.pockets.map(p => `
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span style="font-size: 0.85rem; color: #1e293b; font-weight: 600;">${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🚗'} ${p.name}</span>
                                    <span style="font-size: 0.8rem; color: ${p.progress >= 50 ? '#10B981' : '#0077C8'}; font-weight: 700;">${p.progress}%</span>
                                </div>
                                <div style="height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-bottom: 16px;">
                                    <div style="height: 100%; width: ${p.progress}%; background: ${p.progress >= 50 ? '#10B981' : '#0077C8'}; border-radius: 3px;"></div>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Allocation Modal Overlay -->
                <div class="allocation-overlay ${state.showAllocationModal ? 'show' : ''}" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: ${state.showAllocationModal ? 'flex' : 'none'}; flex-direction: column; justify-content: flex-end; opacity: ${state.showAllocationModal ? '1' : '0'}; transition: opacity 0.3s ease;">
                    <div class="allocation-sheet" style="background: white; border-radius: 20px 20px 0 0; padding: 24px; animation: slideUp 0.3s ease forwards;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <div>
                                <h3 style="color: #003366; font-size: 1.1rem; margin-bottom: 4px;">AI Auto-Allocation</h3>
                                <p style="color: #64748B; font-size: 0.85rem;">Incoming: IDR 2.500.000</p>
                            </div>
                            <button id="btnCancelAllocation" style="background: none; border: none; font-size: 1.5rem; color: #94A3B8; cursor: pointer;">×</button>
                        </div>

                        <!-- AI Insight Box -->
                        <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 12px; margin-bottom: 20px; display: flex; gap: 12px; align-items: flex-start;">
                            <div style="font-size: 1.2rem;">💡</div>
                            <div>
                                <h4 style="font-size: 0.8rem; color: #0369A1; margin-bottom: 4px; font-weight: 700;">AI Insight</h4>
                                <p style="font-size: 0.75rem; color: #0284C7; line-height: 1.4;">Based on your recent higher food expenses, I've prioritized your "makan" pocket to prevent overdrawing, while maintaining your Emergency Fund target pace.</p>
                            </div>
                        </div>
                        
                        <div class="alloc-items">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9;">
                                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                    <div style="font-size: 1.5rem; width: 40px; height: 40px; background: #F0F9FF; border-radius: 8px; display: flex; justify-content: center; align-items: center;">🚗</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">makan</div>
                                        <div style="font-size: 0.75rem; color: #64748B;">Adjustment for recent expenses</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 8px; width: 130px;">
                                    <span style="font-size: 0.75rem; font-weight: 700; color: #94A3B8;">IDR</span>
                                    <input type="text" value="1.000.000" style="width: 100%; background: transparent; border: none; outline: none; font-weight: 700; color: #10B981; font-size: 0.9rem; text-align: right; padding: 0;">
                                </div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9;">
                                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                    <div style="font-size: 1.5rem; width: 40px; height: 40px; background: #FEF2F2; border-radius: 8px; display: flex; justify-content: center; align-items: center;">🚨</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">Dana Darurat</div>
                                        <div style="font-size: 0.75rem; color: #64748B;">Consistent monthly savings</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 8px; width: 130px;">
                                    <span style="font-size: 0.75rem; font-weight: 700; color: #94A3B8;">IDR</span>
                                    <input type="text" value="1.000.000" style="width: 100%; background: transparent; border: none; outline: none; font-weight: 700; color: #10B981; font-size: 0.9rem; text-align: right; padding: 0;">
                                </div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9;">
                                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                    <div style="font-size: 1.5rem; width: 40px; height: 40px; background: #FFFBEB; border-radius: 8px; display: flex; justify-content: center; align-items: center;">👨‍👩‍👧</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">Liburan Keluarga</div>
                                        <div style="font-size: 0.75rem; color: #64748B;">Bonus allocation</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 8px; width: 130px;">
                                    <span style="font-size: 0.75rem; font-weight: 700; color: #94A3B8;">IDR</span>
                                    <input type="text" value="500.000" style="width: 100%; background: transparent; border: none; outline: none; font-weight: 700; color: #10B981; font-size: 0.9rem; text-align: right; padding: 0;">
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 24px;">
                            <button id="btnApproveAllocation" style="width: 100%; background: #0077C8; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 119, 200, 0.3);">Approve & Allocate</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        qrisSelection: () => `
            <div class="qris-scanner-screen" style="height: 100%; width: 100%; background: #1a1a1a; position: relative; overflow: hidden; display: flex; flex-direction: column;">
                
                <!-- Top Header Overlay -->
                <div style="padding: 40px 20px 20px 20px; display: flex; justify-content: space-between; align-items: center; color: white; position: relative; z-index: 10;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div id="btnBackToHomeFromQRIS" style="cursor: pointer;">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                        </div>
                        <h2 style="font-size: 1.1rem; font-weight: 600; margin: 0;">Scan QRIS</h2>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
                    </div>
                </div>

                <!-- Scanner Target Area (Simulated) -->
                <div style="flex: 1; display: flex; justify-content: center; align-items: center; position: relative;">
                    <div style="width: 250px; height: 250px; border: 2px solid rgba(255,255,255,0.3); position: relative;">
                        <!-- Corner accents -->
                        <div style="position: absolute; top: -2px; left: -2px; width: 30px; height: 30px; border-top: 4px solid white; border-left: 4px solid white;"></div>
                        <div style="position: absolute; top: -2px; right: -2px; width: 30px; height: 30px; border-top: 4px solid white; border-right: 4px solid white;"></div>
                        <div style="position: absolute; bottom: -2px; left: -2px; width: 30px; height: 30px; border-bottom: 4px solid white; border-left: 4px solid white;"></div>
                        <div style="position: absolute; bottom: -2px; right: -2px; width: 30px; height: 30px; border-bottom: 4px solid white; border-right: 4px solid white;"></div>
                    </div>
                    <div style="position: absolute; bottom: 40px; color: white; font-size: 0.9rem; font-weight: 600; text-align: center;">
                        <div style="background: rgba(0,0,0,0.5); padding: 8px 16px; border-radius: 20px;">QRIS Supported</div>
                    </div>
                </div>

                <!-- Bottom Sheet -->
                <div style="background: white; border-radius: 24px 24px 0 0; padding: 16px 20px 30px 20px; position: relative; z-index: 10;">
                    <div style="width: 40px; height: 4px; background: #E2E8F0; border-radius: 2px; margin: 0 auto 20px auto;"></div>
                    
                    <h3 style="text-align: center; color: #003366; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px;">Other QRIS Methods</h3>
                    
                    <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 24px;">
                        <div style="flex: 1; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <div style="color: #0077C8; font-size: 1.5rem; display: flex; align-items: center;">
                                <div style="position: relative; width: 24px; height: 24px;">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                                    <div style="position: absolute; top: -4px; right: -8px; font-size: 0.5rem; background: white; color: #0077C8; font-weight: bold; padding: 1px 2px; border-radius: 4px;">Rp</div>
                                </div>
                            </div>
                            <span style="font-size: 0.8rem; font-weight: 600; color: #475569;">Payment</span>
                        </div>
                        <div style="flex: 1; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <div style="color: #0077C8; font-size: 1.5rem; display: flex; align-items: center;">
                                <div style="position: relative; width: 24px; height: 24px;">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/></svg>
                                    <div style="position: absolute; top: -4px; right: -8px; font-size: 0.5rem; background: white; color: #0077C8; font-weight: bold; padding: 1px 2px; border-radius: 4px;">Rp</div>
                                </div>
                            </div>
                            <span style="font-size: 0.8rem; font-weight: 600; color: #475569;">Transfer</span>
                        </div>
                        <div style="flex: 1; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <div style="color: #0077C8; font-size: 1.5rem; display: flex; align-items: center;">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                            </div>
                            <span style="font-size: 0.8rem; font-weight: 600; color: #475569;">Tap</span>
                        </div>
                    </div>

                    <div style="height: 1px; background: #F1F5F9; margin-bottom: 20px;"></div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="color: #003366; font-size: 0.95rem; font-weight: 700; margin: 0;">Source of Fund</h3>
                        <span style="color: #64748B; font-size: 0.75rem;">Pay directly from pocket</span>
                    </div>

                    <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-left: -20px; padding-left: 20px; padding-right: 20px; scrollbar-width: none;">
                        
                        <!-- Main Account (Always Available) -->
                        <div class="qris-source-card active" style="min-width: 140px; border: 2px solid #0077C8; background: #F0F9FF; border-radius: 12px; padding: 12px; cursor: pointer;">
                            <div style="font-size: 0.7rem; color: #0077C8; margin-bottom: 8px; font-weight: 700;">Main Account</div>
                            <div style="font-weight: 800; color: #1e293b; font-size: 0.9rem; margin-bottom: 4px;">Tahapan Xpresi</div>
                            <div style="font-size: 0.8rem; color: #0077C8; font-weight: 700;">IDR ${state.balance}</div>
                        </div>

                        <!-- Filtered Pockets -->
                        ${state.pockets.filter(p => p.qrisEnabled).map(p => `
                            <div class="qris-source-card" style="min-width: 140px; border: 1px solid #E2E8F0; background: white; border-radius: 12px; padding: 12px; cursor: pointer;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div style="font-size: 0.7rem; color: #64748B; font-weight: 700;">QRIS Pocket</div>
                                    <div style="font-size: 0.8rem;">${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🚗'}</div>
                                </div>
                                <div style="font-weight: 800; color: #1e293b; font-size: 0.9rem; margin-bottom: 4px;">${p.name}</div>
                                <div style="font-size: 0.8rem; color: #64748B; font-weight: 700;">IDR ${p.balance}</div>
                            </div>
                        `).join('')}
                    </div>

                </div>
            </div>
        `,
        onboardingTour: () => `
            <div class="tour-overlay ${state.showTour ? 'show' : ''}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; display: ${state.showTour ? 'block' : 'none'}; pointer-events: auto; overflow: hidden;">
                
                <!-- SVG Mask for Spotlight Cutout -->
                <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
                    <defs>
                        <mask id="tour-mask">
                            <rect width="100%" height="100%" fill="white" />
                            <rect id="tour-cutout" x="0" y="0" width="0" height="0" rx="8" fill="black" style="transition: all 0.3s ease;" />
                        </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#tour-mask)" pointer-events="auto" />
                </svg>

                <div class="tour-card" id="tourCard" style="background: #39A9DB; color: white; border-radius: 12px; padding: 20px 24px; width: 90%; max-width: 340px; box-sizing: border-box; box-shadow: 0 8px 24px rgba(0,0,0,0.3); position: absolute; transition: top 0.3s ease; animation: slideUp 0.3s ease; font-family: sans-serif; left: 50%; transform: translateX(-50%);">
                    
                    <!-- Triangle pointer -->
                    <div id="tourPointerTriangle" style="position: absolute; top: -10px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid #39A9DB; transition: all 0.3s ease;"></div>
                    
                    <div class="tour-step-info" style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; opacity: 0.9;">Step ${state.onboardingStep + 1} of 4</div>
                    
                    <h3 id="tourTitle" style="font-size: 1.2rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3;">1. Buat Poket Pertamamu</h3>
                    
                    <div id="tourDesc" style="font-size: 0.95rem; line-height: 1.5; font-weight: 500; opacity: 0.95;">
                        <p style="margin-bottom: 12px;">Mulai atur keuanganmu dengan membuat Poket. Skenario: Pisahkan dana untuk jajan, liburan, atau dana darurat agar tidak tercampur dengan rekening utama.</p>
                        <div class="tour-tip-badge" style="background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 700;">Tip: Klik tulisan 'More' di bagian bawah daftar poket!</div>
                    </div>
                    
                    <div class="tour-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
                        <button class="skip-btn" id="btnSkipTour" style="background: transparent; color: white; border: none; font-size: 0.9rem; font-weight: 600; opacity: 0.8; cursor: pointer;">Skip Tour</button>
                        <button class="next-btn" id="btnNextTour" style="background: white; color: #39A9DB; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">Next</button>
                    </div>
                </div>
            </div>
        `,
        rewardHub: () => `
            <div class="reward-hub-screen">
                <header class="blue-header">
                    <div class="back-btn" id="btnBackFromRewards">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Reward Hub</h2>
                </header>
                
                <div class="reward-hero">
                    <div class="hero-points-circle">
                        <span class="pts">${state.rewards.points}</span>
                        <span class="label">Pocket Points</span>
                    </div>
                    <h3>Level: ${state.rewards.level}</h3>
                    <div class="streak-badges">
                        <div class="streak-day active">S</div>
                        <div class="streak-day active">M</div>
                        <div class="streak-day active">T</div>
                        <div class="streak-day active">W</div>
                        <div class="streak-day active">T</div>
                        <div class="streak-day">F</div>
                        <div class="streak-day">S</div>
                    </div>
                    <p style="margin-top: 12px; font-size: 0.8rem; opacity: 0.8;">You're on a 5-day saving streak! 🔥</p>
                </div>

                <div class="challenges-section">
                    <h3 style="margin-bottom: 16px; color: var(--text-primary);">Active Challenges</h3>
                    
                    <div class="challenge-card completed">
                        <div class="challenge-icon">✅</div>
                        <div class="challenge-content">
                            <div class="challenge-title">First Pocket Created</div>
                            <div class="challenge-desc">Start your journey by creating your first saving pocket.</div>
                            <div class="challenge-reward">+500 Pts</div>
                        </div>
                    </div>

                    <div class="challenge-card">
                        <div class="challenge-icon">📈</div>
                        <div class="challenge-content">
                            <div class="challenge-title">Reach 50% Goal</div>
                            <div class="challenge-desc">Maintain your balance until you reach 50% of any goal.</div>
                            <div class="challenge-reward">+1000 Pts</div>
                        </div>
                    </div>

                    <h3 style="margin: 24px 0 16px 0; color: var(--text-primary);">Your Badges</h3>
                    <div class="badges-row">
                        ${state.rewards.badges.map(b => `
                            <div class="badge-item ${b.unlocked ? 'unlocked' : ''}">
                                <div class="badge-circle">${b.icon}</div>
                                <span class="badge-name">${b.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `,
        pocketDetail: () => `
            <div class="pocket-detail-screen" style="background: #F1F5F9; min-height: 100vh;">
                <header class="blue-header" style="height: 130px; align-items: flex-start; padding-top: 40px;">
                    <div class="back-btn" id="btnBackToPocketsList">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Rupiah Pocket</h2>
                    <div class="header-options">
                        <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </div>
                </header>

                <div class="pocket-detail-content" style="margin-top: -20px; padding: 0 16px; position: relative; z-index: 1;">
                    <div class="pd-card">
                        <div class="pd-account-row">
                            <span class="pd-acc-label">Pocket Account No.</span>
                            <div class="pd-acc-number">
                                <strong>888 - 005 - 470 - 7848 - 0800</strong>
                                <span class="copy-icon" id="btnCopyPocketAcc">📋</span>
                            </div>
                            <span class="acc-arrow">></span>
                        </div>
                        
                        <div class="pd-main-info">
                            <div class="pd-icon-title">
                                <span class="pd-icon">🚗</span>
                                <h3>Buying a house</h3>
                            </div>
                            <h2 class="pd-balance">IDR 0.00</h2>
                            <span class="pd-category">Transportation</span>
                        </div>
                        
                        <div class="pd-actions">
                            <div class="pd-action-item" id="btnPocketTopUp">
                                <div class="pd-action-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></div>
                                <span>Top Up</span>
                            </div>
                            <div class="pd-action-item" id="btnPocketTransfer">
                                <div class="pd-action-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg></div>
                                <span>Transfer</span>
                            </div>
                            <div class="pd-action-item" id="btnPocketLock">
                                <div class="pd-action-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></div>
                                <span>Lock</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Goal Visibility & Motivation Engine -->
                    <div class="goal-motivation-engine" style="margin-top: 20px; margin-bottom: 24px;">
                        <!-- Visual Progress Dashboard & Predictive Time-to-Goal -->
                        <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); margin-bottom: 16px; border: 1px solid #F1F5F9;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px;">
                                <div>
                                    <h3 style="font-size: 0.95rem; color: #003366; margin-bottom: 4px; font-weight: 800;">Goal Progress</h3>
                                    <div style="font-size: 0.75rem; color: #64748B;">Target: IDR 50.000.000</div>
                                </div>
                                <div style="font-size: 1.3rem; font-weight: 800; color: #0077C8;">45%</div>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div style="height: 14px; background: #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                                <div style="height: 100%; width: 45%; background: linear-gradient(90deg, #0077C8, #00A3E0); border-radius: 8px; transition: width 1s ease-in-out;"></div>
                            </div>
                            
                            <!-- Predictive Time-to-Goal -->
                            <div style="background: #F0F9FF; border-left: 3px solid #00A3E0; padding: 12px 16px; border-radius: 0 8px 8px 0; display: flex; gap: 12px; align-items: flex-start;">
                                <div style="font-size: 1.2rem; margin-top: -2px;">🤖</div>
                                <div>
                                    <h4 style="font-size: 0.8rem; color: #0369A1; font-weight: 800; margin-bottom: 4px;">AI Prediction</h4>
                                    <p style="font-size: 0.75rem; color: #0284C7; line-height: 1.4; margin: 0;">Based on your current saving rate of IDR 2.500.000/month, you will reach your goal in <strong>11 months (April 2027)</strong>.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Smart Motivation & Milestones -->
                        <div style="background: linear-gradient(135deg, #FEF08A 0%, #FDE047 100%); border-radius: 16px; padding: 16px; box-shadow: 0 4px 12px rgba(253, 224, 71, 0.2); display: flex; align-items: center; gap: 16px; position: relative; overflow: hidden;">
                            <div style="position: absolute; right: -10px; top: -10px; font-size: 5rem; opacity: 0.15; transform: rotate(15deg);">🏆</div>
                            <div style="background: white; width: 44px; height: 44px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; flex-shrink: 0; z-index: 1; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                                🔥
                            </div>
                            <div style="z-index: 1;">
                                <h4 style="font-size: 0.9rem; color: #854D0E; font-weight: 800; margin-bottom: 2px;">3-Month Streak!</h4>
                                <p style="font-size: 0.75rem; color: #A16207; line-height: 1.3; margin: 0;">You've saved consistently for 3 months. Next milestone: 50% completion (+500 Pts).</p>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="pd-section-title">ACCOUNT TRANSACTIONS</h3>
                    <div class="pd-search-row">
                        <div class="pd-search-box">
                            <span class="search-icon">🔍</span>
                            <input type="text" placeholder="Search" style="background: transparent;">
                        </div>
                        <div class="pd-filter-btn">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                        </div>
                    </div>
                    
                    <div class="pd-empty-state">
                        <div class="empty-doc-icon"></div>
                        <p>No transaction found.</p>
                    </div>
                </div>
            </div>
        `,
        pocketTransfer: () => `
            <div class="pocket-transfer-screen" style="background: #F1F5F9; min-height: 100vh;">
                <header class="blue-header" style="height: 130px; align-items: flex-start; padding-top: 40px;">
                    <div class="back-btn" id="btnBackToPocketDetail">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Transfer</h2>
                </header>

                <div class="transfer-content" style="margin-top: -20px; padding: 0 16px; position: relative; z-index: 1;">
                    <div class="pt-card">
                        <div class="pt-recipient">
                            <div class="recipient-avatar">
                                <svg viewBox="0 0 24 24" fill="white" width="32" height="32"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                            <div class="recipient-info">
                                <h3>MUHAMMAD RAFKI YUDAWIJAYA</h3>
                                <span>547 - 078 - 4808 - IDR</span>
                            </div>
                        </div>
                        
                        <div class="pt-source-fund">
                            <label>Source of Fund</label>
                            <div class="source-box">
                                <h4>Buying a house</h4>
                                <span>888 - 005 - 470 - 7848 - 0800</span>
                            </div>
                        </div>
                        
                        <div class="pt-amount-input">
                            <div class="currency-label">IDR</div>
                            <div class="amount-field-wrapper">
                                <label>Amount</label>
                                <input type="number" id="transferAmount" placeholder="">
                            </div>
                        </div>
                    </div>
                    
                    <button class="primary-button disabled" id="btnTransferContinue" style="margin-top: 32px; background: #D1D5DB; color: white;">Continue</button>
                </div>
            </div>
        `,
        pocketTopUp: () => `
            <div class="pocket-topup-screen" style="background: #F1F5F9; min-height: 100vh;">
                <header class="blue-header" style="height: 130px; align-items: flex-start; padding-top: 40px;">
                    <div class="back-btn" id="btnBackToPocketDetailFromTopUp">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Top Up</h2>
                </header>

                <div class="transfer-content" style="margin-top: -20px; padding: 0 16px; position: relative; z-index: 1;">
                    <div class="pt-card">
                        <div class="pt-recipient">
                            <div class="recipient-avatar" style="background: #F0F9FF; color: #0077C8;">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5l1.5-4.5h11L19 11H5z"/></svg>
                            </div>
                            <div class="recipient-info">
                                <h3 style="font-size: 1rem; color: #003366;">Buying a house</h3>
                                <span>888 - 005 - 470 - 7848 - 0800</span>
                            </div>
                        </div>
                        
                        <div class="pt-source-fund">
                            <label>Source of Fund</label>
                            <div class="source-box" style="display: flex; flex-direction: column; gap: 4px;">
                                <h4 style="font-size: 1rem; color: #003366;">547 - 078 - 4808</h4>
                                <span style="text-transform: uppercase;">TAHAPAN XPRESI - IDR</span>
                            </div>
                        </div>
                        
                        <div class="pt-amount-input">
                            <div class="currency-label">IDR</div>
                            <div class="amount-field-wrapper">
                                <label>Amount</label>
                                <input type="number" id="topupAmount" placeholder="">
                            </div>
                        </div>
                    </div>
                    
                    <button class="primary-button disabled" id="btnTopUpContinue" style="margin-top: 32px; background: #D1D5DB; color: white;">Continue</button>
                </div>
            </div>
        `,
        pocketLock: () => `
            <div class="pocket-lock-screen" style="background: #F1F5F9; min-height: 100vh;">
                <header class="blue-header" style="height: 130px; align-items: flex-start; padding-top: 40px;">
                    <div class="back-btn" id="btnBackToPocketDetailFromLock">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <h2 class="header-title">Lock Pocket</h2>
                </header>

                <div class="lock-content" style="margin-top: -20px; padding: 0; position: relative; z-index: 1;">
                    <div class="pl-card" style="background: white; border-radius: 24px 24px 0 0; padding: 40px 20px; text-align: center; min-height: calc(100vh - 80px);">
                        <div class="pl-illustration" style="margin-bottom: 40px; display: flex; justify-content: center; position: relative;">
                            <div style="width: 100px; height: 100px; background: #003366; border-radius: 20px; position: relative;">
                                <div style="position: absolute; top: 15px; right: 25px; width: 15px; height: 15px; background: #FDE047; border-radius: 50%;"></div>
                                <div style="position: absolute; bottom: -10px; left: -10px; width: 50px; height: 60px; background: #00A3E0; border-radius: 10px; display: flex; justify-content: center; align-items: center;">
                                    <span style="color: white; font-size: 1.5rem;">🔒</span>
                                </div>
                                <div style="position: absolute; top: -10px; right: -20px; width: 40px; height: 40px; background: #10B981; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 3px solid white;">
                                    <span style="color: white; font-size: 1.2rem;">🏦</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pl-feature">
                            <div class="pl-feature-icon">🔒</div>
                            <div class="pl-feature-text">
                                <h4>Pocket Cannot Be Used for Transactions</h4>
                                <p>Maintain your commitment to saving. When the Pocket is locked, all incoming funds cannot be used for transactions.</p>
                            </div>
                        </div>
                        
                        <div class="pl-feature">
                            <div class="pl-feature-icon">🏦</div>
                            <div class="pl-feature-text">
                                <h4>Unlock your Pocket at the nearest BCA ATM/Branch</h4>
                                <p>A locked Pocket can only be opened at the nearest BCA ATM/Branch.</p>
                                <a href="#" class="guide-link">Guide to Unlock Pocket</a>
                            </div>
                        </div>
                        
                        <button class="primary-button" id="btnLockPocketNow" style="margin-top: 60px;">Lock Pocket Now</button>
                    </div>
                </div>
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
                showToast("Membuka Pockets...");
                setTimeout(() => navigateTo('pocketsDashboard'), 500);
            };

            const btnReward = document.getElementById('btnRewardHub');
            if (btnReward) btnReward.onclick = () => navigateTo('rewardHub');
        } else if (screenName === 'menuSelection') {
            document.getElementById('btnBackToHome').onclick = () => navigateTo('home');
            document.getElementById('itemPockets').onclick = () => navigateTo('pocketsDashboard');
        } else if (screenName === 'pocketsDashboard') {
            const btnBack = document.getElementById('btnBackToHomeFromPockets');
            if (btnBack) btnBack.onclick = () => navigateTo('home');
            
            if (!state.hasSeenPocketTour) {
                state.hasSeenPocketTour = true;
                state.showTour = true;
                setTimeout(() => {
                    initTour();
                    const overlay = document.querySelector('.tour-overlay');
                    if (overlay) overlay.classList.add('show');
                }, 500);
            }
            
            // Tab switching logic
            const tabs = document.querySelectorAll('.ai-tab');
            const contents = document.querySelectorAll('.ai-tab-content');
            tabs.forEach(tab => {
                tab.onclick = () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.style.display = 'none');
                    
                    tab.classList.add('active');
                    const targetId = 'tab-' + tab.getAttribute('data-target');
                    const contentEl = document.getElementById(targetId);
                    if (contentEl) contentEl.style.display = 'block';
                };
            });

            const cfToggles = document.querySelectorAll('.intelligent-control-section .toggle-switch');
            cfToggles.forEach(toggle => {
                toggle.onclick = () => {
                    toggle.classList.toggle('active');
                    showToast(toggle.classList.contains('active') ? "Feature Enabled" : "Feature Disabled");
                };
            });

            const btnQrisLink = document.getElementById('btnQrisLink');
            if (btnQrisLink) {
                btnQrisLink.onclick = () => navigateTo('qrisSelection');
            }

            // Add click for View All to go to createForm for now
            const btnViewAll = document.querySelector('.pocket-view-all-card');
            if (btnViewAll) btnViewAll.onclick = () => navigateTo('createForm');

            const pocketCards = document.querySelectorAll('.pocket-idr-card');
            pocketCards.forEach(card => {
                card.style.cursor = 'pointer';
                card.onclick = () => navigateTo('pocketDetail');
            });
            
            // Allocation Flow Listeners
            const btnReview = document.getElementById('btnReviewAllocation');
            const overlay = document.querySelector('.allocation-overlay');
            if (btnReview && overlay) {
                btnReview.onclick = () => {
                    overlay.style.display = 'flex';
                    overlay.offsetHeight; // force reflow
                    overlay.style.opacity = '1';
                    overlay.classList.add('show');
                };
            }
            
            const btnCancelAlloc = document.getElementById('btnCancelAllocation');
            if (btnCancelAlloc && overlay) {
                btnCancelAlloc.onclick = () => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.style.display = 'none';
                        overlay.classList.remove('show');
                    }, 300);
                };
            }
            
            const btnApproveAlloc = document.getElementById('btnApproveAllocation');
            if (btnApproveAlloc && overlay) {
                btnApproveAlloc.onclick = () => {
                    showToast("Funds successfully allocated! ✨");
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.style.display = 'none';
                        overlay.classList.remove('show');
                        state.pendingAllocation = false; // remove banner
                        
                        // Simulate balance updates for pockets
                        state.pockets[0].balance = "3.500.000"; // +1m
                        state.pockets[1].balance = "7.000.000"; // +1m
                        state.pockets[2].balance = "1.700.000"; // +500k
                        
                        // Re-render dashboard to show updated balances
                        navigateTo('pocketsDashboard');
                    }, 300);
                };
            }
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

            const allToggles = document.querySelectorAll('.create-pocket-screen .toggle-switch');
            allToggles.forEach(toggle => {
                toggle.onclick = () => {
                    toggle.classList.toggle('active');
                    
                    const toggleLabelGroup = toggle.closest('.form-group-toggle');
                    if (toggleLabelGroup && toggleLabelGroup.querySelector('label').textContent === 'Locked Pocket') {
                        state.newPocketData.locked = toggle.classList.contains('active');
                    }
                    
                    if (toggle.id === 'autodebitToggle') {
                        const settings = document.getElementById('autodebitSettings');
                        settings.style.display = toggle.classList.contains('active') ? 'block' : 'none';
                    }
                    
                    if (toggle.id === 'aiAutodebitToggle') {
                        showToast(toggle.classList.contains('active') ? "AI Recommendation Enabled" : "AI Recommendation Disabled");
                    }
                };
            });

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
            
            const sourceCards = document.querySelectorAll('.qris-source-card');
            sourceCards.forEach(card => {
                card.onclick = () => {
                    // Reset all
                    sourceCards.forEach(c => {
                        c.classList.remove('active');
                        c.style.border = '1px solid #E2E8F0';
                        c.style.background = 'white';
                    });
                    
                    // Set active
                    card.classList.add('active');
                    card.style.border = '2px solid #0077C8';
                    card.style.background = '#F0F9FF';
                    
                    showToast('Sumber Dana dipilih');
                };
            });
        } else if (screenName === 'rewardHub') {
            document.getElementById('btnBackFromRewards').onclick = () => navigateTo('home');
        } else if (screenName === 'onboarding') {
            document.getElementById('navHomeFromTracker').onclick = () => navigateTo('home');
        } else if (screenName === 'pocketDetail') {
            document.getElementById('btnBackToPocketsList').onclick = () => navigateTo('pocketsDashboard');
            document.getElementById('btnPocketTopUp').onclick = () => navigateTo('pocketTopUp');
            document.getElementById('btnPocketTransfer').onclick = () => navigateTo('pocketTransfer');
            document.getElementById('btnPocketLock').onclick = () => navigateTo('pocketLock');
            const btnCopy = document.getElementById('btnCopyPocketAcc');
            if (btnCopy) btnCopy.onclick = () => showToast("Account number copied!");
        } else if (screenName === 'pocketTransfer') {
            document.getElementById('btnBackToPocketDetail').onclick = () => navigateTo('pocketDetail');
            
            const amtInput = document.getElementById('transferAmount');
            const btnContinue = document.getElementById('btnTransferContinue');
            if (amtInput && btnContinue) {
                amtInput.addEventListener('input', (e) => {
                    if (e.target.value.length > 0) {
                        btnContinue.classList.remove('disabled');
                        btnContinue.style.background = 'var(--primary-blue)';
                    } else {
                        btnContinue.classList.add('disabled');
                        btnContinue.style.background = '#D1D5DB';
                    }
                });
                btnContinue.onclick = () => {
                    if (!btnContinue.classList.contains('disabled')) {
                        showToast("Transfer processed!");
                        setTimeout(() => navigateTo('pocketDetail'), 1000);
                    }
                };
            }
        } else if (screenName === 'pocketLock') {
            document.getElementById('btnBackToPocketDetailFromLock').onclick = () => navigateTo('pocketDetail');
            document.getElementById('btnLockPocketNow').onclick = () => {
                showToast("Pocket successfully locked!");
                setTimeout(() => navigateTo('pocketDetail'), 1000);
            };
        } else if (screenName === 'pocketTopUp') {
            document.getElementById('btnBackToPocketDetailFromTopUp').onclick = () => navigateTo('pocketDetail');
            
            const amtInput = document.getElementById('topupAmount');
            const btnContinue = document.getElementById('btnTopUpContinue');
            if (amtInput && btnContinue) {
                amtInput.addEventListener('input', (e) => {
                    if (e.target.value.length > 0) {
                        btnContinue.classList.remove('disabled');
                        btnContinue.style.background = 'var(--primary-blue)';
                    } else {
                        btnContinue.classList.add('disabled');
                        btnContinue.style.background = '#D1D5DB';
                    }
                });
                btnContinue.onclick = () => {
                    if (!btnContinue.classList.contains('disabled')) {
                        showToast("Top Up successful!");
                        setTimeout(() => navigateTo('pocketDetail'), 1000);
                    }
                };
            }
        }
    }

    function attachTourListeners() {
        const overlay = document.querySelector('.tour-overlay');
        const nextBtn = document.getElementById('btnNextTour');
        const skipBtn = document.getElementById('btnSkipTour');
        
        const tourData = [
            { 
                title: "1. Buat Poket Pertamamu", 
                desc: "Mulai atur keuanganmu dengan membuat Poket. Skenario: Pisahkan dana untuk jajan, liburan, atau dana darurat agar tidak tercampur dengan rekening utama.",
                tip: "Tip: Klik tulisan 'More' di bagian bawah daftar poket!"
            },
            { 
                title: "2. Lihat Detail & Motivasi", 
                desc: "Skenario: Bosan menabung? Klik salah satu Poket untuk melihat Goal Visibility Dashboard. Prediksi AI akan menghitung kapan targetmu tercapai!",
                tip: "Tip: Pertahankan konsistensi menabungmu untuk mendapat 'Streak' dan Poin Reward!"
            },
            { 
                title: "3. AI Wealth Insight", 
                desc: "Skenario: Ingin tahu kondisi keuangan secara keseluruhan? Buka tab 'Insight'. AI kami akan merangkum performa semua poketmu secara cerdas.",
                tip: "Tip: Evaluasi performa menabungmu setiap akhir bulan di halaman ini."
            },
            { 
                title: "4. Auto-Allocation & QRIS", 
                desc: "Skenario: Ada gaji masuk? AI akan tawarkan alokasi otomatis! Kamu juga bisa bayar belanjaan langsung dari Poket jajan via QRIS.",
                tip: "Tip: Aktifkan 'QRIS Payment' saat membuat poket khusus pengeluaran."
            }
        ];

        function updateTourHighlight() {
            const targetId = 'tour-target-' + (state.onboardingStep + 1);
            const targetEl = document.getElementById(targetId);
            const cutout = document.getElementById('tour-cutout');
            const card = document.getElementById('tourCard');
            const pointer = document.getElementById('tourPointerTriangle');
            const appContainer = document.querySelector('.app-container');
            
            if (targetEl && cutout && card && appContainer) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    const rect = targetEl.getBoundingClientRect();
                    const containerRect = appContainer.getBoundingClientRect();
                    
                    const relTop = rect.top - containerRect.top;
                    const relLeft = rect.left - containerRect.left;
                    
                    cutout.setAttribute('x', relLeft - 4);
                    cutout.setAttribute('y', relTop - 4);
                    cutout.setAttribute('width', rect.width + 8);
                    cutout.setAttribute('height', rect.height + 8);
                    
                    let cardTop = relTop + rect.height + 20;
                    if (cardTop + 250 > appContainer.clientHeight) {
                        cardTop = relTop - 250 - 20;
                        pointer.style.bottom = "-10px";
                        pointer.style.top = "auto";
                        pointer.style.borderBottom = "none";
                        pointer.style.borderTop = "10px solid #39A9DB";
                    } else {
                        pointer.style.top = "-10px";
                        pointer.style.bottom = "auto";
                        pointer.style.borderTop = "none";
                        pointer.style.borderBottom = "10px solid #39A9DB";
                    }
                    
                    card.style.top = cardTop + 'px';
                    
                    const targetCenter = relLeft + (rect.width / 2);
                    const cardWidth = Math.min(appContainer.clientWidth * 0.9, 340);
                    const cardLeft = (appContainer.clientWidth / 2) - (cardWidth / 2);
                    
                    let pointerLeft = targetCenter - cardLeft - 10;
                    pointerLeft = Math.max(16, Math.min(pointerLeft, cardWidth - 36));
                    pointer.style.left = pointerLeft + 'px';
                    
                }, 300);
            }
        }

        // Initialize first highlight
        setTimeout(updateTourHighlight, 100);

        nextBtn.onclick = () => {
            state.onboardingStep++;
            if (state.onboardingStep < tourData.length) {
                document.querySelector('.tour-step-info').textContent = `Step ${state.onboardingStep + 1} of ${tourData.length}`;
                document.getElementById('tourTitle').textContent = tourData[state.onboardingStep].title;
                document.getElementById('tourDesc').innerHTML = `
                    <p style="margin-bottom: 12px;">${tourData[state.onboardingStep].desc}</p>
                    <div class="tour-tip-badge">${tourData[state.onboardingStep].tip}</div>
                `;
                updateTourHighlight();
            } else {
                overlay.style.display = 'none';
                state.onboardingStep = 0;
            }
        };

        skipBtn.onclick = () => {
            overlay.style.display = 'none';
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
