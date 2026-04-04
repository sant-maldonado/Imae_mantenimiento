const modUsuarios = {
    init() {
        this.render();
        setInterval(() => this.render(), 5000);
    },
    
    render() {
        const grid = document.getElementById('usuariosGrid');
        if (!grid) return;
        
        const usuarios = storage.getUsuarios();
        
        if (usuarios.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h3 class="empty-state-title">No hay usuarios</h3>
                    <p class="empty-state-text">Registra tu primer usuario</p>
                </div>
            `;
            return;
        }
        
        let cardsHtml = '';
        
        usuarios.forEach(usuario => {
            const rolLabel = {
                admin: 'Administrador',
                tecnico: 'Técnico',
                supervisor: 'Supervisor'
            };
            
            const actionsHtml = auth.isAdmin() ? `
                <div class="entity-card-footer">
                    <button class="btn btn-sm btn-secondary" onclick="modUsuarios.view('${usuario.id}')">Ver</button>
                    <button class="btn btn-sm btn-primary" onclick="modUsuarios.edit('${usuario.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="modUsuarios.cambiarRol('${usuario.id}')">Cambiar Rol</button>
                </div>
            ` : '';
            
            const cardHtml = `
                <div class="entity-card">
                    <div class="entity-card-header">
                        <div class="entity-card-title">${usuario.nombre} ${usuario.apellido}</div>
                        <span class="badge badge-${usuario.rol === 'admin' ? 'primary' : usuario.rol === 'supervisor' ? 'warning' : 'secondary'}">${rolLabel[usuario.rol] || usuario.rol}</span>
                    </div>
                    <div class="entity-card-body">
                        <div class="entity-card-info">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${usuario.email}</span>
                        </div>
                        <div class="entity-card-info">
                            <span class="info-label">Estado:</span>
                            <span class="info-value">${usuario.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                        <div class="entity-card-info">
                            <span class="info-label">Último login:</span>
                            <span class="info-value">${usuario.ultimo_login ? new Date(usuario.ultimo_login).toLocaleDateString() : 'Nunca'}</span>
                        </div>
                    </div>
                    ${actionsHtml}
                </div>
            `;
            
            cardsHtml += cardHtml;
        });
        
        grid.innerHTML = cardsHtml;
    },

    view(id) {
        const usuario = storage.getUsuarios().find(u => u.id === id);
        if (!usuario) return;
        
        const rolLabel = {
            admin: 'Administrador',
            tecnico: 'Técnico',
            supervisor: 'Supervisor'
        };
        
        ui.showModal('Ver Usuario', `
            <div class="view-details">
                <div class="view-detail-item">
                    <span class="view-label">ID:</span>
                    <span class="view-value">${usuario.id}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">Nombre:</span>
                    <span class="view-value">${usuario.nombre} ${usuario.apellido}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">Email:</span>
                    <span class="view-value">${usuario.email}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">Rol:</span>
                    <span class="view-value">${rolLabel[usuario.rol] || usuario.rol}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">Estado:</span>
                    <span class="view-value">${usuario.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">Último Login:</span>
                    <span class="view-value">${usuario.ultimo_login ? new Date(usuario.ultimo_login).toLocaleString() : 'Nunca'}</span>
                </div>
                <div class="view-detail-item">
                    <span class="view-label">Fecha de Creación:</span>
                    <span class="view-value">${usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleString() : 'N/A'}</span>
                </div>
            </div>
        `, '<button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>');
    },

    edit(id) {
        const usuario = storage.getUsuarios().find(u => u.id === id);
        if (!usuario) return;
        
        ui.showModal('Editar Usuario', `
            <form id="editUsuarioForm">
                <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-input" id="editNombre" value="${usuario.nombre}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Apellido</label>
                    <input type="text" class="form-input" id="editApellido" value="${usuario.apellido}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="editEmail" value="${usuario.email}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nueva Contraseña (dejar vacío para mantener)</label>
                    <input type="password" class="form-input" id="editPassword" placeholder="Nueva contraseña">
                </div>
                <div class="form-group">
                    <label class="form-label">Activo</label>
                    <input type="checkbox" id="editActivo" ${usuario.activo ? 'checked' : ''}>
                </div>
            </form>
        `, '', async () => {
            const nombre = document.getElementById('editNombre').value;
            const apellido = document.getElementById('editApellido').value;
            const email = document.getElementById('editEmail').value;
            const password = document.getElementById('editPassword').value;
            const activo = document.getElementById('editActivo').checked;
            
            const updates = {
                nombre,
                apellido,
                email,
                activo
            };
            
            if (password) {
                updates.password = password;
            }
            
            await storage.actualizarUsuario({ ...usuario, ...updates });
            this.render();
            ui.showToast('Usuario actualizado', 'success');
        });
    },

    async cambiarRol(id) {
        const usuario = storage.getUsuarios().find(u => u.id === id);
        if (!usuario) return;
        
        ui.showModal('Cambiar Rol', `
            <form id="cambiarRolForm">
                <div class="form-group">
                    <label class="form-label">Usuario: ${usuario.nombre} ${usuario.apellido}</label>
                    <label class="form-label">Rol actual: ${usuario.rol}</label>
                </div>
                <div class="form-group">
                    <label class="form-label">Nuevo Rol</label>
                    <select class="form-select" id="nuevoRol" required>
                        <option value="tecnico" ${usuario.rol === 'tecnico' ? 'selected' : ''}>Técnico</option>
                        <option value="admin" ${usuario.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                        <option value="supervisor" ${usuario.rol === 'supervisor' ? 'selected' : ''}>Supervisor</option>
                    </select>
                </div>
            </form>
        `, '', async () => {
            const nuevoRol = document.getElementById('nuevoRol').value;
            
            await storage.actualizarUsuario({ ...usuario, rol: nuevoRol });
            this.render();
            ui.showToast('Rol actualizado a ' + nuevoRol, 'success');
        });
    }
};
