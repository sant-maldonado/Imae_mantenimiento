// ============================================
// Módulo Usuarios
// ============================================

const modUsuarios = {
    async render() {
        const grid = document.getElementById('usuariosGrid');
        if (!grid) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/usuarios', {
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error('Error al cargar usuarios');
            
            const usuarios = await response.json();
            
            if (usuarios.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <h3 class="empty-state-title">No hay usuarios</h3>
                        <p class="empty-state-text">Crea el primer usuario</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = '';
            
            usuarios.forEach(usuario => {
                const card = document.createElement('div');
                card.className = 'entity-card';
                card.innerHTML = `
                    <div class="entity-card-header">
                        <span class="entity-card-code">${usuario.username}</span>
                        <span class="badge badge-${usuario.rol}">${usuario.rol}</span>
                    </div>
                    <div class="entity-card-body">
                        <h3 class="entity-card-title">${usuario.nombre || 'Sin nombre'}</h3>
                        <div class="entity-card-info">
                            <div class="entity-card-info-item">
                                <span class="entity-card-info-icon">📧</span>
                                <span>${usuario.email || 'Sin email'}</span>
                            </div>
                            <div class="entity-card-info-item">
                                <span class="entity-card-info-icon">${usuario.activo ? '✅' : '❌'}</span>
                                <span>${usuario.activo ? 'Activo' : 'Inactivo'}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                const actions = document.createElement('div');
                actions.className = 'entity-card-footer';
                actions.innerHTML = `
                    <button class="btn btn-sm btn-primary" onclick="modUsuarios.edit('${usuario.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="modUsuarios.delete('${usuario.id}')">Eliminar</button>
                `;
                
                card.appendChild(actions);
                grid.appendChild(card);
            });
        } catch (e) {
            ui.showToast('Error: ' + e.message, 'error');
        }
    },

    async save() {
        const usernameInput = document.getElementById('usuarioUsername');
        const passwordInput = document.getElementById('usuarioPassword');
        const nombreInput = document.getElementById('usuarioNombre');
        const emailInput = document.getElementById('usuarioEmail');
        const rolSelect = document.getElementById('usuarioRol');

        const id = document.getElementById('usuarioId').value;
        
        const data = {
            username: usernameInput.value,
            nombre: nombreInput.value,
            email: emailInput.value,
            rol: rolSelect.value
        };
        
        if (passwordInput.value) {
            data.password = passwordInput.value;
        }

        try {
            const url = id ? `http://127.0.0.1:8000/api/usuarios/${id}` : 'http://127.0.0.1:8000/api/auth/register';
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error al guardar');
            }
            
            ui.closeModal();
            ui.showToast(id ? 'Usuario actualizado' : 'Usuario creado', 'success');
            this.render();
        } catch (e) {
            ui.showToast(e.message, 'error');
        }
    },

    async delete(id) {
        ui.confirm('Eliminar Usuario', '¿Estás seguro de eliminar este usuario?', async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || 'Error al eliminar');
                }
                
                ui.showToast('Usuario eliminado', 'success');
                this.render();
            } catch (e) {
                ui.showToast(e.message, 'error');
            }
        });
    },

    edit(id) {
        this.view(id, true);
    },

    async view(id, editMode = false) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/usuarios', {
                credentials: 'include'
            });
            
            const usuarios = await response.json();
            const usuario = usuarios.find(u => u.id === id);
            
            if (!usuario) return;
            
            const isNew = !id || id === 'new';
            
            const content = `
                <input type="hidden" id="usuarioId" value="${id || ''}">
                <div class="form-group">
                    <label>Usuario</label>
                    <input type="text" id="usuarioUsername" class="form-input" value="${usuario.username || ''}" ${!isNew ? 'disabled' : ''} required>
                </div>
                <div class="form-group">
                    <label>Contraseña ${isNew ? '*' : '(dejar vacío para mantener)'}</label>
                    <input type="password" id="usuarioPassword" class="form-input" ${isNew ? 'required' : ''}>
                </div>
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" id="usuarioNombre" class="form-input" value="${usuario.nombre || ''}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="usuarioEmail" class="form-input" value="${usuario.email || ''}">
                </div>
                <div class="form-group">
                    <label>Rol</label>
                    <select id="usuarioRol" class="form-select">
                        <option value="normal" ${usuario.rol === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="tecnico" ${usuario.rol === 'tecnico' ? 'selected' : ''}>Técnico</option>
                        <option value="admin" ${usuario.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
            `;
            
            const footer = `
                <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="modUsuarios.save()">Guardar</button>
            `;
            
            ui.showModal(isNew ? 'Nuevo Usuario' : 'Editar Usuario', content, footer);
        } catch (e) {
            ui.showToast('Error: ' + e.message, 'error');
        }
    }
};

window.modUsuarios = modUsuarios;