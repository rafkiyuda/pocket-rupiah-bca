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
        pendingAllocation: true,
        showAllocationModal: false,
        ecoInvestasiStep: 0,
        ecoBcaLifeStep: 0,
        ecoBcaFinanceStep: 0,
        ecoFinanceSim: { harga: 200000000, dp: 40000000, tenor: 36, cicilan: 4580000 },
        existingBcaProducts: [
            { id: 'fin1', type: 'finance', name: 'KKB Toyota Avanza', detail: 'Sisa 28 cicilan · Rp 4.580.000/bln', icon: '🚗', status: 'active', dueDate: 5 },
            { id: 'life1', type: 'life', name: 'MyGuard Plus', detail: 'Premi Rp 42.000/bln · Auto-renew Apr 2026', icon: '🛡️', status: 'active', dueDate: 1 },
            { id: 'inv1', type: 'investasi', name: 'BCA Dana Berencana', detail: 'Portofolio Rp 3.200.000 · Beli berkala Rp 500.000/bln', icon: '📈', status: 'active', dueDate: 25 }
        ],
        connectedLinks: [],
        ecoConnectProductId: null,
        lifeStage: {
            detected: 'Young Professional',
            confidence: 92,
            icon: '👨‍💼',
            signals: ['Gaji rutin terdeteksi', 'Pengeluaran food & entertainment tinggi', 'Belum ada cicilan KPR', 'Usia 25-28 tahun'],
            insight: 'Kamu sedang di fase membangun fondasi keuangan. Sekarang waktu terbaik untuk mulai investasi jangka panjang dan membangun dana darurat yang kuat.',
            nextActions: [
                { icon: '💰', title: 'Bangun Dana Darurat', desc: '3-6x pengeluaran bulanan (target IDR 24 Juta)', cta: 'Buat Poket', screen: 'createForm', urgent: true },
                { icon: '📈', title: 'Mulai Investasi Reksa Dana', desc: 'BCA Sekuritas · mulai Rp 10.000/bln via SIP', cta: 'Buka BCA Sekuritas', screen: 'ecoInvestasi', urgent: false },
                { icon: '🏠', title: 'Rencanakan KPR BCA', desc: 'Simulasikan kemampuan cicilan KPR sekarang', cta: 'Simulasi', screen: 'ecoBcaFinance', urgent: false }
            ],
            stages: [
                { key: 'student', label: 'Pelajar', icon: '🎓', active: false },
                { key: 'young_pro', label: 'Young Professional', icon: '👨‍💼', active: true },
                { key: 'family', label: 'Berkeluarga', icon: '👨‍👩‍👧', active: false },
                { key: 'education', label: 'Pendidikan Anak', icon: '📚', active: false },
                { key: 'retirement', label: 'Pensiun', icon: '🏡', active: false }
            ]
        },
        goalEngine: {
            income: 8000000,
            needs: 50,
            wants: 30,
            savings: 20,
            optimizedAlloc: [
                { pocket: 'Dana Darurat', monthly: 1600000, priority: 1, progress: 40, target: 24000000, eta: '14 bln', icon: '🚨', color: '#EF4444' },
                { pocket: 'Investasi Reksa Dana', monthly: 500000, priority: 2, progress: 0, target: 6000000, eta: '12 bln', icon: '📈', color: '#0077C8' },
                { pocket: 'Liburan', monthly: 500000, priority: 3, progress: 12, target: 10000000, eta: '20 bln', icon: '✈️', color: '#8B5CF6' }
            ],
            templates: [
                { name: 'Dana Darurat', icon: '🚨', desc: '6x pengeluaran bulanan', color: '#FEF2F2', border: '#FCA5A5', amount: 24000000 },
                { name: 'KPR BCA', icon: '🏠', desc: 'DP 20% rumah impian', color: '#F0F9FF', border: '#BAE6FD', amount: 80000000 },
                { name: 'Dana Pendidikan', icon: '🎓', desc: 'Biaya kuliah S1 anak', color: '#F0FDF4', border: '#BBF7D0', amount: 100000000 },
                { name: 'Pensiun', icon: '🏡', desc: 'Dana hari tua yang nyaman', color: '#FFF7ED', border: '#FED7AA', amount: 500000000 }
            ]
        },
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
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                <label style="margin-bottom: 0;">Connect to BCA Ecosystem</label>
                                <span style="background: #E0F2FE; color: #0077C8; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;">NEW</span>
                            </div>
                            <p class="field-subtext">Link your pocket to myBCA ecosystem for faster goal completion and protection.</p>
                            <div class="ecosystem-pills" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 10px;">
                                <span class="eco-pill active" data-eco="QRIS" style="cursor: pointer; padding: 8px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid #0077C8; background: #0077C8; color: white;">🔄 QRIS & Auto-Pay</span>
                                <span class="eco-pill" data-eco="Investasi" style="cursor: pointer; padding: 8px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid #E2E8F0; background: white; color: #64748B;">📈 BCA Sekuritas</span>
                                <span class="eco-pill" data-eco="BCALife" style="cursor: pointer; padding: 8px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid #E2E8F0; background: white; color: #64748B;">🛡️ BCA Life</span>
                                <span class="eco-pill" data-eco="Finance" style="cursor: pointer; padding: 8px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid #E2E8F0; background: white; color: #64748B;">🚗 BCA Finance</span>
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
                        <!-- GOAL ENGINE CARD -->
                        <div style="background: linear-gradient(135deg, #0077C8 0%, #00A3E0 100%); border-radius: 20px; padding: 18px; margin-bottom: 20px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 24px rgba(0,119,200,0.25);">
                            <div style="position: absolute; top: -20px; right: -10px; font-size: 6rem; opacity: 0.08;">⚡</div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                                <div style="background: rgba(255,255,255,0.15); border-radius: 8px; padding: 4px 10px; font-size: 0.65rem; font-weight: 700;">⚡ GOAL ENGINE</div>
                                <div style="background: rgba(255,255,255,0.2); font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 10px;">AI Optimized</div>
                            </div>
                            <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 4px; position: relative; z-index: 1;">Smart Allocation Plan</h3>
                            <p style="font-size: 0.75rem; opacity: 0.85; margin: 0 0 14px; position: relative; z-index: 1;">Alokasi otomatis IDR 8.000.000/bln berdasarkan Need vs Want & prioritas goal.</p>
                            <div style="position: relative; z-index: 1; margin-bottom: 14px;">
                                ${state.goalEngine.optimizedAlloc.map(a => `
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <div style="font-size: 0.85rem; width: 20px; text-align: center; flex-shrink: 0;">${a.icon}</div>
                                    <div style="flex: 1;"><div style="height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden;"><div style="height: 100%; width: ${Math.round(a.monthly / state.goalEngine.income * 100)}%; background: rgba(255,255,255,0.85); border-radius: 3px;"></div></div></div>
                                    <div style="font-size: 0.65rem; font-weight: 700; white-space: nowrap; opacity: 0.9;">Rp ${(a.monthly/1000000).toFixed(1)}Jt</div>
                                </div>`).join('')}
                            </div>
                            <div style="display: flex; gap: 8px; position: relative; z-index: 1; margin-bottom: 14px;">
                                <div style="flex:1;background:rgba(255,255,255,0.12);border-radius:10px;padding:8px;text-align:center;"><div style="font-size:0.65rem;opacity:0.75;margin-bottom:2px;">Kebutuhan</div><div style="font-size:0.9rem;font-weight:800;">${state.goalEngine.needs}%</div></div>
                                <div style="flex:1;background:rgba(255,255,255,0.12);border-radius:10px;padding:8px;text-align:center;"><div style="font-size:0.65rem;opacity:0.75;margin-bottom:2px;">Keinginan</div><div style="font-size:0.9rem;font-weight:800;">${state.goalEngine.wants}%</div></div>
                                <div style="flex:1;background:rgba(255,255,255,0.12);border-radius:10px;padding:8px;text-align:center;"><div style="font-size:0.65rem;opacity:0.75;margin-bottom:2px;">Tabungan</div><div style="font-size:0.9rem;font-weight:800;">${state.goalEngine.savings}%</div></div>
                            </div>
                            <button id="goalEngineCard" style="width:100%;background:white;color:#0077C8;border:none;padding:11px;border-radius:12px;font-weight:800;font-size:0.85rem;cursor:pointer;position:relative;z-index:1;">Lihat Detail ›</button>
                        </div>

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
                                        <div class="pd-icon" ${p.id === 1 ? 'id="tour-target-4"' : ''} style="font-size: 1.5rem; color: #0077C8; position: relative;">
                                            ${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🚗'}
                                            ${p.qrisEnabled ? `<div class="qris-shortcut-badge" data-pocket-id="${p.id}" style="position: absolute; bottom: -2px; right: -6px; background: white; border-radius: 50%; padding: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: pointer; z-index: 2;"><div style="background: #0077C8; color: white; font-size: 0.35rem; font-weight: bold; width: 12px; height: 12px; display: flex; justify-content: center; align-items: center; border-radius: 50%;">QR</div></div>` : ''}
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

                        <!-- PROTECTION & SHARED EXPANSION CARD -->
                        <div class="rp-main-container" style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid #F1F5F9; margin-bottom: 16px;">
                            <div class="rupiah-pocket-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div style="display: flex; align-items: flex-start; gap: 12px;">
                                    <div style="position: relative; width: 40px; height: 40px; background: #0077C8; border-radius: 8px 12px 12px 12px; display: flex; justify-content: center; align-items: center; margin-top: 4px; flex-shrink: 0;">
                                        <div style="position: absolute; top: -4px; left: 6px; width: 24px; height: 12px; background: #E0F2FE; border-radius: 4px; transform: rotate(-10deg);"></div>
                                        <div style="position: absolute; bottom: -6px; left: -8px; background: #FDE047; color: #b45309; font-size: 0.6rem; font-weight: bold; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 2px solid white;">🛡️</div>
                                    </div>
                                    <div>
                                        <div style="color: #475569; font-size: 0.85rem; margin-bottom: 4px;">Protection & Shared</div>
                                        <div style="font-size: 1.1rem; font-weight: 800; color: #1e293b;">Family & Protection</div>
                                    </div>
                                </div>
                                <div style="background: #EFF6FF; color: #0077C8; font-size: 0.65rem; font-weight: 700; padding: 3px 10px; border-radius: 10px; margin-top: 4px;">New</div>
                            </div>

                            <div style="font-size: 0.75rem; color: #475569; margin-bottom: 20px;">Manage <strong>family finances together</strong>, get proactive protection recommendations.</div>

                            <div style="margin-bottom: 20px;">
                                ${[
                                    { icon: '👨‍👩‍👧', label: 'Shared Pocket', sub: 'Keluarga Santoso · 3 members', pct: 65, color: '#10B981' },
                                    { icon: '🛡️', label: 'Life Protection', sub: 'Not active · BCA Life available', pct: 0, color: '#EF4444' }
                                ].map(f => `
                                <div style="cursor: pointer; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 16px; background: white; transition: all 0.3s ease;">
                                    <div style="font-size: 1.5rem; color: #0077C8;">${f.icon}</div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 0.88rem; font-weight: 800; color: #1e293b; margin-bottom: 4px;">${f.label}</div>
                                        <div style="font-size: 0.75rem; color: #64748B; margin-bottom: 6px;">${f.sub}</div>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="flex: 1; height: 4px; background: #E2E8F0; border-radius: 2px; overflow: hidden;">
                                                <div style="height: 100%; width: ${f.pct}%; background: ${f.color}; border-radius: 2px;"></div>
                                            </div>
                                            <span style="font-size: 0.65rem; color: #64748B; font-weight: 700;">${f.pct}%</span>
                                        </div>
                                    </div>
                                    <span style="font-size: 1.4rem; color: #0077C8; font-weight: 300;">></span>
                                </div>`).join('')}
                            </div>

                            <div style="text-align: center;">
                                <span id="btnOpenSharedProtection" onclick="navigateTo('sharedProtection')" style="color: #0077C8; font-weight: 800; font-size: 0.95rem; display: inline-block; cursor: pointer; padding: 8px; background: white; border-radius: 8px;">Explore All Features</span>
                            </div>
                        </div>

                        <!-- REWARDS CARD -->
                        <div class="rp-main-container" style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid #F1F5F9; margin-bottom: 16px; cursor: pointer;" onclick="navigateTo('rewards')">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div style="display: flex; align-items: flex-start; gap: 12px;">
                                    <div style="position: relative; width: 40px; height: 40px; background: #0077C8; border-radius: 8px 12px 12px 12px; display: flex; justify-content: center; align-items: center; margin-top: 4px; flex-shrink: 0;">
                                        <div style="position: absolute; top: -4px; left: 6px; width: 24px; height: 12px; background: #E0F2FE; border-radius: 4px; transform: rotate(-10deg);"></div>
                                        <div style="position: absolute; bottom: -6px; left: -8px; background: #FDE047; color: #b45309; font-size: 0.7rem; font-weight: bold; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 2px solid white;">🏆</div>
                                    </div>
                                    <div>
                                        <div style="color: #475569; font-size: 0.85rem; margin-bottom: 4px;">Pocket Rewards</div>
                                        <div style="font-size: 1.25rem; font-weight: 800; color: #1e293b;">${state.rewards.points} <span style="font-size:0.8rem;color:#64748B;font-weight:600;">Pts</span></div>
                                    </div>
                                </div>
                                <div style="text-align:right;margin-top:4px;">
                                    <div style="background:#FEF08A;color:#B45309;font-size:0.68rem;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:4px;">${state.rewards.level}</div>
                                    <div style="font-size:0.65rem;color:#94A3B8;">🔥 ${state.rewards.streak} day streak</div>
                                </div>
                            </div>
                            <div style="font-size: 0.72rem; color: #64748B; margin-bottom: 8px;">${state.rewards.nextLevelPts - state.rewards.points} Pts to next level</div>
                            <div style="height:6px;background:#E2E8F0;border-radius:3px;overflow:hidden;margin-bottom:16px;">
                                <div style="height:100%;width:${Math.round(state.rewards.points/state.rewards.nextLevelPts*100)}%;background:linear-gradient(90deg,#0077C8,#00A3E0);border-radius:3px;"></div>
                            </div>
                            <!-- Badges mini row -->
                            <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;">
                                ${state.rewards.badges.map(b => `<div style="width:36px;height:36px;border-radius:50%;background:${b.unlocked?'#FEF08A':'#E2E8F0'};display:flex;justify-content:center;align-items:center;font-size:1.1rem;opacity:${b.unlocked?1:0.4};border:2px solid ${b.unlocked?'#FDE047':'#E2E8F0'}">${b.icon}</div>`).join('')}
                                <span style="font-size:0.72rem;color:#64748B;margin-left:4px;">${state.rewards.badges.filter(b=>b.unlocked).length}/${state.rewards.badges.length} badges</span>
                            </div>
                            <div style="text-align:center;">
                                <span style="color:#0077C8;font-weight:800;font-size:0.95rem;">View Rewards ›</span>
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

                        <!-- ACTIVE CHALLENGES & BADGES -->
                        <div style="padding-bottom: 40px;">
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
                        <!-- AI LIFE-STAGE DETECTION CARD -->
                        <div id="lifeStageCard" style="background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%); border-radius: 20px; padding: 20px; margin-bottom: 20px; color: white; position: relative; overflow: hidden; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
                            <div style="position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.04);"></div>
                            <div style="position: absolute; bottom: -30px; left: 40px; width: 80px; height: 80px; border-radius: 50%; background: rgba(0,163,224,0.12);"></div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; position: relative; z-index: 1;">
                                <div style="background: rgba(0,163,224,0.25); border-radius: 8px; padding: 4px 10px; font-size: 0.65rem; font-weight: 700; color: #7DD3FC;">✨ AI LIFE-STAGE DETECTION</div>
                                <div style="background: #10B981; font-size: 0.65rem; font-weight: 800; padding: 3px 8px; border-radius: 10px;">${state.lifeStage.confidence}% yakin</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; position: relative; z-index: 1;">
                                <div style="font-size: 2.8rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">${state.lifeStage.icon}</div>
                                <div>
                                    <div style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 2px;">Life Stage Terdeteksi</div>
                                    <div style="font-size: 1.3rem; font-weight: 800; color: white; line-height: 1.2;">${state.lifeStage.detected}</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 6px; margin-bottom: 14px; position: relative; z-index: 1;">
                                ${state.lifeStage.stages.map(s => `
                                <div style="flex: 1; text-align: center;">
                                    <div style="height: 3px; border-radius: 2px; background: ${s.active ? '#00A3E0' : 'rgba(255,255,255,0.15)'}; margin-bottom: 5px;"></div>
                                    <div style="font-size: 0.55rem; color: ${s.active ? '#7DD3FC' : 'rgba(255,255,255,0.4)'}; font-weight: ${s.active ? '700' : '400'}; line-height: 1.3;">${s.label}</div>
                                </div>`).join('')}
                            </div>
                            <div style="background: rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; position: relative; z-index: 1;">
                                <p style="font-size: 0.75rem; color: #CBD5E1; line-height: 1.5; margin: 0;">${state.lifeStage.insight.substring(0, 90)}...</p>
                            </div>
                            <div style="position: relative; z-index: 1;">
                                <div style="font-size: 0.68rem; color: #64748B; font-weight: 700; margin-bottom: 8px; text-transform: uppercase;">Next-Best Actions</div>
                                <div style="display: flex; gap: 8px;">
                                    ${state.lifeStage.nextActions.slice(0, 2).map(a => `
                                    <div style="flex: 1; background: ${a.urgent ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.07)'}; border: 1px solid ${a.urgent ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}; border-radius: 10px; padding: 8px 10px;">
                                        <div style="font-size: 1rem; margin-bottom: 3px;">${a.icon}</div>
                                        <div style="font-size: 0.68rem; font-weight: 700; color: white; line-height: 1.3;">${a.title}</div>
                                    </div>`).join('')}
                                    <div style="width: 36px; background: rgba(0,163,224,0.2); border: 1px solid rgba(0,163,224,0.3); border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1rem; color: #7DD3FC; flex-shrink: 0;">›</div>
                                </div>
                            </div>
                        </div>

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
                        <div class="qris-source-card ${!state.selectedQrisPocketId ? 'active' : ''}" style="min-width: 140px; border: ${!state.selectedQrisPocketId ? '2px solid #0077C8' : '1px solid #E2E8F0'}; background: ${!state.selectedQrisPocketId ? '#F0F9FF' : 'white'}; border-radius: 12px; padding: 12px; cursor: pointer;">
                            <div style="font-size: 0.7rem; color: ${!state.selectedQrisPocketId ? '#0077C8' : '#64748B'}; margin-bottom: 8px; font-weight: 700;">Main Account</div>
                            <div style="font-weight: 800; color: #1e293b; font-size: 0.9rem; margin-bottom: 4px;">Tahapan Xpresi</div>
                            <div style="font-size: 0.8rem; color: ${!state.selectedQrisPocketId ? '#0077C8' : '#64748B'}; font-weight: 700;">IDR ${state.balance}</div>
                        </div>

                        <!-- Filtered Pockets -->
                        ${state.pockets.filter(p => p.qrisEnabled).map(p => `
                            <div class="qris-source-card ${state.selectedQrisPocketId === p.id ? 'active' : ''}" style="min-width: 140px; border: ${state.selectedQrisPocketId === p.id ? '2px solid #0077C8' : '1px solid #E2E8F0'}; background: ${state.selectedQrisPocketId === p.id ? '#F0F9FF' : 'white'}; border-radius: 12px; padding: 12px; cursor: pointer;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div style="font-size: 0.7rem; color: ${state.selectedQrisPocketId === p.id ? '#0077C8' : '#64748B'}; font-weight: 700;">QRIS Pocket</div>
                                    <div style="font-size: 0.8rem;">${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🚗'}</div>
                                </div>
                                <div style="font-weight: 800; color: #1e293b; font-size: 0.9rem; margin-bottom: 4px;">${p.name}</div>
                                <div style="font-size: 0.8rem; color: ${state.selectedQrisPocketId === p.id ? '#0077C8' : '#64748B'}; font-weight: 700;">IDR ${p.balance}</div>
                            </div>
                        `).join('')}
                    </div>

                </div>
            </div>
        `,
        ecoInvestasi: () => `
            <div style="background:#F1F5F9;min-height:100vh;">
                <header class="blue-header" style="height:130px;align-items:flex-start;padding-top:40px;">
                    <div class="back-btn" id="btnBackFromEcoInvestasi"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
                    <h2 class="header-title">myBCA Investasi</h2>
                </header>
                <div style="margin-top:-20px;padding:0 16px;position:relative;z-index:1;">
                    <!-- Step Indicator -->
                    <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;gap:8px;margin-bottom:16px;">
                            ${[1,2,3,4].map(n=>`<div style="flex:1;height:4px;border-radius:2px;background:${n<=state.ecoInvestasiStep+1?'#0077C8':'#E2E8F0'};"></div>`).join('')}
                        </div>
                        <!-- STEP 0: Cek SID -->
                        <div class="eco-inv-step">
                            <div style="text-align:center;padding:12px 0;">
                                <div style="font-size:3rem;margin-bottom:12px;">🪪</div>
                                <h3 style="color:#003366;font-size:1rem;font-weight:800;margin-bottom:8px;">Cek Status SID</h3>
                                <p style="font-size:0.8rem;color:#64748B;line-height:1.5;margin-bottom:16px;">Single Investor Identification (SID) adalah identitas investor pasar modal yang diterbitkan KSEI. Kamu belum memiliki SID.</p>
                                <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">
                                    <p style="font-size:0.78rem;color:#92400E;margin:0;"><strong>⚠️ SID Belum Terdaftar</strong><br>Daftarkan SID-mu terlebih dahulu untuk bisa berinvestasi reksa dana.</p>
                                </div>
                                <button class="eco-inv-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;">Daftar SID Sekarang →</button>
                            </div>
                        </div>
                        <!-- STEP 1: Profil Risiko -->
                        <div class="eco-inv-step" style="display:none;">
                            <h3 style="color:#003366;font-size:1rem;font-weight:800;margin-bottom:4px;">Profil Risiko Investasi</h3>
                            <p style="font-size:0.78rem;color:#64748B;margin-bottom:16px;">Jawab pertanyaan berikut agar kami merekomendasikan produk yang sesuai.</p>
                            ${[{q:'Tujuan investasi kamu?',opts:['Keamanan modal','Pertumbuhan sedang','Keuntungan maksimal']},{q:'Jika nilai investasimu turun 20%, kamu akan?',opts:['Jual semua segera','Tunggu pemulihan','Beli lebih banyak']},{q:'Horizon investasi?',opts:['< 1 tahun','1–3 tahun','> 3 tahun']}].map((item,i)=>`
                            <div style="margin-bottom:14px;">
                                <p style="font-size:0.82rem;font-weight:700;color:#1e293b;margin-bottom:8px;">${i+1}. ${item.q}</p>
                                ${item.opts.map(o=>`<label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:6px;font-size:0.8rem;color:#475569;cursor:pointer;"><input type="radio" name="q${i}" style="accent-color:#0077C8;"> ${o}</label>`).join('')}
                            </div>`).join('')}
                            <button class="eco-inv-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;margin-top:8px;">Lihat Rekomendasi →</button>
                        </div>
                        <!-- STEP 2: Pilih Produk -->
                        <div class="eco-inv-step" style="display:none;">
                            <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:10px 14px;margin-bottom:14px;"><p style="font-size:0.78rem;color:#166534;margin:0;">✅ Profil risiko: <strong>Moderat</strong>. Rekomendasi: Reksa Dana Campuran.</p></div>
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin-bottom:12px;">Pilih Produk Reksa Dana</h3>
                            ${[{name:'BCA Dana Berencana',type:'Campuran',return:'8–12% p.a',min:'Rp 10.000',risk:'Moderat'},{name:'BCA Dana Tunai',type:'Pasar Uang',return:'4–6% p.a',min:'Rp 10.000',risk:'Rendah'},{name:'BCA Equity Fund',type:'Saham',return:'12–18% p.a',min:'Rp 100.000',risk:'Tinggi'}].map(p=>`
                            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:14px;margin-bottom:10px;background:white;cursor:pointer;" onclick="this.style.border='2px solid #0077C8';this.style.background='#F0F9FF';">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                                    <div><p style="font-weight:700;color:#003366;font-size:0.88rem;margin:0 0 2px;">${p.name}</p><p style="font-size:0.72rem;color:#64748B;margin:0;">${p.type} · Risiko ${p.risk}</p></div>
                                    <span style="background:#ECFDF5;color:#059669;font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:12px;">${p.return}</span>
                                </div>
                                <p style="font-size:0.72rem;color:#94A3B8;margin:6px 0 0;">Min. ${p.min}</p>
                            </div>`).join('')}
                            <button class="eco-inv-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;margin-top:4px;">Pilih & Lanjut →</button>
                        </div>
                        <!-- STEP 3: Konfirmasi & PIN -->
                        <div class="eco-inv-step" style="display:none;">
                            <h3 style="color:#003366;font-size:1rem;font-weight:800;margin-bottom:12px;">Konfirmasi Pembelian</h3>
                            <div style="background:#F8FAFC;border-radius:12px;padding:16px;margin-bottom:16px;">
                                ${[['Produk','BCA Dana Berencana'],['Tipe','Reksa Dana Campuran'],['Sumber Dana','Poket "makan" — IDR 2.500.000'],['Nominal','IDR 500.000'],['Pembelian Berkala','Bulanan, tgl 25']].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F1F5F9;"><span style="font-size:0.78rem;color:#64748B;">${k}</span><span style="font-size:0.78rem;font-weight:700;color:#1e293b;">${v}</span></div>`).join('')}
                            </div>
                            <div style="background:#F0F9FF;border-radius:10px;padding:12px;margin-bottom:16px;"><p style="font-size:0.78rem;color:#0369A1;margin:0;">Dengan melanjutkan, kamu menyetujui Prospektus dan Fund Fact Sheet produk ini. Investasi mengandung risiko.</p></div>
                            <p style="font-size:0.82rem;color:#64748B;margin-bottom:8px;text-align:center;">Masukkan PIN myBCA</p>
                            <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;">${Array(6).fill('<div style="width:40px;height:40px;border-radius:50%;border:2px solid #0077C8;display:flex;justify-content:center;align-items:center;font-size:1.2rem;color:#0077C8;">●</div>').join('')}</div>
                            <button class="eco-inv-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;">Konfirmasi Pembelian ✓</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        ecoBcaLife: () => `
            <div style="background:#F1F5F9;min-height:100vh;">
                <header class="blue-header" style="height:130px;align-items:flex-start;padding-top:40px;">
                    <div class="back-btn" id="btnBackFromEcoBcaLife"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
                    <h2 class="header-title">BCA Life Protection</h2>
                </header>
                <div style="margin-top:-20px;padding:0 16px;position:relative;z-index:1;">
                    <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;gap:8px;margin-bottom:16px;">${[1,2,3].map(n=>`<div style="flex:1;height:4px;border-radius:2px;background:${n<=state.ecoBcaLifeStep+1?'#0077C8':'#E2E8F0'};"></div>`).join('')}</div>
                        <!-- STEP 0: Pilih Produk -->
                        <div class="eco-life-step">
                            <div style="text-align:center;margin-bottom:16px;"><div style="font-size:2.5rem;">🛡️</div><h3 style="color:#003366;font-size:1rem;font-weight:800;margin:8px 0 4px;">Proteksi Jiwa BCA Life</h3><p style="font-size:0.78rem;color:#64748B;">Pilih produk asuransi yang sesuai kebutuhan goalmu.</p></div>
                            ${[{name:'MyGuard Basic',usp:'Tanpa medical check-up',uang:'Rp 500 Juta',premi:'Rp 14.000/bln'},{name:'MyGuard Plus',usp:'Perlindungan jiwa + kecelakaan',uang:'Rp 1 Miliar',premi:'Rp 42.000/bln'},{name:'MyGuard Premier',usp:'Jiwa + rawat inap harian',uang:'Rp 1 Miliar',premi:'Rp 89.000/bln'}].map(p=>`
                            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:14px;margin-bottom:10px;background:white;cursor:pointer;" onclick="document.querySelectorAll('.life-card').forEach(c=>c.style.border='1px solid #E2E8F0');this.style.border='2px solid #0077C8';" class="life-card">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;"><p style="font-weight:700;color:#003366;font-size:0.88rem;margin:0;">${p.name}</p><span style="background:#EEF2FF;color:#4338CA;font-size:0.68rem;font-weight:700;padding:3px 8px;border-radius:12px;">${p.premi}</span></div>
                                <p style="font-size:0.72rem;color:#64748B;margin:0 0 4px;">💎 ${p.usp}</p>
                                <p style="font-size:0.72rem;color:#0077C8;font-weight:700;margin:0;">Uang Pertanggungan hingga ${p.uang}</p>
                            </div>`).join('')}
                            <button class="eco-life-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;margin-top:8px;">Pilih Produk →</button>
                        </div>
                        <!-- STEP 1: Data Diri & Persetujuan -->
                        <div class="eco-life-step" style="display:none;">
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin-bottom:4px;">Data Pemegang Polis</h3>
                            <p style="font-size:0.75rem;color:#64748B;margin-bottom:14px;">Data diisi otomatis dari profil myBCA kamu.</p>
                            ${[['Nama Lengkap','JASMINE AZZAHRA'],['Tgl Lahir','15 Agustus 1998'],['Jenis Kelamin','Perempuan'],['No. HP','08123456789'],['Email','jasmine@email.com']].map(([k,v])=>`
                            <div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:#64748B;">${k}</label><div style="border-bottom:1.5px solid #0077C8;padding:6px 0;font-size:0.9rem;font-weight:600;color:#1e293b;">${v}</div></div>`).join('')}
                            <div style="background:#F0F9FF;border-radius:10px;padding:10px 14px;margin-top:8px;"><label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;"><input type="checkbox" checked style="accent-color:#0077C8;margin-top:2px;"><span style="font-size:0.75rem;color:#0369A1;">Saya menyetujui penggunaan data pribadi untuk penerbitan polis asuransi BCA Life.</span></label></div>
                            <button class="eco-life-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;margin-top:16px;">Konfirmasi Data →</button>
                        </div>
                        <!-- STEP 2: Bayar & PIN -->
                        <div class="eco-life-step" style="display:none;">
                            <h3 style="color:#003366;font-size:1rem;font-weight:800;margin-bottom:12px;">Konfirmasi Pembayaran Premi</h3>
                            <div style="background:#F8FAFC;border-radius:12px;padding:16px;margin-bottom:16px;">
                                ${[['Produk','MyGuard Plus'],['Uang Pertanggungan','Rp 1.000.000.000'],['Masa Pertanggungan','1 Tahun (auto-renew)'],['Premi Bulanan','Rp 42.000/bulan'],['Sumber Dana','Rekening Utama Tahapan Xpresi'],['Auto-debit','Setiap tgl 1']].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F1F5F9;"><span style="font-size:0.77rem;color:#64748B;">${k}</span><span style="font-size:0.77rem;font-weight:700;color:#1e293b;">${v}</span></div>`).join('')}
                            </div>
                            <p style="font-size:0.82rem;color:#64748B;margin-bottom:8px;text-align:center;">Masukkan PIN myBCA</p>
                            <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;">${Array(6).fill('<div style="width:40px;height:40px;border-radius:50%;border:2px solid #0077C8;display:flex;justify-content:center;align-items:center;font-size:1.2rem;color:#0077C8;">●</div>').join('')}</div>
                            <button class="eco-life-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;">Aktivasi Polis ✓</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        ecoBcaFinance: () => `
            <div style="background:#F1F5F9;min-height:100vh;">
                <header class="blue-header" style="height:130px;align-items:flex-start;padding-top:40px;">
                    <div class="back-btn" id="btnBackFromEcoBcaFinance"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
                    <h2 class="header-title">BCA Finance — KKB</h2>
                </header>
                <div style="margin-top:-20px;padding:0 16px;position:relative;z-index:1;">
                    <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;gap:8px;margin-bottom:16px;">${[1,2,3].map(n=>`<div style="flex:1;height:4px;border-radius:2px;background:${n<=state.ecoBcaFinanceStep+1?'#0077C8':'#E2E8F0'};"></div>`).join('')}</div>
                        <!-- STEP 0: Simulasi Kredit -->
                        <div class="eco-fin-step">
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin-bottom:4px;">Simulasi Kredit Kendaraan</h3>
                            <p style="font-size:0.75rem;color:#64748B;margin-bottom:14px;">Saldo poketmu bisa digunakan sebagai uang muka (DP).</p>
                            <div style="background:#ECFDF5;border:1px solid #BBF7D0;border-radius:10px;padding:10px 14px;margin-bottom:14px;"><p style="font-size:0.78rem;color:#166534;margin:0;">💡 Poket "makan" · Saldo tersedia: <strong>IDR 2.500.000</strong> → dapat digunakan sebagai bagian DP.</p></div>
                            <div style="margin-bottom:16px;"><p style="font-size:0.82rem;font-weight:700;color:#1e293b;margin-bottom:10px;">Harga Kendaraan: <strong>IDR 200.000.000</strong></p>
                                <label style="font-size:0.78rem;color:#64748B;">Uang Muka (DP)</label>
                                <input type="range" id="dpSlider" min="20000000" max="100000000" step="5000000" value="40000000" style="width:100%;accent-color:#0077C8;margin:8px 0;">
                                <div style="display:flex;justify-content:space-between;"><span style="font-size:0.75rem;color:#64748B;">IDR 20.000.000</span><span id="dpVal" style="font-size:0.82rem;font-weight:700;color:#0077C8;">IDR 40.000.000</span><span style="font-size:0.75rem;color:#64748B;">IDR 100.000.000</span></div>
                            </div>
                            <p style="font-size:0.82rem;font-weight:700;color:#1e293b;margin-bottom:10px;">Tenor Cicilan</p>
                            <div style="display:flex;gap:8px;margin-bottom:16px;">${[12,24,36,48,60].map(t=>`<button class="tenor-btn" data-tenor="${t}" style="flex:1;padding:8px 0;border-radius:8px;font-size:0.75rem;font-weight:700;border:1px solid ${t===36?'#0077C8':'#E2E8F0'};background:${t===36?'#0077C8':'white'};color:${t===36?'white':'#64748B'};cursor:pointer;">${t}bln</button>`).join('')}</div>
                            <div style="background:#F8FAFC;border-radius:12px;padding:14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;"><span style="font-size:0.82rem;color:#64748B;">Estimasi Cicilan/bln</span><span id="cicilanVal" style="font-size:1.1rem;font-weight:800;color:#0077C8;">IDR 4.580.000/bln</span></div>
                            <p style="font-size:0.68rem;color:#94A3B8;margin-bottom:14px;">*Estimasi bersifat indikatif. Termasuk bunga efektif ~8% p.a. Persetujuan tergantung analisis kredit.</p>
                            <button class="eco-fin-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;">Ajukan Kredit →</button>
                        </div>
                        <!-- STEP 1: Data & Dokumen -->
                        <div class="eco-fin-step" style="display:none;">
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin-bottom:4px;">Data Pemohon</h3>
                            <p style="font-size:0.75rem;color:#64748B;margin-bottom:14px;">Data diisi otomatis dari profil myBCA. Lengkapi dokumen pendukung.</p>
                            ${[['Nama','JASMINE AZZAHRA'],['NIK','3271234560001'],['Status Pekerjaan','Karyawan Tetap'],['Penghasilan/bln','IDR 8.000.000'],['Nama Perusahaan','PT. Maju Jaya Indonesia']].map(([k,v])=>`<div style="margin-bottom:12px;"><label style="font-size:0.75rem;color:#64748B;">${k}</label><div style="border-bottom:1.5px solid #E2E8F0;padding:6px 0;font-size:0.88rem;font-weight:600;color:#1e293b;">${v}</div></div>`).join('')}
                            <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:10px 14px;margin:12px 0;"><p style="font-size:0.75rem;color:#92400E;margin:0;"><strong>Dokumen Diperlukan:</strong><br>📎 KTP · 📎 NPWP · 📎 Slip Gaji 3 bln · 📎 Rekening Koran 3 bln</p></div>
                            <button class="eco-fin-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;margin-top:8px;">Kirim Pengajuan →</button>
                        </div>
                        <!-- STEP 2: Verifikasi OTP -->
                        <div class="eco-fin-step" style="display:none;">
                            <div style="text-align:center;padding:12px 0;">
                                <div style="font-size:3rem;margin-bottom:12px;">📱</div>
                                <h3 style="color:#003366;font-size:1rem;font-weight:800;margin-bottom:8px;">Verifikasi OTP</h3>
                                <p style="font-size:0.8rem;color:#64748B;margin-bottom:20px;">Kode OTP dikirim ke <strong>0812-XXXX-6789</strong>. Masukkan kode 6 digit untuk mengkonfirmasi pengajuan KKB.</p>
                                <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">${Array(6).fill(0).map((_,i)=>`<div style="width:42px;height:50px;border-radius:8px;border:2px solid ${i<3?'#0077C8':'#E2E8F0'};display:flex;justify-content:center;align-items:center;font-size:1.3rem;font-weight:700;color:#0077C8;">${i<3?Math.floor(Math.random()*9)+1:''}</div>`).join('')}</div>
                                <p style="font-size:0.75rem;color:#64748B;margin-bottom:20px;">Tidak menerima OTP? <span style="color:#0077C8;font-weight:700;">Kirim ulang (58s)</span></p>
                                <div style="background:#F0F9FF;border-radius:12px;padding:14px;text-align:left;margin-bottom:20px;">
                                    ${[['Kendaraan','Toyota Avanza 1.3 G'],['DP','IDR 40.000.000 (+ Poket)'],['Tenor','36 bulan'],['Cicilan','IDR 4.580.000/bln'],['Status','Menunggu Verifikasi']].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E0F2FE;"><span style="font-size:0.75rem;color:#64748B;">${k}</span><span style="font-size:0.75rem;font-weight:700;color:#1e293b;">${v}</span></div>`).join('')}
                                </div>
                                <button class="eco-fin-next" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;">Konfirmasi Pengajuan ✓</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        sharedProtection: () => `
            <div style="background:#F1F5F9;height:100%;overflow-y:auto;">
                <header class="blue-header" style="height:130px;align-items:flex-start;padding-top:40px;">
                    <div class="back-btn" id="btnBackFromSharedProt"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
                    <h2 class="header-title">Protection & Shared</h2>
                </header>
                <div style="margin-top:-20px;padding:0 16px 40px;position:relative;z-index:1;">

                    <!-- SHARED POCKETS -->
                    <div style="background:white;border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                            <div>
                                <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 2px;">👨‍👩‍👧 Shared Pocket</h3>
                                <p style="font-size:0.72rem;color:#64748B;margin:0;">Kelola keuangan keluarga bersama</p>
                            </div>
                            <div id="btnCreateSharedPocket" style="background:#0077C8;color:white;font-size:0.68rem;font-weight:700;padding:5px 12px;border-radius:16px;cursor:pointer;">+ Buat</div>
                        </div>
                        <!-- Existing shared pocket -->
                        <div style="border:1px solid #E2E8F0;border-radius:12px;padding:14px;margin-bottom:10px;">
                            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                                <div style="font-size:1.5rem;">👨‍👩‍👧</div>
                                <div style="flex:1;">
                                    <div style="font-weight:700;color:#1e293b;font-size:0.88rem;">Keluarga Santoso</div>
                                    <div style="font-size:0.7rem;color:#64748B;">3 anggota · Saldo: IDR ●●●●●</div>
                                </div>
                                <div style="font-size:0.7rem;color:#10B981;font-weight:700;">Aktif</div>
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
                                <div style="display:flex;">${['👨','👩','👧'].map((e,i) => `<div style="width:28px;height:28px;border-radius:50%;background:#E0F2FE;border:2px solid white;display:flex;justify-content:center;align-items:center;font-size:0.85rem;margin-left:${i>0?'-8px':'0'};">${e}</div>`).join('')}</div>
                                <div style="font-size:0.7rem;color:#64748B;">Ayah · Ibu · Siti</div>
                                <div class="sp-invite-btn" style="margin-left:auto;font-size:0.68rem;color:#0077C8;font-weight:700;border:1px solid #0077C8;border-radius:10px;padding:3px 10px;cursor:pointer;">+ Undang</div>
                            </div>
                            <div style="font-size:0.7rem;color:#64748B;margin-bottom:4px;">Kontribusi bulan ini</div>
                            <div style="height:8px;background:#E2E8F0;border-radius:4px;overflow:hidden;display:flex;">
                                <div style="width:50%;background:#0077C8;"></div>
                                <div style="width:30%;background:#00A3E0;"></div>
                                <div style="width:20%;background:#BAE6FD;"></div>
                            </div>
                            <div style="display:flex;gap:10px;margin-top:6px;">
                                <div style="display:flex;align-items:center;gap:4px;"><div style="width:8px;height:8px;border-radius:2px;background:#0077C8;"></div><span style="font-size:0.65rem;color:#64748B;">Ayah 50%</span></div>
                                <div style="display:flex;align-items:center;gap:4px;"><div style="width:8px;height:8px;border-radius:2px;background:#00A3E0;"></div><span style="font-size:0.65rem;color:#64748B;">Ibu 30%</span></div>
                                <div style="display:flex;align-items:center;gap:4px;"><div style="width:8px;height:8px;border-radius:2px;background:#BAE6FD;"></div><span style="font-size:0.65rem;color:#64748B;">Siti 20%</span></div>
                            </div>
                        </div>
                        <div id="btnCreateSharedPocket2" style="border:1.5px dashed #CBD5E1;border-radius:12px;padding:14px;text-align:center;cursor:pointer;">
                            <div style="font-size:1.5rem;margin-bottom:4px;">➕</div>
                            <div style="font-size:0.78rem;color:#64748B;font-weight:600;">Buat Shared Pocket baru</div>
                            <div style="font-size:0.68rem;color:#94A3B8;margin-top:2px;">Undang pasangan, orang tua, atau anak</div>
                        </div>
                    </div>

                    <!-- PROACTIVE PROTECTION RECOMMENDATIONS -->
                    <div style="background:white;border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                            <div>
                                <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 2px;">🛡️ Rekomendasi Proteksi</h3>
                                <p style="font-size:0.72rem;color:#64748B;margin:0;">Berdasarkan profil & life stage kamu</p>
                            </div>
                        </div>
                        <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:12px;margin-bottom:12px;display:flex;gap:10px;align-items:flex-start;">
                            <div style="font-size:1.2rem;flex-shrink:0;">⚠️</div>
                            <div>
                                <div style="font-weight:700;font-size:0.8rem;color:#92400E;margin-bottom:2px;">Protection Gap Terdeteksi</div>
                                <div style="font-size:0.72rem;color:#B45309;line-height:1.4;">Kamu belum memiliki asuransi jiwa. Sebagai Young Professional, proteksi sangat penting untuk melindungi tabungan & keluargamu.</div>
                            </div>
                        </div>
                        ${[{icon:'🛡️',product:'BCA Life MyGuard Basic',benefit:'Uang Pertanggungan Rp 500 Jt',premi:'Rp 42.000/bln',tag:'Prioritas',tagColor:'#EF4444',screen:'ecoBcaLife'},{icon:'🏥',product:'BCA Life Hospital Care',benefit:'Rawat Inap hingga Rp 1 Jt/hari',premi:'Rp 89.000/bln',tag:'Direkomendasikan',tagColor:'#0077C8',screen:'ecoBcaLife'},{icon:'📈',product:'BCA Sekuritas + Proteksi',benefit:'Investasi sekaligus dilindungi',premi:'Rp 200.000/bln',tag:'Populer',tagColor:'#10B981',screen:'ecoInvestasi'}].map(p => `
                        <div class="sp-prot-card" data-screen="${p.screen}" style="border:1px solid #F1F5F9;border-radius:12px;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:center;cursor:pointer;">
                            <div style="width:40px;height:40px;border-radius:10px;background:#EEF2FF;display:flex;justify-content:center;align-items:center;font-size:1.2rem;flex-shrink:0;">${p.icon}</div>
                            <div style="flex:1;">
                                <div style="font-weight:700;color:#1e293b;font-size:0.82rem;margin-bottom:2px;">${p.product}</div>
                                <div style="font-size:0.7rem;color:#64748B;margin-bottom:4px;">${p.benefit}</div>
                                <div style="font-size:0.72rem;font-weight:700;color:#0077C8;">${p.premi}</div>
                            </div>
                            <div>
                                <div style="background:${p.tagColor}1A;color:${p.tagColor};font-size:0.62rem;font-weight:700;padding:3px 8px;border-radius:8px;white-space:nowrap;margin-bottom:6px;">${p.tag}</div>
                                <div style="font-size:0.68rem;color:#0077C8;text-align:right;">Pilih ›</div>
                            </div>
                        </div>`).join('')}
                    </div>

                    <!-- REAL-TIME FINANCIAL ALERTS -->
                    <div style="background:white;border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                            <div>
                                <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 2px;">🔔 Alert Keuangan Real-Time</h3>
                                <p style="font-size:0.72rem;color:#64748B;margin:0;">Notifikasi proaktif berdasarkan aktivitas</p>
                            </div>
                            <div style="font-size:0.68rem;color:#0077C8;font-weight:700;">Atur ›</div>
                        </div>
                        ${[{icon:'🚨',color:'#FEF2F2',border:'#FECACA',text:'Saldo Poket Dana Darurat di bawah 30% target',time:'2 mnt lalu'},{icon:'💸',color:'#FFF7ED',border:'#FED7AA',text:'Pengeluaran F&B minggu ini sudah 80% budget (Rp 320K)',time:'1 jam lalu'},{icon:'✅',color:'#F0FDF4',border:'#BBF7D0',text:'Auto-debit Dana Darurat Rp 1.600.000 berhasil',time:'Kemarin'},{icon:'👨‍👩‍👧',color:'#F0F9FF',border:'#BAE6FD',text:'Ibu menambahkan Rp 500.000 ke Shared Pocket Keluarga',time:'2 hari lalu'}].map(a => `
                        <div style="background:${a.color};border:1px solid ${a.border};border-radius:10px;padding:12px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;">
                            <div style="font-size:1.1rem;flex-shrink:0;margin-top:1px;">${a.icon}</div>
                            <div style="flex:1;"><div style="font-size:0.78rem;color:#1e293b;font-weight:600;line-height:1.4;margin-bottom:2px;">${a.text}</div><div style="font-size:0.65rem;color:#94A3B8;">${a.time}</div></div>
                        </div>`).join('')}
                        <div style="border-top:1px solid #F1F5F9;margin-top:14px;padding-top:14px;">
                            <div style="font-size:0.72rem;color:#64748B;font-weight:700;margin-bottom:10px;">Aktifkan Alert:</div>
                            ${[['Saldo mendekati batas minimum','spAlertBalance',true],['Aktivitas Shared Pocket','spAlertShared',true],['Rekomendasi proteksi baru','spAlertProt',false]].map(([label,id,on]) => `
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <span style="font-size:0.78rem;color:#475569;">${label}</span>
                                <div class="sp-alert-toggle" data-id="${id}" style="width:40px;height:22px;border-radius:11px;background:${on ? '#0077C8' : '#E2E8F0'};position:relative;cursor:pointer;transition:background 0.2s;">
                                    <div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;${on ? 'right:2px' : 'left:2px'};transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                                </div>
                            </div>`).join('')}
                        </div>
                    </div>

                    <!-- FAMILY DASHBOARD -->
                    <div style="background:linear-gradient(135deg,#0F172A,#1E3A5F);border-radius:16px;padding:18px;">
                        <h4 style="color:#7DD3FC;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;">📊 Family Dashboard</h4>
                        ${[['Total Aset Keluarga','IDR ●●●●●●●','↑ +3.2% bulan ini'],['Total Pengeluaran','IDR ●●●●●','80% dari budget'],['Shared Pocket','IDR ●●●●','3 anggota aktif'],['Proteksi Aktif','Belum ada','⚠️ Segera aktifkan']].map(([label,val,sub]) => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                            <span style="font-size:0.78rem;color:#94A3B8;">${label}</span>
                            <div style="text-align:right;"><div style="font-size:0.82rem;font-weight:700;color:white;">${val}</div><div style="font-size:0.65rem;color:#64748B;">${sub}</div></div>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
        `,
        goalEngine: () => `
            <div style="background:#F1F5F9;height:100%;overflow-y:auto;">
                <header class="blue-header" style="background:linear-gradient(135deg,#7C3AED,#4F46E5);height:130px;align-items:flex-start;padding-top:40px;">
                    <div class="back-btn" id="btnBackFromGoalEngine"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
                    <h2 class="header-title">Goal Engine</h2>
                </header>
                <div style="margin-top:-20px;padding:0 16px 40px;position:relative;z-index:1;">
                    <!-- Smart Allocation -->
                    <div style="background:white;border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                            <div>
                                <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 2px;">Smart Allocation</h3>
                                <p style="font-size:0.72rem;color:#64748B;margin:0;">Need vs Want vs Savings</p>
                            </div>
                            <div style="background:#7C3AED;color:white;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:10px;">AI Optimized</div>
                        </div>
                        <div style="height:16px;border-radius:8px;overflow:hidden;display:flex;margin-bottom:12px;">
                            <div id="ge-bar-needs" style="width:${state.goalEngine.needs}%;background:#0077C8;transition:width 0.3s;"></div>
                            <div id="ge-bar-wants" style="width:${state.goalEngine.wants}%;background:#8B5CF6;transition:width 0.3s;"></div>
                            <div id="ge-bar-savings" style="flex:1;background:#10B981;transition:width 0.3s;"></div>
                        </div>
                        <div style="display:flex;gap:12px;margin-bottom:16px;">
                            <div style="display:flex;align-items:center;gap:5px;"><div style="width:10px;height:10px;border-radius:2px;background:#0077C8;"></div><span style="font-size:0.72rem;color:#475569;">Kebutuhan <strong id="ge-needs-lbl">${state.goalEngine.needs}%</strong></span></div>
                            <div style="display:flex;align-items:center;gap:5px;"><div style="width:10px;height:10px;border-radius:2px;background:#8B5CF6;"></div><span style="font-size:0.72rem;color:#475569;">Keinginan <strong id="ge-wants-lbl">${state.goalEngine.wants}%</strong></span></div>
                            <div style="display:flex;align-items:center;gap:5px;"><div style="width:10px;height:10px;border-radius:2px;background:#10B981;"></div><span style="font-size:0.72rem;color:#475569;">Tabungan <strong id="ge-savings-lbl">${state.goalEngine.savings}%</strong></span></div>
                        </div>
                        <div style="margin-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.73rem;color:#64748B;margin-bottom:4px;"><span>Kebutuhan</span><span id="ge-needs-val">${state.goalEngine.needs}%</span></div>
                            <input id="ge-needs" type="range" min="30" max="70" value="${state.goalEngine.needs}" style="width:100%;accent-color:#0077C8;">
                        </div>
                        <div style="margin-bottom:14px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.73rem;color:#64748B;margin-bottom:4px;"><span>Keinginan</span><span id="ge-wants-val">${state.goalEngine.wants}%</span></div>
                            <input id="ge-wants" type="range" min="10" max="50" value="${state.goalEngine.wants}" style="width:100%;accent-color:#8B5CF6;">
                        </div>
                        <div style="background:#F0FDF4;border-radius:8px;padding:10px;font-size:0.75rem;color:#065F46;display:flex;align-items:center;gap:8px;">
                            <span>💡</span> Tabungan otomatis: <strong id="ge-savings-disp">${state.goalEngine.savings}%</strong> = <strong id="ge-savings-amt">IDR ${(state.goalEngine.income * state.goalEngine.savings / 100).toLocaleString('id-ID')}/bln</strong>
                        </div>
                    </div>
                    <!-- Goal Templates -->
                    <div style="background:white;border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 4px;">Template Poket Otomatis</h3>
                        <p style="font-size:0.72rem;color:#64748B;margin:0 0 14px;">Pilih goal, AI buat poket + rencana nabung langsung.</p>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                            ${state.goalEngine.templates.map(t => `
                            <div class="ge-template-card" data-name="${t.name}" style="background:${t.color};border:1px solid ${t.border};border-radius:12px;padding:14px;cursor:pointer;">
                                <div style="font-size:1.6rem;margin-bottom:6px;">${t.icon}</div>
                                <div style="font-weight:700;font-size:0.82rem;color:#1e293b;margin-bottom:2px;">${t.name}</div>
                                <div style="font-size:0.68rem;color:#64748B;margin-bottom:6px;">${t.desc}</div>
                                <div style="font-size:0.7rem;font-weight:700;color:#0077C8;">IDR ${(t.amount/1000000).toFixed(0)} Jt</div>
                            </div>`).join('')}
                        </div>
                    </div>
                    <!-- Optimized Allocation Plan -->
                    <div style="background:white;border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0;">Rencana Alokasi Optimal</h3>
                            <div style="font-size:0.68rem;color:#7C3AED;font-weight:700;">⚡ Linear Program</div>
                        </div>
                        <div style="background:#F5F3FF;border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:0.75rem;color:#5B21B6;">
                            🤖 AI menghitung alokasi optimal dari gaji <strong>IDR 8.000.000</strong> berdasarkan prioritas goal & perilaku belanjamu.
                        </div>
                        ${state.goalEngine.optimizedAlloc.map((a, i) => `
                        <div style="border:1px solid #F1F5F9;border-radius:12px;padding:14px;margin-bottom:10px;">
                            <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:#F0F9FF;display:flex;justify-content:center;align-items:center;font-size:1.1rem;flex-shrink:0;">${a.icon}</div>
                                <div style="flex:1;">
                                    <div style="font-weight:700;color:#1e293b;font-size:0.85rem;margin-bottom:1px;">${a.pocket}</div>
                                    <div style="font-size:0.68rem;color:#64748B;">Prioritas #${a.priority} · Target IDR ${(a.target/1000000).toFixed(0)}Jt · ETA ${a.eta}</div>
                                </div>
                                <div style="text-align:right;flex-shrink:0;">
                                    <div style="font-size:0.8rem;font-weight:800;color:#7C3AED;">Rp ${(a.monthly/1000).toFixed(0)}K</div>
                                    <div style="font-size:0.62rem;color:#94A3B8;">/bulan</div>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <div style="flex:1;height:6px;background:#E2E8F0;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${a.progress}%;background:${a.color};border-radius:3px;"></div></div>
                                <span style="font-size:0.65rem;color:#64748B;font-weight:700;">${a.progress}%</span>
                            </div>
                        </div>`).join('')}
                        <button id="btnApplyGoalPlan" style="width:100%;background:linear-gradient(135deg,#7C3AED,#4F46E5);color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;margin-top:4px;">⚡ Terapkan Rencana Ini</button>
                    </div>
                    <!-- Rules Engine -->
                    <div style="background:linear-gradient(135deg,#0F172A,#1E3A5F);border-radius:16px;padding:18px;">
                        <h4 style="color:#7DD3FC;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;">⚙️ Rules Engine & Optimisasi</h4>
                        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;"><div style="font-size:1.1rem;flex-shrink:0;">📊</div><div><div style="font-weight:700;color:white;font-size:0.8rem;margin-bottom:2px;">Analisis Perilaku</div><div style="font-size:0.72rem;color:#94A3B8;line-height:1.4;">Pola belanja & tabungan 3 bulan terakhir dianalisis secara real-time.</div></div></div>
                        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;"><div style="font-size:1.1rem;flex-shrink:0;">🎯</div><div><div style="font-weight:700;color:white;font-size:0.8rem;margin-bottom:2px;">Prioritas Goal</div><div style="font-size:0.72rem;color:#94A3B8;line-height:1.4;">Dana Darurat selalu di prioritas #1 sebelum investasi dimulai.</div></div></div>
                        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;"><div style="font-size:1.1rem;flex-shrink:0;">🔄</div><div><div style="font-weight:700;color:white;font-size:0.8rem;margin-bottom:2px;">Auto-Adjust Bulanan</div><div style="font-size:0.72rem;color:#94A3B8;line-height:1.4;">Alokasi disesuaikan otomatis jika ada perubahan gaji atau pengeluaran besar.</div></div></div>
                        <div style="display:flex;gap:12px;align-items:flex-start;"><div style="font-size:1.1rem;flex-shrink:0;">📈</div><div><div style="font-weight:700;color:white;font-size:0.8rem;margin-bottom:2px;">Integrasi Bertahap ke Investasi</div><div style="font-size:0.72rem;color:#94A3B8;line-height:1.4;">Setelah Dana Darurat 100%, surplus dialihkan ke BCA Sekuritas secara otomatis.</div></div></div>
                    </div>
                </div>
            </div>
        `,
        lifeStageDetail: () => `
            <div style="background:#0F172A;min-height:100%;overflow-y:auto;">
                <header style="background:transparent;padding:40px 20px 20px;display:flex;align-items:center;gap:16px;position:relative;">
                    <div class="back-btn" id="btnBackFromLifeStage" style="background:rgba(255,255,255,0.1);border-radius:50%;width:36px;height:36px;display:flex;justify-content:center;align-items:center;flex-shrink:0;cursor:pointer;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </div>
                    <div>
                        <div style="font-size:0.65rem;color:#7DD3FC;font-weight:700;letter-spacing:1px;text-transform:uppercase;">✨ AI Life-Stage Detection</div>
                        <h2 style="color:white;font-size:1.1rem;font-weight:800;margin:2px 0 0;">Profil Keuanganmu</h2>
                    </div>
                </header>

                <div style="padding:0 16px 40px;">
                    <!-- Life Stage Hero -->
                    <div style="background:linear-gradient(135deg,rgba(0,119,200,0.3),rgba(0,163,224,0.1));border:1px solid rgba(0,163,224,0.2);border-radius:20px;padding:24px;margin-bottom:20px;text-align:center;">
                        <div style="font-size:4rem;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.4));">${state.lifeStage.icon}</div>
                        <h3 style="color:white;font-size:1.5rem;font-weight:800;margin:0 0 4px;">${state.lifeStage.detected}</h3>
                        <div style="display:inline-flex;align-items:center;gap:6px;background:#10B981;border-radius:20px;padding:4px 14px;margin-bottom:16px;">
                            <div style="width:6px;height:6px;border-radius:50%;background:white;animation:pulse 1.5s infinite;"></div>
                            <span style="font-size:0.72rem;font-weight:700;color:white;">AI Confidence: ${state.lifeStage.confidence}%</span>
                        </div>
                        <!-- Confidence bar -->
                        <div style="background:rgba(255,255,255,0.1);border-radius:4px;height:6px;overflow:hidden;">
                            <div style="height:100%;width:${state.lifeStage.confidence}%;background:linear-gradient(90deg,#10B981,#34D399);border-radius:4px;"></div>
                        </div>
                    </div>

                    <!-- Life Stage Timeline -->
                    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;margin-bottom:20px;">
                        <h4 style="color:#94A3B8;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;">Perjalanan Life Stage</h4>
                        <div style="display:flex;gap:0;">
                            ${state.lifeStage.stages.map((s, i) => `
                            <div style="flex:1;text-align:center;position:relative;">
                                ${i < state.lifeStage.stages.length - 1 ? `<div style="position:absolute;top:18px;left:50%;width:100%;height:2px;background:${s.active || state.lifeStage.stages[i+1]?.active ? 'rgba(0,163,224,0.4)' : 'rgba(255,255,255,0.1)'};z-index:0;"></div>` : ''}
                                <div style="width:36px;height:36px;border-radius:50%;background:${s.active ? '#0077C8' : 'rgba(255,255,255,0.08)'};border:2px solid ${s.active ? '#00A3E0' : 'rgba(255,255,255,0.1)'};display:flex;justify-content:center;align-items:center;font-size:1rem;margin:0 auto 6px;position:relative;z-index:1;">${s.icon}</div>
                                <div style="font-size:0.55rem;color:${s.active ? '#7DD3FC' : 'rgba(255,255,255,0.35)'};font-weight:${s.active ? '700' : '400'};line-height:1.3;">${s.label}</div>
                            </div>`).join('')}
                        </div>
                    </div>

                    <!-- AI Signals -->
                    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;margin-bottom:20px;">
                        <h4 style="color:#94A3B8;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">📊 Sinyal AI yang Terdeteksi</h4>
                        ${state.lifeStage.signals.map(sig => `
                        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                            <div style="width:6px;height:6px;border-radius:50%;background:#00A3E0;flex-shrink:0;"></div>
                            <span style="font-size:0.8rem;color:#CBD5E1;">${sig}</span>
                        </div>`).join('')}
                    </div>

                    <!-- Personalized Insight -->
                    <div style="background:linear-gradient(135deg,rgba(0,119,200,0.2),rgba(0,163,224,0.05));border:1px solid rgba(0,163,224,0.2);border-radius:16px;padding:18px;margin-bottom:20px;">
                        <div style="display:flex;gap:10px;align-items:flex-start;">
                            <div style="font-size:1.5rem;flex-shrink:0;">🤖</div>
                            <div>
                                <h4 style="color:#7DD3FC;font-size:0.78rem;font-weight:700;margin:0 0 8px;">Insight Keuangan Untukmu</h4>
                                <p style="font-size:0.82rem;color:#CBD5E1;line-height:1.6;margin:0;">${state.lifeStage.insight}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Next-Best Actions -->
                    <h4 style="color:#94A3B8;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">🎯 Next-Best Actions</h4>
                    ${state.lifeStage.nextActions.map(a => `
                    <div class="life-stage-action" data-screen="${a.screen}" style="background:${a.urgent ? 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))' : 'rgba(255,255,255,0.04)'};border:1px solid ${a.urgent ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'};border-radius:16px;padding:16px;margin-bottom:12px;cursor:pointer;display:flex;gap:14px;align-items:center;">
                        <div style="width:48px;height:48px;border-radius:14px;background:${a.urgent ? 'rgba(239,68,68,0.2)' : 'rgba(0,119,200,0.2)'};display:flex;justify-content:center;align-items:center;font-size:1.5rem;flex-shrink:0;">${a.icon}</div>
                        <div style="flex:1;">
                            <div style="font-weight:700;color:white;font-size:0.9rem;margin-bottom:3px;">${a.title}${a.urgent ? ' <span style="background:#EF4444;font-size:0.6rem;padding:1px 6px;border-radius:8px;font-weight:700;vertical-align:middle;">PRIORITAS</span>' : ''}</div>
                            <div style="font-size:0.72rem;color:#94A3B8;line-height:1.4;">${a.desc}</div>
                        </div>
                        <div style="background:rgba(0,163,224,0.2);border:1px solid rgba(0,163,224,0.3);border-radius:10px;padding:6px 12px;font-size:0.72rem;font-weight:700;color:#7DD3FC;white-space:nowrap;">${a.cta} ›</div>
                    </div>`).join('')}
                </div>
            </div>
        `,
        ecoConnect: () => `
            <div style="background:#F1F5F9;min-height:100vh;">
                <header class="blue-header" style="height:130px;align-items:flex-start;padding-top:40px;">
                    <div class="back-btn" id="btnBackFromEcoConnect"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
                    <h2 class="header-title">Hubungkan Produk BCA</h2>
                </header>
                <div style="margin-top:-20px;padding:0 16px;position:relative;z-index:1;padding-bottom:40px;">

                    <!-- Step 1: Pilih produk existing -->
                    <div id="ecoConnectStep0">
                        <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 4px;">Produk BCA Aktif Kamu</h3>
                            <p style="font-size:0.75rem;color:#64748B;margin:0 0 16px;">Pilih produk yang ingin dihubungkan ke poket untuk auto-debit otomatis.</p>
                            ${state.existingBcaProducts.map(prod => {
                                const linked = state.connectedLinks.find(l => l.productId === prod.id);
                                return `
                                <div class="eco-connect-card" data-product-id="${prod.id}" style="border:${linked ? '2px solid #10B981' : '1px solid #E2E8F0'};border-radius:12px;padding:14px;margin-bottom:10px;background:${linked ? '#F0FDF4' : 'white'};cursor:pointer;display:flex;gap:14px;align-items:center;">
                                    <div style="width:44px;height:44px;border-radius:12px;background:${linked ? '#DCFCE7' : '#F0F9FF'};display:flex;justify-content:center;align-items:center;font-size:1.4rem;flex-shrink:0;">${prod.icon}</div>
                                    <div style="flex:1;">
                                        <div style="font-weight:700;color:#003366;font-size:0.88rem;margin-bottom:3px;">${prod.name}</div>
                                        <div style="font-size:0.72rem;color:#64748B;">${prod.detail}</div>
                                        ${linked ? `<div style="font-size:0.7rem;color:#10B981;font-weight:700;margin-top:4px;">✅ Sudah terhubung ke Poket "makan"</div>` : `<div style="font-size:0.7rem;color:#0077C8;font-weight:600;margin-top:4px;">Auto-debit tgl ${prod.dueDate} setiap bulan</div>`}
                                    </div>
                                    <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${linked ? '#10B981' : '#E2E8F0'};background:${linked ? '#10B981' : 'white'};display:flex;justify-content:center;align-items:center;flex-shrink:0;">
                                        ${linked ? '<span style="color:white;font-size:0.75rem;">✓</span>' : ''}
                                    </div>
                                </div>`;
                            }).join('')}

                            <div style="border-top:1px solid #F1F5F9;margin-top:16px;padding-top:16px;">
                                <p style="font-size:0.78rem;color:#64748B;margin:0 0 10px;">Belum punya produk yang kamu cari?</p>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                    <div class="eco-browse-new" data-type="investasi" style="padding:8px 14px;border-radius:20px;border:1px solid #E2E8F0;background:white;font-size:0.75rem;font-weight:600;color:#0077C8;cursor:pointer;">📈 Buka Investasi</div>
                                    <div class="eco-browse-new" data-type="life" style="padding:8px 14px;border-radius:20px;border:1px solid #E2E8F0;background:white;font-size:0.75rem;font-weight:600;color:#0077C8;cursor:pointer;">🛡️ Beli Asuransi</div>
                                    <div class="eco-browse-new" data-type="finance" style="padding:8px 14px;border-radius:20px;border:1px solid #E2E8F0;background:white;font-size:0.75rem;font-weight:600;color:#0077C8;cursor:pointer;">🚗 Ajukan KKB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Pilih Poket (shown after selecting a product) -->
                    <div id="ecoConnectStep1" style="display:none;">
                        <div style="background:white;border-radius:16px;padding:16px 20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                            <div id="ecoConnectSelectedBanner" style="background:#F0F9FF;border-radius:10px;padding:10px 14px;margin-bottom:16px;display:flex;gap:12px;align-items:center;"></div>
                            <h3 style="color:#003366;font-size:0.95rem;font-weight:800;margin:0 0 4px;">Pilih Poket Sumber Dana</h3>
                            <p style="font-size:0.75rem;color:#64748B;margin:0 0 14px;">Cicilan/premi akan didebet otomatis dari poket yang dipilih setiap bulannya.</p>
                            ${state.pockets.map(p => `
                            <div class="eco-pocket-select" data-pocket-id="${p.id}" style="border:1px solid #E2E8F0;border-radius:12px;padding:14px;margin-bottom:10px;background:white;cursor:pointer;display:flex;gap:14px;align-items:center;">
                                <div style="width:44px;height:44px;border-radius:12px;background:#F0F9FF;display:flex;justify-content:center;align-items:center;font-size:1.4rem;flex-shrink:0;">${p.type === 'emergency' ? '🚨' : p.type === 'shared' ? '👨‍👩‍👧' : '🚗'}</div>
                                <div style="flex:1;">
                                    <div style="font-weight:700;color:#003366;font-size:0.88rem;margin-bottom:2px;">${p.name}</div>
                                    <div style="font-size:0.72rem;color:#64748B;">Saldo: IDR ${p.balance}</div>
                                    <div style="height:4px;background:#E2E8F0;border-radius:2px;margin-top:6px;overflow:hidden;"><div style="height:100%;width:${p.progress}%;background:#0077C8;border-radius:2px;"></div></div>
                                </div>
                                <div style="font-size:0.7rem;color:#64748B;">${p.progress}%</div>
                            </div>`).join('')}
                            <div class="eco-pocket-select" data-pocket-id="new" style="border:1.5px dashed #0077C8;border-radius:12px;padding:14px;margin-bottom:10px;background:#F8FAFF;cursor:pointer;display:flex;gap:14px;align-items:center;">
                                <div style="width:44px;height:44px;border-radius:12px;background:#EFF6FF;display:flex;justify-content:center;align-items:center;font-size:1.4rem;flex-shrink:0;">➕</div>
                                <div style="flex:1;"><div style="font-weight:700;color:#0077C8;font-size:0.88rem;">Buat Poket Baru</div><div style="font-size:0.72rem;color:#64748B;">Buat poket khusus untuk produk ini</div></div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Konfirmasi -->
                    <div id="ecoConnectStep2" style="display:none;">
                        <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                            <div style="text-align:center;margin-bottom:20px;">
                                <div style="font-size:3rem;margin-bottom:8px;">🔗</div>
                                <h3 style="color:#003366;font-size:1rem;font-weight:800;margin-bottom:4px;">Konfirmasi Koneksi</h3>
                                <p style="font-size:0.78rem;color:#64748B;">Periksa detail sebelum mengaktifkan auto-debit.</p>
                            </div>
                            <div id="ecoConnectSummary" style="background:#F8FAFC;border-radius:12px;padding:16px;margin-bottom:16px;"></div>
                            <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:12px;margin-bottom:16px;">
                                <p style="font-size:0.75rem;color:#92400E;margin:0;">⚠️ Pastikan saldo poket mencukupi setiap tanggal jatuh tempo untuk menghindari gagal bayar.</p>
                            </div>
                            <p style="font-size:0.82rem;color:#64748B;margin-bottom:8px;text-align:center;">Masukkan PIN myBCA</p>
                            <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">${Array(6).fill('<div style="width:40px;height:40px;border-radius:50%;border:2px solid #0077C8;display:flex;justify-content:center;align-items:center;font-size:1.2rem;color:#0077C8;">●</div>').join('')}</div>
                            <button id="btnConfirmEcoConnect" style="width:100%;background:#0077C8;color:white;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:0.95rem;cursor:pointer;">Aktifkan Auto-Debit ✓</button>
                        </div>
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
            <div class="pocket-detail-screen" style="background: #F1F5F9; height: 100%; overflow-y: auto; overflow-x: hidden; padding-bottom: 40px;">
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
                    
                    <!-- BCA Ecosystem Integration Layer -->
                    <div class="ecosystem-integration-layer" style="margin-bottom: 32px;">
                        <h3 class="pd-section-title" style="margin-bottom: 12px;">ECOSYSTEM RECOMMENDATIONS</h3>
                        
                        <div style="background: white; border-radius: 16px; border: 1px solid #F1F5F9; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
                            <!-- Investasi — BCA Sekuritas -->
                            <div class="eco-action-item" data-action="investasi" style="padding: 16px; border-bottom: 1px solid #F1F5F9; display: flex; gap: 16px; align-items: center; cursor: pointer;">
                                <div style="width: 44px; height: 44px; background: #ECFDF5; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; flex-shrink: 0;">📈</div>
                                <div style="flex: 1;">
                                    <h4 style="font-size: 0.9rem; color: #003366; font-weight: 800; margin: 0; margin-bottom: 3px;">BCA Sekuritas</h4>
                                    <p style="font-size: 0.73rem; color: #64748B; margin: 0; line-height: 1.4;">Grow savings faster with Reksa Dana & Obligasi. Move pocket funds to BCA Sekuritas seamlessly.</p>
                                </div>
                                <span style="color: #0077C8; font-weight: 800;">›</span>
                            </div>
                            
                            <!-- BCA Life -->
                            <div class="eco-action-item" data-action="life" style="padding: 16px; border-bottom: 1px solid #F1F5F9; display: flex; gap: 16px; align-items: center; cursor: pointer;">
                                <div style="width: 44px; height: 44px; background: #EEF2FF; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; flex-shrink: 0;">🛡️</div>
                                <div style="flex: 1;">
                                    <h4 style="font-size: 0.9rem; color: #003366; font-weight: 800; margin: 0; margin-bottom: 3px;">BCA Life</h4>
                                    <p style="font-size: 0.73rem; color: #64748B; margin: 0; line-height: 1.4;">Secure your goal. Get life protection coverage tailored to your IDR 50.000.000 target.</p>
                                </div>
                                <span style="color: #0077C8; font-weight: 800;">›</span>
                            </div>
                            
                            <!-- BCA Finance -->
                            <div class="eco-action-item" data-action="finance" style="padding: 16px; display: flex; gap: 16px; align-items: center; cursor: pointer;">
                                <div style="width: 44px; height: 44px; background: #FFF7ED; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.4rem; flex-shrink: 0;">🚗</div>
                                <div style="flex: 1;">
                                    <h4 style="font-size: 0.9rem; color: #003366; font-weight: 800; margin: 0; margin-bottom: 3px;">BCA Finance</h4>
                                    <p style="font-size: 0.73rem; color: #64748B; margin: 0; line-height: 1.4;">Use this pocket's balance as a down payment. Get pre-approved BCA Finance credit.</p>
                                </div>
                                <span style="color: #0077C8; font-weight: 800;">›</span>
                            </div>
                        </div>
                    </div>

                    <!-- LINKED PRODUCTS (existing BCA products auto-pay) -->
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 class="pd-section-title" style="margin: 0;">PRODUK TERHUBUNG</h3>
                            <div class="eco-link-add-btn" style="background: #0077C8; color: white; font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 16px; cursor: pointer;">+ Hubungkan</div>
                        </div>

                        ${state.connectedLinks.length === 0 ? `
                        <div style="background: white; border-radius: 12px; border: 1.5px dashed #CBD5E1; padding: 20px; text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 8px;">🔗</div>
                            <p style="font-size: 0.8rem; color: #64748B; margin: 0 0 12px;">Belum ada produk BCA yang terhubung ke poket ini.</p>
                            <div class="eco-link-add-btn" style="display: inline-block; background: #0077C8; color: white; font-size: 0.78rem; font-weight: 700; padding: 8px 20px; border-radius: 20px; cursor: pointer;">Hubungkan Produk BCA</div>
                        </div>` : `
                        <div style="background: white; border-radius: 16px; border: 1px solid #F1F5F9; overflow: hidden;">
                            ${state.connectedLinks.map((link, i) => {
                                const prod = state.existingBcaProducts.find(p => p.id === link.productId);
                                return prod ? `
                                <div style="padding: 14px 16px; ${i < state.connectedLinks.length - 1 ? 'border-bottom: 1px solid #F1F5F9;' : ''} display: flex; gap: 14px; align-items: center;">
                                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #F0F9FF; display: flex; justify-content: center; align-items: center; font-size: 1.3rem; flex-shrink: 0;">${prod.icon}</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 700; font-size: 0.85rem; color: #003366; margin-bottom: 2px;">${prod.name}</div>
                                        <div style="font-size: 0.72rem; color: #64748B;">${prod.detail}</div>
                                        <div style="font-size: 0.7rem; color: #10B981; font-weight: 700; margin-top: 3px;">✅ Auto-debit tiap tgl ${prod.dueDate}</div>
                                    </div>
                                    <div class="eco-unlink-btn" data-link-id="${link.productId}" style="font-size: 0.68rem; color: #EF4444; border: 1px solid #FCA5A5; border-radius: 10px; padding: 4px 8px; cursor: pointer; white-space: nowrap;">Putus</div>
                                </div>` : '';
                            }).join('')}
                        </div>`}
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
            if (btnQris) btnQris.onclick = () => {
                state.selectedQrisPocketId = null;
                navigateTo('qrisSelection');
            };

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

            // Life Stage Card
            const lifeCard = document.getElementById('lifeStageCard');
            if (lifeCard) lifeCard.onclick = () => navigateTo('lifeStageDetail');

            // Goal Engine Card
            const geCard = document.getElementById('goalEngineCard');
            if (geCard) geCard.onclick = () => navigateTo('goalEngine');

            const qrisBadges = document.querySelectorAll('.qris-shortcut-badge');
            qrisBadges.forEach(badge => {
                badge.onclick = (e) => {
                    e.stopPropagation();
                    state.selectedQrisPocketId = parseInt(badge.getAttribute('data-pocket-id'));
                    navigateTo('qrisSelection');
                };
            });

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
                    const ecoType = pill.getAttribute('data-eco');
                    if (ecoType === 'QRIS') {
                        // QRIS just toggles — it's a simple setting
                        const isActive = pill.classList.contains('active');
                        if (!isActive) {
                            pill.classList.add('active');
                            pill.style.background = '#0077C8'; pill.style.color = 'white'; pill.style.border = '1px solid #0077C8';
                            showToast('✅ QRIS & Auto-Pay aktif untuk poket ini');
                        } else {
                            pill.classList.remove('active');
                            pill.style.background = 'white'; pill.style.color = '#64748B'; pill.style.border = '1px solid #E2E8F0';
                        }
                    } else if (ecoType === 'Investasi') {
                        state.ecoInvestasiStep = 0;
                        navigateTo('ecoInvestasi');
                    } else if (ecoType === 'BCALife') {
                        state.ecoBcaLifeStep = 0;
                        navigateTo('ecoBcaLife');
                    } else if (ecoType === 'Finance') {
                        state.ecoBcaFinanceStep = 0;
                        navigateTo('ecoBcaFinance');
                    }
                };
            });

            if (continueBtn) {
                continueBtn.onclick = () => {
                    const newPocket = {
                        id: state.pockets.length + 1,
                        name: state.newPocketData.name || 'My Pocket',
                        category: state.newPocketData.category,
                        balance: "0",
                        target: "1.000.000",
                        progress: 0,
                        type: state.newPocketData.type,
                        locked: state.newPocketData.locked,
                        qrisEnabled: false
                    };
                    state.pockets.push(newPocket);
                    showToast("🎉 Pocket Created Successfully!");
                    state.rewards.points += 500;
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

            // Ecosystem Integration — navigate to proper multi-step screens
            const ecoActions = document.querySelectorAll('.eco-action-item');
            ecoActions.forEach(action => {
                action.onclick = () => {
                    const type = action.getAttribute('data-action');
                    if (type === 'investasi') { state.ecoInvestasiStep = 0; navigateTo('ecoInvestasi'); }
                    else if (type === 'life') { state.ecoBcaLifeStep = 0; navigateTo('ecoBcaLife'); }
                    else if (type === 'finance') { state.ecoBcaFinanceStep = 0; navigateTo('ecoBcaFinance'); }
                };
            });

            // Linked Products section
            document.querySelectorAll('.eco-link-add-btn').forEach(btn => {
                btn.onclick = () => navigateTo('ecoConnect');
            });
            document.querySelectorAll('.eco-unlink-btn').forEach(btn => {
                btn.onclick = () => {
                    const pid = btn.getAttribute('data-link-id');
                    state.connectedLinks = state.connectedLinks.filter(l => l.productId !== pid);
                    showToast('🔗 Koneksi produk diputus');
                    setTimeout(() => navigateTo('pocketDetail'), 800);
                };
            });
        } else if (screenName === 'sharedProtection') {
            document.getElementById('btnBackFromSharedProt').onclick = () => navigateTo('pocketsDashboard');
            document.getElementById('btnCreateSharedPocket').onclick = () => showToast('👨‍👩‍👧 Fitur buat Shared Pocket akan segera hadir!');
            document.getElementById('btnCreateSharedPocket2').onclick = () => showToast('👨‍👩‍👧 Fitur buat Shared Pocket akan segera hadir!');
            document.querySelectorAll('.sp-invite-btn').forEach(b => b.onclick = (e) => { e.stopPropagation(); showToast('📨 Undangan dikirim!'); });
            document.querySelectorAll('.sp-prot-card').forEach(card => {
                card.onclick = () => {
                    const s = card.getAttribute('data-screen');
                    if (s === 'ecoBcaLife') { state.ecoBcaLifeStep = 0; navigateTo('ecoBcaLife'); }
                    else if (s === 'ecoInvestasi') { state.ecoInvestasiStep = 0; navigateTo('ecoInvestasi'); }
                };
            });
            document.querySelectorAll('.sp-alert-toggle').forEach(toggle => {
                toggle.onclick = () => {
                    const isOn = toggle.style.background === 'rgb(0, 119, 200)';
                    toggle.style.background = isOn ? '#E2E8F0' : '#0077C8';
                    const knob = toggle.querySelector('div');
                    knob.style.left = isOn ? '2px' : '';
                    knob.style.right = isOn ? '' : '2px';
                    showToast(isOn ? '🔕 Alert dinonaktifkan' : '🔔 Alert diaktifkan');
                };
            });
        } else if (screenName === 'goalEngine') {
            document.getElementById('btnBackFromGoalEngine').onclick = () => navigateTo('pocketsDashboard');

            // Slider interaction
            const needsSlider = document.getElementById('ge-needs');
            const wantsSlider = document.getElementById('ge-wants');
            function updateAlloc() {
                const n = parseInt(needsSlider.value);
                const w = parseInt(wantsSlider.value);
                const s = Math.max(0, 100 - n - w);
                state.goalEngine.needs = n; state.goalEngine.wants = w; state.goalEngine.savings = s;
                ['needs','wants','savings'].forEach(k => {
                    const el = document.getElementById('ge-' + k + '-val');
                    const lbl = document.getElementById('ge-' + k + '-lbl');
                    if (el) el.textContent = state.goalEngine[k] + '%';
                    if (lbl) lbl.textContent = state.goalEngine[k] + '%';
                });
                const barN = document.getElementById('ge-bar-needs');
                const barW = document.getElementById('ge-bar-wants');
                if (barN) barN.style.width = n + '%';
                if (barW) barW.style.width = w + '%';
                const disp = document.getElementById('ge-savings-disp');
                const amt = document.getElementById('ge-savings-amt');
                if (disp) disp.textContent = s + '%';
                if (amt) amt.textContent = 'IDR ' + (state.goalEngine.income * s / 100).toLocaleString('id-ID') + '/bln';
            }
            if (needsSlider) needsSlider.oninput = updateAlloc;
            if (wantsSlider) wantsSlider.oninput = updateAlloc;

            // Template cards
            document.querySelectorAll('.ge-template-card').forEach(card => {
                card.onclick = () => {
                    const name = card.getAttribute('data-name');
                    showToast('📝 Membuat poket "' + name + '"...');
                    setTimeout(() => navigateTo('createForm'), 800);
                };
            });

            // Apply plan
            const btnApply = document.getElementById('btnApplyGoalPlan');
            if (btnApply) {
                btnApply.onclick = () => {
                    showToast('⚡ Rencana alokasi diterapkan!');
                    setTimeout(() => navigateTo('pocketsDashboard'), 1200);
                };
            }
        } else if (screenName === 'lifeStageDetail') {
            document.getElementById('btnBackFromLifeStage').onclick = () => navigateTo('pocketsDashboard');
            document.querySelectorAll('.life-stage-action').forEach(card => {
                card.onclick = () => {
                    const target = card.getAttribute('data-screen');
                    if (target === 'ecoInvestasi') { state.ecoInvestasiStep = 0; navigateTo('ecoInvestasi'); }
                    else if (target === 'ecoBcaFinance') { state.ecoBcaFinanceStep = 0; navigateTo('ecoBcaFinance'); }
                    else { navigateTo(target); }
                };
            });
        } else if (screenName === 'ecoConnect') {
            document.getElementById('btnBackFromEcoConnect').onclick = () => navigateTo('pocketDetail');

            let selectedProductId = null;
            let selectedPocketId = null;

            const step0 = document.getElementById('ecoConnectStep0');
            const step1 = document.getElementById('ecoConnectStep1');
            const step2 = document.getElementById('ecoConnectStep2');

            // Select existing product
            document.querySelectorAll('.eco-connect-card').forEach(card => {
                card.onclick = () => {
                    const alreadyLinked = state.connectedLinks.find(l => l.productId === card.getAttribute('data-product-id'));
                    if (alreadyLinked) {
                        showToast('✅ Produk ini sudah terhubung ke poket');
                        return;
                    }
                    selectedProductId = card.getAttribute('data-product-id');
                    const prod = state.existingBcaProducts.find(p => p.id === selectedProductId);
                    // Update banner
                    const banner = document.getElementById('ecoConnectSelectedBanner');
                    banner.innerHTML = `<div style="font-size:1.5rem;">${prod.icon}</div><div><div style="font-weight:700;font-size:0.85rem;color:#003366;">${prod.name}</div><div style="font-size:0.72rem;color:#0369A1;">${prod.detail}</div></div>`;
                    step0.style.display = 'none';
                    step1.style.display = 'block';
                };
            });

            // Browse new products shortcut
            document.querySelectorAll('.eco-browse-new').forEach(btn => {
                btn.onclick = () => {
                    const type = btn.getAttribute('data-type');
                    if (type === 'investasi') { state.ecoInvestasiStep = 0; navigateTo('ecoInvestasi'); }
                    else if (type === 'life') { state.ecoBcaLifeStep = 0; navigateTo('ecoBcaLife'); }
                    else if (type === 'finance') { state.ecoBcaFinanceStep = 0; navigateTo('ecoBcaFinance'); }
                };
            });

            // Select pocket
            document.querySelectorAll('.eco-pocket-select').forEach(card => {
                card.onclick = () => {
                    selectedPocketId = card.getAttribute('data-pocket-id');
                    if (selectedPocketId === 'new') {
                        showToast('📝 Navigating to Create Pocket...');
                        setTimeout(() => navigateTo('createForm'), 800);
                        return;
                    }
                    const prod = state.existingBcaProducts.find(p => p.id === selectedProductId);
                    const pocket = state.pockets.find(p => p.id === parseInt(selectedPocketId));
                    const summary = document.getElementById('ecoConnectSummary');
                    summary.innerHTML = [
                        ['Produk BCA', `${prod.icon} ${prod.name}`],
                        ['Auto-Debit Dari', `Poket "${pocket.name}" (IDR ${pocket.balance})`],
                        ['Nominal', prod.detail.split('·')[1]?.trim() || '-'],
                        ['Tanggal Debit', `Setiap tgl ${prod.dueDate}`],
                        ['Status', '🟡 Menunggu Konfirmasi']
                    ].map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F1F5F9;"><span style="font-size:0.77rem;color:#64748B;">${k}</span><span style="font-size:0.77rem;font-weight:700;color:#1e293b;">${v}</span></div>`).join('');
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                };
            });

            // Confirm connection
            const btnConfirm = document.getElementById('btnConfirmEcoConnect');
            if (btnConfirm) {
                btnConfirm.onclick = () => {
                    if (selectedProductId && selectedPocketId) {
                        state.connectedLinks.push({ productId: selectedProductId, pocketId: selectedPocketId });
                        showToast('🎉 Auto-debit berhasil diaktifkan!');
                        setTimeout(() => navigateTo('pocketDetail'), 1200);
                    }
                };
            }
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
        } else if (screenName === 'ecoInvestasi') {
            document.getElementById('btnBackFromEcoInvestasi').onclick = () => navigateTo('pocketDetail');
            const steps = document.querySelectorAll('.eco-inv-step');
            const renderStep = () => {
                steps.forEach((s, i) => s.style.display = i === state.ecoInvestasiStep ? 'block' : 'none');
            };
            renderStep();
            document.querySelectorAll('.eco-inv-next').forEach(btn => {
                btn.onclick = () => {
                    if (state.ecoInvestasiStep < steps.length - 1) {
                        state.ecoInvestasiStep++;
                        renderStep();
                    } else {
                        showToast('🎉 Pembelian Reksa Dana berhasil! Dana dipotong dari Poket.');
                        state.ecoInvestasiStep = 0;
                        setTimeout(() => navigateTo('pocketDetail'), 1500);
                    }
                };
            });
        } else if (screenName === 'ecoBcaLife') {
            document.getElementById('btnBackFromEcoBcaLife').onclick = () => navigateTo('pocketDetail');
            const steps = document.querySelectorAll('.eco-life-step');
            const renderStep = () => {
                steps.forEach((s, i) => s.style.display = i === state.ecoBcaLifeStep ? 'block' : 'none');
            };
            renderStep();
            document.querySelectorAll('.eco-life-next').forEach(btn => {
                btn.onclick = () => {
                    if (state.ecoBcaLifeStep < steps.length - 1) {
                        state.ecoBcaLifeStep++;
                        renderStep();
                    } else {
                        showToast('🛡️ Polis MyGuard aktif! E-polis dikirim ke email.');
                        state.ecoBcaLifeStep = 0;
                        setTimeout(() => navigateTo('pocketDetail'), 1500);
                    }
                };
            });
        } else if (screenName === 'ecoBcaFinance') {
            document.getElementById('btnBackFromEcoBcaFinance').onclick = () => navigateTo('pocketDetail');
            const steps = document.querySelectorAll('.eco-fin-step');
            const renderStep = () => {
                steps.forEach((s, i) => s.style.display = i === state.ecoBcaFinanceStep ? 'block' : 'none');
            };
            renderStep();
            // Simulasi DP slider
            const dpSlider = document.getElementById('dpSlider');
            const dpVal = document.getElementById('dpVal');
            const cicilanVal = document.getElementById('cicilanVal');
            if (dpSlider) {
                dpSlider.oninput = () => {
                    const dp = parseInt(dpSlider.value);
                    const sisa = state.ecoFinanceSim.harga - dp;
                    const cicilan = Math.round(sisa / state.ecoFinanceSim.tenor * 1.08);
                    dpVal.textContent = 'IDR ' + dp.toLocaleString('id-ID');
                    cicilanVal.textContent = 'IDR ' + cicilan.toLocaleString('id-ID') + '/bln';
                };
            }
            const tenorBtns = document.querySelectorAll('.tenor-btn');
            tenorBtns.forEach(b => {
                b.onclick = () => {
                    tenorBtns.forEach(x => { x.style.background='white'; x.style.color='#64748B'; x.style.border='1px solid #E2E8F0'; });
                    b.style.background='#0077C8'; b.style.color='white'; b.style.border='1px solid #0077C8';
                    state.ecoFinanceSim.tenor = parseInt(b.getAttribute('data-tenor'));
                    if (dpSlider) dpSlider.oninput();
                };
            });
            document.querySelectorAll('.eco-fin-next').forEach(btn => {
                btn.onclick = () => {
                    if (state.ecoBcaFinanceStep < steps.length - 1) {
                        state.ecoBcaFinanceStep++;
                        renderStep();
                    } else {
                        showToast('✅ Pengajuan KKB terkirim! OTP dikirim ke nomor terdaftar.');
                        state.ecoBcaFinanceStep = 0;
                        setTimeout(() => navigateTo('pocketDetail'), 1500);
                    }
                };
            });
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
            if (state.onboardingStep === 2) {
                const insightTab = document.querySelector('.ai-tab[data-target="insight"]');
                if (insightTab) insightTab.click();
            } else if (state.onboardingStep === 3) {
                const pocketTab = document.querySelector('.ai-tab[data-target="pocket"]');
                if (pocketTab) pocketTab.click();
            }

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
                    const estimatedCardHeight = card.offsetHeight || 250;
                    if (cardTop + estimatedCardHeight > appContainer.clientHeight) {
                        cardTop = relTop - estimatedCardHeight - 20;
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
