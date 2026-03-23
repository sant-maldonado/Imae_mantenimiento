// ============================================
// UI Components - Componentes de Interfaz
// ============================================

const ui = {
    // Mostrar modal
    showModal(title, content, footer = '') {
        const container = document.getElementById('modalContainer');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalFooter = document.getElementById('modalFooter');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalFooter.innerHTML = footer;
        
        container.classList.add('active');
    },

    // Cerrar modal
    closeModal() {
        const container = document.getElementById('modalContainer');
        container.classList.remove('active');
    },

    // Mostrar toast
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    },

    // Confirm dialog
    confirm(title, message, onConfirm) {
        const content = `
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${message}</p>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
            <button class="btn btn-danger" id="confirmBtn">Confirmar</button>
        `;
        
        this.showModal(title, content, footer);
        
        document.getElementById('confirmBtn').addEventListener('click', () => {
            onConfirm();
            this.closeModal();
        });
    },

    // Crear badge
    createBadge(text, type = 'default') {
        const badge = document.createElement('span');
        badge.className = `badge badge-${type}`;
        badge.textContent = text;
        return badge;
    },

    // Crear card de entidad
    createEntityCard(entity, type, actions = '') {
        const card = document.createElement('div');
        card.className = 'entity-card';
        
        let content = '';
        
        switch (type) {
            case 'laboratorio':
                content = this.createLaboratorioCard(entity);
                break;
            case 'equipo':
                content = this.createEquipoCard(entity);
                break;
            case 'componente':
                content = this.createComponenteCard(entity);
                break;
            case 'tecnico':
                content = this.createTecnicoCard(entity);
                break;
            case 'tarea':
                content = this.createTareaCard(entity);
                break;
            default:
                content = '<p>Tipo de entidad desconocido</p>';
        }
        
        card.innerHTML = `
            ${content}
            <div class="entity-card-footer">
                ${actions}
            </div>
        `;
        
        return card;
    },

    createLaboratorioCard(lab) {
        return `
            <div class="entity-card-header">
                <span class="entity-card-code">${lab.codigo}</span>
                <span class="badge ${lab.activo ? 'badge-operativo' : 'badge-dado_baja'}">${lab.activo ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div class="entity-card-body">
                <h3 class="entity-card-title">${lab.nombre}</h3>
                <div class="entity-card-info">
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">📍</span>
                        <span>${lab.ubicacion || 'Sin ubicación'}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">👤</span>
                        <span>${lab.responsable || 'Sin responsable'}</span>
                    </div>
                </div>
            </div>
        `;
    },

    createEquipoCard(equipo) {
        const laboratorio = storage.getLaboratorios().find(l => l.id === equipo.id_laboratorio);
        
        return `
            <div class="entity-card-header">
                <span class="entity-card-code">${equipo.codigo}</span>
                <span class="badge badge-${equipo.estado}">${equipo.estado.replace('_', ' ')}</span>
            </div>
            <div class="entity-card-body">
                <h3 class="entity-card-title">${equipo.nombre}</h3>
                <div class="entity-card-info">
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">🏭</span>
                        <span>${laboratorio ? laboratorio.nombre : 'Sin laboratorio'}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">🏷️</span>
                        <span>${equipo.marca} ${equipo.modelo}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">📅</span>
                        <span>Próximo mant: ${utils.formatDate(equipo.proximo_mantenimiento)}</span>
                    </div>
                </div>
            </div>
        `;
    },

    createComponenteCard(componente) {
        const equipo = storage.getEquipos().find(e => e.id === componente.id_equipo);
        
        return `
            <div class="entity-card-header">
                <span class="entity-card-code">${componente.codigo}</span>
                <span class="badge badge-${componente.estado}">${componente.estado}</span>
            </div>
            <div class="entity-card-body">
                <h3 class="entity-card-title">${componente.nombre}</h3>
                <div class="entity-card-info">
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">⚙️</span>
                        <span>${equipo ? equipo.nombre : 'Sin equipo'}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">🔧</span>
                        <span>Tipo: ${componente.tipo}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">⏱️</span>
                        <span>Vida útil: ${componente.vida_util_meses} meses</span>
                    </div>
                </div>
            </div>
        `;
    },

    createTecnicoCard(tecnico) {
        const fotoHTML = tecnico.foto 
            ? `<img src="${tecnico.foto}" alt="${tecnico.nombre}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 12px;">`
            : `<div style="width: 60px; height: 60px; border-radius: 50%; background: var(--bg-light); display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 24px;">👨‍🔧</div>`;
        
        return `
            <div class="entity-card-header">
                <span class="entity-card-code">${tecnico.legajo || 'SIN LEGAJO'}</span>
                <span class="badge badge-${tecnico.estado}">${tecnico.estado}</span>
            </div>
            <div class="entity-card-body">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    ${fotoHTML}
                    <div>
                        <h3 class="entity-card-title" style="margin: 0;">${tecnico.nombre} ${tecnico.apellido}</h3>
                    </div>
                </div>
                <div class="entity-card-info">
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">📧</span>
                        <span>${tecnico.email}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">📱</span>
                        <span>${tecnico.telefono}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">🔧</span>
                        <span>Especialidad: ${tecnico.especialidad}</span>
                    </div>
                </div>
            </div>
        `;
    },

    createTareaCard(tarea) {
        const equipo = storage.getEquipos().find(e => e.id === tarea.id_equipo);
        
        return `
            <div class="entity-card-header">
                <span class="entity-card-code">${tarea.id}</span>
                <span class="badge badge-${tarea.prioridad}">${tarea.prioridad}</span>
            </div>
            <div class="entity-card-body">
                <h3 class="entity-card-title">${tarea.titulo}</h3>
                <div class="entity-card-info">
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">⚙️</span>
                        <span>${equipo ? equipo.nombre : 'Sin equipo'}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">🏷️</span>
                        <span class="badge badge-${tarea.tipo_tarea}" style="font-size: 10px;">${tarea.tipo_tarea}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">📅</span>
                        <span>Programada: ${utils.formatDate(tarea.fecha_programada)}</span>
                    </div>
                    <div class="entity-card-info-item">
                        <span class="entity-card-info-icon">⏱️</span>
                        <span>Duración: ${tarea.duracion_estimada_horas}h</span>
                    </div>
                </div>
                <div class="entity-card-stats">
                    <div class="entity-card-stat">
                        <span class="badge badge-${tarea.estado}" style="width: 100%; text-align: center;">${tarea.estado.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // Renderizar tabla
    renderTable(headers, rows, tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        
        // Headers
        thead.innerHTML = headers.map(h => `<th>${h}</th>`).join('');
        
        // Rows
        tbody.innerHTML = rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },
    
    // Mostrar información de contacto
    showContacto() {
        const content = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🏢</div>
                <h3 style="margin-bottom: 20px;">Empresa Desarrolladora</h3>
                <div style="background: var(--bg-light); padding: 20px; border-radius: 10px; text-align: left;">
                    <p style="margin-bottom: 15px; color: #000;">
                        <strong>📧 Email:</strong><br>
                        <a href="mailto:sm.santiagomaldonado@gmail.com" style="color: #000;">sm.santiagomaldonado@gmail.com</a>
                    </p>
                    <p style="margin-bottom: 15px; color: #000;">
                        <strong>📱 Teléfono:</strong><br>
                        <a href="tel:3413502389" style="color: #000;">3413-502389</a>
                    </p>
                </div>
            </div>
        `;
        
        const footer = `<button class="btn btn-primary" onclick="ui.closeModal()">Cerrar</button>`;
        
        this.showModal('Contacto', content, footer);
    }
};

// Exportar
window.ui = ui;
