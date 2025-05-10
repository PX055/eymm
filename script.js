document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Toggle forms
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const formTitle = document.getElementById('form-title');
    const authSection = document.getElementById('auth-section');
    const dashboard = document.getElementById('dashboard');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logout-btn');

    // Session management
    function setSession(username) {
        localStorage.setItem('sessionUser', username);
    }
    function clearSession() {
        localStorage.removeItem('sessionUser');
    }
    function getSession() {
        return localStorage.getItem('sessionUser');
    }

    // Show dashboard
    function showDashboard(username) {
        authSection.style.display = 'none';
        dashboard.style.display = 'flex';
        welcomeMessage.textContent = `Welcome, ${username}!`;
    }
    // Hide dashboard
    function hideDashboard() {
        dashboard.style.display = 'none';
        authSection.style.display = 'flex';
    }

    // On page load, check session
    const sessionUser = getSession();
    if (sessionUser) {
        showDashboard(sessionUser);
    } else {
        hideDashboard();
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearSession();
            hideDashboard();
        });
    }

    if (showRegister && showLogin) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            formTitle.textContent = 'Register';
        });
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formTitle.textContent = 'Login';
        });
    }

    // Add floating label effect
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Helper: get users from localStorage
    function getUsers() {
        let users;
        try {
            users = JSON.parse(localStorage.getItem('users') || '[]');
        } catch (e) {
            users = [];
        }
        if (!Array.isArray(users)) {
            users = [];
            localStorage.setItem('users', '[]');
        }
        return users;
    }
    // Helper: save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    // Helper: show message
    function showMessage(msg, type = 'error') {
        let msgDiv = document.createElement('div');
        msgDiv.className = type === 'success' ? 'success-message' : 'error-message';
        msgDiv.textContent = msg;
        const form = type === 'success' ? registerForm : loginForm;
        form.insertBefore(msgDiv, form.firstChild);
        setTimeout(() => msgDiv.remove(), 3000);
    }

    const loadingSpinner = document.getElementById('loading-spinner');

    function showLoading() {
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
    }
    function hideLoading() {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showLoading();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const users = getUsers();
        setTimeout(() => { // Simulate async login
            const user = users.find(u => u.username === username && u.password === btoa(password));
            if (!user) {
                hideLoading();
                showMessage('Invalid username or password.');
                return;
            }
            showMessage('Login successful!', 'success');
            setSession(username);
            setTimeout(() => {
                hideLoading();
                showDashboard(username);
            }, 800);
        }, 1000); // 1s loading
    });

    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        if (!username || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
            return;
        }
        let users = getUsers();
        if (users.find(u => u.username === username)) {
            showMessage('Username already exists.');
            return;
        }
        if (users.find(u => u.email === email)) {
            showMessage('Email already registered.');
            return;
        }
        users.push({ username, email, password: btoa(password) });
        saveUsers(users);
        showMessage('Registration successful! You can now log in.', 'success');
        setTimeout(() => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formTitle.textContent = 'Login';
        }, 1200);
    });

    // Dashboard nav icon functions
    const userIcon = document.querySelector('.user-icon');
    const settingsIcon = document.querySelector('.settings-icon');
    const themeIcon = document.querySelector('.theme-icon');
    const dashboardCard = document.getElementById('dashboard');

    if (userIcon) {
        userIcon.addEventListener('click', () => {
            alert('Profile: This would open the user profile.');
        });
    }
    if (settingsIcon) {
        settingsIcon.addEventListener('click', () => {
            alert('Settings: This would open the settings panel.');
        });
    }
    if (themeIcon) {
        themeIcon.addEventListener('click', () => {
            dashboardCard.classList.toggle('dark-theme');
        });
    }
}); 