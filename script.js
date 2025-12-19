/**
 * PaySphere — Hackathon Demo
 * AI-Powered Fraud Detection
 */

document.addEventListener('DOMContentLoaded', () => {
    initPaymentDemo();
    initUseCaseToggle();
    initChatWidget();
    initScrollAnimations();
    initMobileMenu();
    initFeedbackForm();
});

/* ===== Payment Demo - Core Feature ===== */
function initPaymentDemo() {
    const form = document.getElementById('payment-form');
    const loading = document.getElementById('loading');
    const riskAnalysis = document.getElementById('risk-analysis');
    const decisionResult = document.getElementById('decision-result');
    const resetBtn = document.getElementById('reset-btn');

    // Form elements
    const amountInput = document.getElementById('amount');
    const senderCountry = document.getElementById('sender-country');
    const txType = document.getElementById('tx-type');
    const accountAge = document.getElementById('account-age');

    // Risk analysis elements
    const riskRing = document.getElementById('risk-ring');
    const riskValue = document.getElementById('risk-value');
    const riskLabel = document.getElementById('risk-label');
    const riskFactors = document.getElementById('risk-factors');

    // Decision elements
    const decisionIcon = document.getElementById('decision-icon');
    const decisionTitle = document.getElementById('decision-title');
    const decisionMessage = document.getElementById('decision-message');
    const decisionTime = document.getElementById('decision-time');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide form, show loading
        form.style.display = 'none';
        loading.classList.add('active');

        // Simulate AI processing
        await delay(1500);

        // Calculate risk score based on inputs
        const riskData = calculateRiskScore({
            amount: parseFloat(amountInput.value),
            country: senderCountry.value,
            txType: txType.value,
            accountAge: accountAge.value
        });

        // Hide loading, show risk analysis
        loading.classList.remove('active');
        riskAnalysis.classList.add('active');

        // Animate risk score
        await animateRiskScore(riskData.score, riskData.level);

        // Show risk factors
        displayRiskFactors(riskData.factors);

        // Wait, then show decision
        await delay(2000);

        riskAnalysis.classList.remove('active');
        showDecision(riskData);
    });

    resetBtn.addEventListener('click', () => {
        decisionResult.classList.remove('active', 'verified', 'blocked');
        form.style.display = 'grid';
        riskValue.textContent = '0';
        riskRing.style.setProperty('--score', '0');
        riskFactors.innerHTML = '';
    });

    function calculateRiskScore(data) {
        let score = 0;
        let factors = [];

        // Amount risk
        if (data.amount > 10000) {
            score += 25;
            factors.push('High transaction amount');
        } else if (data.amount > 5000) {
            score += 15;
            factors.push('Elevated amount');
        } else if (data.amount < 100) {
            score += 5;
            factors.push('Micro-transaction');
        }

        // Country risk
        const highRiskCountries = ['NG', 'RU'];
        const mediumRiskCountries = ['CN'];

        if (highRiskCountries.includes(data.country)) {
            score += 35;
            factors.push('High-risk jurisdiction');
        } else if (mediumRiskCountries.includes(data.country)) {
            score += 20;
            factors.push('Elevated jurisdiction risk');
        }

        // Transaction type risk
        if (data.txType === 'first-time') {
            score += 25;
            factors.push('First-time sender');
        } else if (data.txType === 'instant') {
            score += 10;
            factors.push('Instant payment');
        }

        // Account age risk
        if (data.accountAge === 'new') {
            score += 30;
            factors.push('New account (<6 months)');
        } else if (data.accountAge === '6months') {
            score += 15;
            factors.push('Recent account');
        }

        // Cap score at 100
        score = Math.min(score, 100);

        // Determine risk level
        let level;
        if (score >= 60) {
            level = 'high';
        } else if (score >= 30) {
            level = 'medium';
        } else {
            level = 'low';
        }

        return { score, level, factors };
    }

    async function animateRiskScore(targetScore, level) {
        const colors = {
            low: '#10B981',
            medium: '#F59E0B',
            high: '#EF4444'
        };

        const color = colors[level];
        riskRing.style.setProperty('--risk-color', color);
        riskValue.style.color = color;

        // Animate score
        let current = 0;
        const increment = targetScore / 30;

        return new Promise(resolve => {
            const interval = setInterval(() => {
                current += increment;
                if (current >= targetScore) {
                    current = targetScore;
                    clearInterval(interval);
                    resolve();
                }
                riskValue.textContent = Math.round(current);
                riskRing.style.setProperty('--score', current);
            }, 50);
        });
    }

    function displayRiskFactors(factors) {
        riskFactors.innerHTML = factors.map(f =>
            `<span class="risk-factor">${f}</span>`
        ).join('');

        riskLabel.textContent = factors.length > 0
            ? `Risk Score • ${factors.length} factor${factors.length > 1 ? 's' : ''} detected`
            : 'Risk Score • No risk factors';
    }

    function showDecision(riskData) {
        const isBlocked = riskData.level === 'high';
        const processingTime = (800 + Math.random() * 400).toFixed(0);

        decisionResult.classList.add('active', isBlocked ? 'blocked' : 'verified');

        if (isBlocked) {
            decisionIcon.textContent = '🛑';
            decisionTitle.textContent = 'Transaction Blocked';
            decisionMessage.textContent = 'High fraud risk detected. Transaction requires manual review.';
        } else {
            decisionIcon.textContent = '✅';
            decisionTitle.textContent = 'Transaction Verified';
            decisionMessage.textContent = riskData.level === 'medium'
                ? 'Moderate risk. Transaction approved with enhanced monitoring.'
                : 'Low risk. Transaction approved successfully.';
        }

        decisionTime.textContent = `Processed in ${processingTime}ms`;
    }
}

