// Servicio de autenticación
class AuthService {
    constructor() {
        this.usuario = null;
    }

    async login(username, password) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error en login');
            }
            
            this.usuario = data.usuario;
            this.mostrarInterfaz();
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await fetch('http://127.0.0.1:8000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {}
        
        this.usuario = null;
        this.mostrarLogin();
    }

    async verificarSesion() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
                credentials: 'include'
            });
            
            if (response.ok) {
                this.usuario = await response.json();
                this.mostrarInterfaz();
            } else {
                this.mostrarLogin();
            }
        } catch (e) {
            this.mostrarLogin();
        }
    }

    esAdmin() {
        return this.usuario && this.usuario.rol === 'admin';
    }

    esTecnico() {
        return this.usuario && this.usuario.rol === 'tecnico';
    }

    mostrarLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    mostrarInterfaz() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        this.actualizarUI();
    }

    actualizarUI() {
        const navUsuarios = document.getElementById('navUsuarios');
        const btnUsers = document.getElementById('btnUsuarios');
        
        if (this.usuario) {
            // Mostrar sección de usuarios solo para admin
            if (navUsuarios) {
                navUsuarios.style.display = this.esAdmin() ? 'block' : 'none';
            }
            
            // Actualizar botones según permisos
            this.actualizarBotonesPermisos();
        }
    }

    actualizarBotonesPermisos() {
        // Los botones de eliminar se manejan en cada módulo
        // Aquí podemos modificar la visibilidad de botones específicos
        const btnsNew = document.querySelectorAll('[id^="btnNuevo"]');
        btnsNew.forEach(btn => {
            if (btn.id !== 'btnNuevoLaboratorio') {
                btn.style.display = (this.esAdmin() || this.esTecnico()) ? 'inline-block' : 'none';
            }
        });
    }
}

const auth = new AuthService();