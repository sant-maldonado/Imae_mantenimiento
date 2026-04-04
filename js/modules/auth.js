const auth = {
    currentUser: null,

    init() {
        this.cargarUsuarioActual();
        if (this.currentUser) {
            this.mostrarApp();
        } else {
            this.mostrarLogin();
        }
    },

    cargarUsuarioActual() {
        const usuario = localStorage.getItem('currentUser');
        if (usuario) {
            this.currentUser = JSON.parse(usuario);
        }
    },

    guardarUsuarioActual() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    },

    mostrarLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('registerScreen').style.display = 'none';
        document.querySelector('.app-container').classList.add('hidden');
    },

    mostrarRegistro() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'flex';
    },

    mostrarApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'none';
        document.querySelector('.app-container').classList.remove('hidden');
        this.actualizarUI();
    },

    actualizarUI() {
        const existingUserInfo = document.querySelector('.user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
        }

        if (this.currentUser) {
            const headerActions = document.querySelector('.header-actions');
            if (headerActions) {
                const userInfo = document.createElement('div');
                userInfo.className = 'user-info';
                userInfo.innerHTML = `
                    <span>${this.currentUser.nombre} ${this.currentUser.apellido}</span>
                    <small>(${this.currentUser.rol})</small>
                    <button class="btn btn-secondary" onclick="auth.logout()">Cerrar Sesión</button>
                `;
                headerActions.appendChild(userInfo);
            }
        }
    },

    async login(email, password) {
        const usuario = storage.getUsuarioByEmail(email);
        if (!usuario) {
            ui.showToast('Email o contraseña incorrectos', 'error');
            return false;
        }
        if (usuario.password !== password) {
            ui.showToast('Email o contraseña incorrectos', 'error');
            return false;
        }
        if (!usuario.activo) {
            ui.showToast('Usuario inactivo', 'error');
            return false;
        }
        
        usuario.ultimo_login = new Date().toISOString();
        await storage.actualizarUsuario(usuario);
        
        this.currentUser = { ...usuario };
        delete this.currentUser.password;
        this.guardarUsuarioActual();
        this.mostrarApp();
        ui.showToast('Bienvenido ' + usuario.nombre, 'success');
        return true;
    },

    async registro(data) {
        if (!data.nombre || !data.apellido || !data.email || !data.password) {
            ui.showToast('Todos los campos son obligatorios', 'error');
            return false;
        }
        
        if (data.password !== data.passwordConfirm) {
            ui.showToast('Las contraseñas no coinciden', 'error');
            return false;
        }
        
        if (data.password.length < 6) {
            ui.showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return false;
        }
        
        const existente = storage.getUsuarioByEmail(data.email);
        if (existente) {
            ui.showToast('El email ya está registrado', 'error');
            return false;
        }
        
        const usuario = new Usuario({
            email: data.email,
            password: data.password,
            nombre: data.nombre,
            apellido: data.apellido,
            rol: ROLES_USUARIO.TECNICO
        });
        
        await storage.addUsuario(usuario);
        
        this.currentUser = { ...usuario };
        delete this.currentUser.password;
        this.guardarUsuarioActual();
        this.mostrarApp();
        ui.showToast('Registro exitoso. Bienvenido ' + usuario.nombre, 'success');
        return true;
    },

    logout() {
        this.currentUser = null;
        this.guardarUsuarioActual();
        
        const existingUserInfo = document.querySelector('.user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        
        this.mostrarLogin();
        ui.showToast('Sesión cerrada correctamente', 'success');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await auth.login(email, password);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await auth.registro({
                nombre: document.getElementById('regNombre').value,
                apellido: document.getElementById('regApellido').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                passwordConfirm: document.getElementById('regPasswordConfirm').value
            });
        });
    }
});