/* ===== B2B/B2C Toggle ===== */
function initUseCaseToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const contents = document.querySelectorAll('.use-case-content');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;

            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            contents.forEach(c => {
                c.classList.remove('active');
                if (c.id === target) {
                    c.classList.add('active');
                }
            });
        });
    });
}

/* ===== AI Chat Widget ===== */
function initChatWidget() {
    const toggle = document.getElementById('chat-toggle');
    const window_ = document.getElementById('chat-window');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');

    let isOpen = false;

    // AI Responses
    const responses = {
        fraud: [
            "Our AI analyzes 50+ risk factors including transaction patterns, device fingerprints, and behavioral biometrics to detect fraud in real-time.",
            "PaySphere catches fraud that traditional rule-based systems miss by using machine learning to identify subtle patterns."
        ],
        how: [
            "It's simple: 1) Collect payment data → 2) AI analyzes risk factors → 3) Instant verify or block decision. All in under 500ms!",
            "Our system processes transactions through multiple ML models simultaneously, checking against known fraud patterns and anomaly detection."
        ],
        pricing: [
            "We offer a free tier with 1,000 transactions/month. Our Full plan at $299/month includes unlimited transactions and advanced AI models.",
            "Free plan is perfect for testing. Full plan pays for itself by preventing even one fraudulent transaction."
        ],
        accuracy: [
            "PaySphere achieves 99.7% fraud detection with a false positive rate under 0.1%. Our AI continuously learns from new fraud patterns.",
            "We reduce chargebacks by 85% on average while maintaining smooth customer experience for legitimate transactions."
        ],
        integration: [
            "Integration takes minutes! We offer REST APIs, SDKs for major platforms, and pre-built plugins for Stripe, Shopify, and more.",
            "Just add our JavaScript snippet or use our API endpoint. Most customers go live within 24 hours."
        ],
        default: [
            "Great question! PaySphere uses advanced AI to detect payment fraud in real-time. Would you like to know about our accuracy, pricing, or integration options?",
            "I can tell you about how our fraud detection works, our pricing plans, or how to integrate. What interests you most?",
            "That's an interesting question. Our AI-powered system analyzes transactions instantly. Try the live demo above to see it in action!"
        ]
    };

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        window_.classList.toggle('open', isOpen);
        toggle.style.display = isOpen ? 'none' : 'flex';
    });

    close.addEventListener('click', () => {
        isOpen = false;
        window_.classList.remove('open');
        toggle.style.display = 'flex';
    });

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage('user', text);
        input.value = '';

        // Show typing
        const typingId = showTyping();

        setTimeout(() => {
            removeTyping(typingId);
            const response = getResponse(text);
            addMessage('ai', response);
        }, 800 + Math.random() * 700);
    }

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(type, text) {
        const msg = document.createElement('div');
        msg.className = `chat-message chat-message-${type}`;
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const typing = document.createElement('div');
        typing.id = id;
        typing.className = 'chat-message chat-message-ai';
        typing.innerHTML = '<span style="opacity:0.6">Typing...</span>';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        document.getElementById(id)?.remove();
    }

    function getResponse(text) {
        const lower = text.toLowerCase();

        if (lower.includes('fraud') || lower.includes('detect') || lower.includes('risk')) {
            return responses.fraud[Math.floor(Math.random() * responses.fraud.length)];
        }
        if (lower.includes('how') || lower.includes('work') || lower.includes('process')) {
            return responses.how[Math.floor(Math.random() * responses.how.length)];
        }
        if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
            return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
        }
        if (lower.includes('accuracy') || lower.includes('accurate') || lower.includes('rate')) {
            return responses.accuracy[Math.floor(Math.random() * responses.accuracy.length)];
        }
        if (lower.includes('integrat') || lower.includes('api') || lower.includes('setup')) {
            return responses.integration[Math.floor(Math.random() * responses.integration.length)];
        }

        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
}

/* ===== Scroll Animations ===== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;

    let isOpen = false;
    let mobileNav = null;

    btn.addEventListener('click', () => {
        isOpen = !isOpen;

        const spans = btn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
        }

        if (!mobileNav) {
            mobileNav = document.createElement('div');
            mobileNav.innerHTML = `
        <nav style="display: flex; flex-direction: column; gap: 0.5rem;">
          <a href="#demo" style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a0a0b0;">Live Demo</a>
          <a href="#how-it-works" style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a0a0b0;">How It Works</a>
          <a href="#pricing" style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a0a0b0;">Pricing</a>
          <a href="#market" style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a0a0b0;">Market</a>
        </nav>
      `;
            Object.assign(mobileNav.style, {
                position: 'fixed',
                top: '64px',
                left: '0',
                right: '0',
                bottom: '0',
                background: '#0a0a0f',
                padding: '1.5rem',
                zIndex: '99',
                display: 'none'
            });
            document.body.appendChild(mobileNav);

            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.style.display = 'none';
                    isOpen = false;
                    spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
                });
            });
        }

        mobileNav.style.display = isOpen ? 'block' : 'none';
    });
}

/* ===== Feedback Form ===== */
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('feedback-name').value;
        const email = document.getElementById('feedback-email').value;
        const message = document.getElementById('feedback-message').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your feedback! 🎉');
            form.reset();
            btn.textContent = 'Submit Feedback';
            btn.disabled = false;
        }, 1000);
    });
}

/* ===== Utility ===== */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('🚀 PaySphere Hackathon Demo initialized');
