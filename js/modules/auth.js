const auth = {
    currentUser: null,

    isAdmin() {
        return this.currentUser && this.currentUser.rol === ROLES_USUARIO.ADMIN;
    },

    isTecnico() {
        return this.currentUser && this.currentUser.rol === ROLES_USUARIO.TECNICO;
    },

    puedeAdmin() {
        return this.isAdmin();
    },

    puedeTecnico() {
        return this.isAdmin() || this.isTecnico();
    },

    puedeEditar(elemento) {
        if (this.isAdmin()) return true;
        if (this.isTecnico() && elemento === 'tareas') return true;
        return false;
    },

    puedeEliminar(elemento) {
        return this.isAdmin();
    },

    puedeCrear(elemento) {
        if (this.isAdmin()) return true;
        if (this.isTecnico() && elemento === 'tareas') return true;
        return false;
    },

    init() {
        document.getElementById('loginScreen').classList.add('visible');
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
        const loginScreen = document.getElementById('loginScreen');
        loginScreen.classList.add('visible');
        document.getElementById('registerScreen').classList.remove('visible');
        document.querySelector('.app-container').classList.add('hidden');
        document.querySelector('.app-container').classList.remove('visible');
    },

    mostrarRegistro() {
        const loginScreen = document.getElementById('loginScreen');
        loginScreen.classList.remove('visible');
        const registerScreen = document.getElementById('registerScreen');
        registerScreen.classList.add('visible');
    },

    mostrarApp() {
        const loginScreen = document.getElementById('loginScreen');
        loginScreen.classList.remove('visible');
        document.getElementById('registerScreen').classList.remove('visible');
        const appContainer = document.querySelector('.app-container');
        appContainer.classList.remove('hidden');
        appContainer.classList.add('visible');
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

        this.aplicarPermisos();
    },

    aplicarPermisos() {
        const isAdmin = this.isAdmin();
        const isTecnico = this.isTecnico();

        document.querySelectorAll('.btn-admin').forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });

        document.querySelectorAll('.btn-crear').forEach(el => {
            el.style.display = (isAdmin || isTecnico) ? '' : 'none';
        });

        document.querySelectorAll('.btn-editar').forEach(el => {
            el.style.display = (isAdmin || isTecnico) ? '' : 'none';
        });

        document.querySelectorAll('.btn-eliminar').forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });

        document.querySelectorAll('.seccion-admin').forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });
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