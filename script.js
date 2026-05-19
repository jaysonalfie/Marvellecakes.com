/* ============================================
   MARVELLE CAKES — Client-side logic
   Handles: mobile nav, registration, contact form,
            localStorage persistence, list rendering.
   ============================================ */

(function () {
    'use strict';

    // ---------- localStorage keys ----------
    const CUSTOMERS_KEY = 'marvelle_customers';
    const MESSAGES_KEY  = 'marvelle_messages';

    // ---------- Helpers ----------
    function load(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function save(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('en-GB', {
            day:   '2-digit',
            month: 'short',
            year:  'numeric'
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function isValidPhone(value) {
        const digits = value.replace(/[^\d]/g, '');
        return digits.length >= 7 && digits.length <= 15;
    }

    function setError(input, hasError) {
        const group = input.closest('.form-group');
        if (!group) return;
        group.classList.toggle('has-error', hasError);
    }

    function flashSuccess(el) {
        if (!el) return;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 4000);
    }

    // ---------- Mobile nav toggle ----------
    function initNavToggle() {
        const toggle = document.querySelector('.nav-toggle');
        const links  = document.querySelector('.nav-links');
        if (!toggle || !links) return;
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        // Close menu when a link is clicked (mobile)
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('open'));
        });
    }

    // ---------- Customer registration ----------
    function initRegisterForm() {
        const form    = document.getElementById('register-form');
        const tbody   = document.getElementById('customers-tbody');
        const success = document.getElementById('register-success');
        if (!form && !tbody) return; // not on this page

        if (form) {
            const name  = form.querySelector('#reg-name');
            const phone = form.querySelector('#reg-phone');
            const email = form.querySelector('#reg-email');

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const nameOk  = name.value.trim().length >= 2;
                const phoneOk = isValidPhone(phone.value);
                const emailOk = isValidEmail(email.value);

                setError(name,  !nameOk);
                setError(phone, !phoneOk);
                setError(email, !emailOk);

                if (!(nameOk && phoneOk && emailOk)) return;

                const customers = load(CUSTOMERS_KEY);
                customers.unshift({
                    id:    uid(),
                    name:  name.value.trim(),
                    phone: phone.value.trim(),
                    email: email.value.trim(),
                    date:  new Date().toISOString()
                });
                save(CUSTOMERS_KEY, customers);

                form.reset();
                flashSuccess(success);
                renderCustomers();
            });
        }

        renderCustomers();
    }

    function renderCustomers() {
        const tbody = document.getElementById('customers-tbody');
        if (!tbody) return;

        const customers = load(CUSTOMERS_KEY);

        if (customers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No customers registered yet. Be the first!</td></tr>`;
            return;
        }

        tbody.innerHTML = customers.map(c => `
            <tr>
                <td>${formatDate(c.date)}</td>
                <td>${escapeHtml(c.name)}</td>
                <td>${escapeHtml(c.phone)}</td>
                <td>${escapeHtml(c.email)}</td>
                <td><button class="delete-btn" data-id="${c.id}" data-type="customer">Delete</button></td>
            </tr>
        `).join('');
    }

    // ---------- Contact form ----------
    function initContactForm() {
        const form    = document.getElementById('contact-form');
        const tbody   = document.getElementById('messages-tbody');
        const success = document.getElementById('contact-success');
        if (!form && !tbody) return;

        if (form) {
            const name    = form.querySelector('#contact-name');
            const email   = form.querySelector('#contact-email');
            const subject = form.querySelector('#contact-subject');
            const message = form.querySelector('#contact-message');

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const nameOk    = name.value.trim().length >= 2;
                const emailOk   = isValidEmail(email.value);
                const subjectOk = subject.value !== '';
                const messageOk = message.value.trim().length >= 5;

                setError(name,    !nameOk);
                setError(email,   !emailOk);
                setError(subject, !subjectOk);
                setError(message, !messageOk);

                if (!(nameOk && emailOk && subjectOk && messageOk)) return;

                const messages = load(MESSAGES_KEY);
                messages.unshift({
                    id:      uid(),
                    name:    name.value.trim(),
                    email:   email.value.trim(),
                    subject: subject.value,
                    message: message.value.trim(),
                    date:    new Date().toISOString()
                });
                save(MESSAGES_KEY, messages);

                form.reset();
                flashSuccess(success);
                renderMessages();
            });
        }

        renderMessages();
    }

    function renderMessages() {
        const tbody = document.getElementById('messages-tbody');
        if (!tbody) return;

        const messages = load(MESSAGES_KEY);

        if (messages.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No messages yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = messages.map(m => {
            const preview = m.message.length > 80
                ? escapeHtml(m.message.slice(0, 80)) + '&hellip;'
                : escapeHtml(m.message);
            return `
                <tr>
                    <td>${formatDate(m.date)}</td>
                    <td>${escapeHtml(m.name)}</td>
                    <td>${escapeHtml(m.email)}</td>
                    <td>${escapeHtml(m.subject)}</td>
                    <td>${preview}</td>
                    <td><button class="delete-btn" data-id="${m.id}" data-type="message">Delete</button></td>
                </tr>
            `;
        }).join('');
    }

    // ---------- Delete handler (event delegation) ----------
    function initDeleteHandler() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-btn');
            if (!btn) return;

            const id   = btn.dataset.id;
            const type = btn.dataset.type;
            if (!id || !type) return;

            if (!confirm('Remove this entry?')) return;

            if (type === 'customer') {
                const list = load(CUSTOMERS_KEY).filter(c => c.id !== id);
                save(CUSTOMERS_KEY, list);
                renderCustomers();
            } else if (type === 'message') {
                const list = load(MESSAGES_KEY).filter(m => m.id !== id);
                save(MESSAGES_KEY, list);
                renderMessages();
            }
        });
    }

    // ---------- Boot ----------
    document.addEventListener('DOMContentLoaded', () => {
        initNavToggle();
        initRegisterForm();
        initContactForm();
        initDeleteHandler();
    });

})();
