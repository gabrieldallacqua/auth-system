const API_URL = 'http://localhost:3000';

const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const activeSessionBanner = document.getElementById('active-session-banner');
const sessionEmail = document.getElementById('session-email');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const eyeIcon = document.getElementById('eye-icon');

const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');
const btnGotoProfile = document.getElementById('btn-goto-profile');
const btnBackHome = document.getElementById('btn-back-home');

// Elementos do Dashboard e Configurações
const btnSettingsToggle = document.getElementById('btn-settings-toggle');
const btnCloseSettings = document.getElementById('btn-close-settings');
const settingsMenu = document.getElementById('settings-menu');
const profileUsername = document.getElementById('profile-username');
const profileEmailSub = document.getElementById('profile-email-sub');
const btnUpdatePassword = document.getElementById('btn-update-password');
const newPasswordInput = document.getElementById('new-password');

let cachedUserData = null;

// Criar o container de Toast na página se não existir
if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Funcionalidade do Olhinho (Esconder / Mostrar Senha)
if (togglePasswordBtn && passwordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Alterna o ícone do Phosphor Icons
        eyeIcon.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
    });
}

// Verificar sessão ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                cachedUserData = data.user;
                sessionEmail.textContent = data.user.email;
                activeSessionBanner.classList.remove('hidden');
            } else {
                localStorage.removeItem('token');
            }
        } catch {
            localStorage.removeItem('token');
        }
    }
});

// Ir direto para o painel pelo banner de sessão ativa
if (btnGotoProfile) {
    btnGotoProfile.addEventListener('click', () => {
        if (cachedUserData) {
            showProfileView(cachedUserData);
        }
    });
}

// Voltar do painel para a tela inicial de auth
if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
        profileSection.classList.add('hidden');
        authSection.classList.remove('hidden');
    });
}

// Abrir/Fechar menu de configurações pelo ícone de engrenagem
if (btnSettingsToggle) {
    btnSettingsToggle.addEventListener('click', () => {
        settingsMenu.classList.toggle('hidden');
    });
}

if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', () => {
        settingsMenu.classList.add('hidden');
    });
}

// Ação de Registrar
if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao registrar');
            
            showToast('Cadastro realizado com sucesso! Faça login.', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

// Ação de Login
if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');

            localStorage.setItem('token', data.token);
            showToast('Login realizado com sucesso!', 'success');
            loadProfile(data.token);
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

// Ação de Logout
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('token');
        cachedUserData = null;
        activeSessionBanner.classList.add('hidden');
        profileSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        
        emailInput.value = '';
        passwordInput.value = '';
        if (settingsMenu) settingsMenu.classList.add('hidden');
        showToast('Sessão encerrada com sucesso.', 'success');
    });
}

async function loadProfile(token) {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Sessão expirada');
        cachedUserData = data.user;
        showProfileView(data.user);
    } catch (error) {
        localStorage.removeItem('token');
        showToast(error.message, 'error');
    }
}

function showProfileView(user) {
    const username = user.email.split('@')[0];
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);

    profileUsername.textContent = formattedName;
    profileEmailSub.textContent = user.email;
    
    // Garante que o menu de configurações comece fechado e limpa inputs
    if (settingsMenu) settingsMenu.classList.add('hidden');
    emailInput.value = '';
    passwordInput.value = '';

    authSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
}

// Ação de atualizar senha no menu de configurações
if (btnUpdatePassword) {
    btnUpdatePassword.addEventListener('click', () => {
        const val = newPasswordInput.value;
        if (!val || val.length < 6) {
            showToast('A nova senha precisa ter no mínimo 6 caracteres.', 'error');
            return;
        }
        showToast('Senha alterada com sucesso!', 'success');
        newPasswordInput.value = '';
        if (settingsMenu) settingsMenu.classList.add('hidden');
    });
}