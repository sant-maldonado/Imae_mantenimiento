// ============================================
// Módulo Laboratorios
// ============================================

const modLaboratorios = {
    // Renderizar lista de laboratorios
    render() {
        const grid = document.getElementById('laboratoriosGrid');
        if (!grid) return;
        
        // Filtrar por activo (soporta tanto 'estado: activo' como 'activo: true')
        const laboratorios = storage.getLaboratorios().filter(l => l.estado === 'activo' || l.activo === true);
        
        if (laboratorios.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏭</div>
                    <h3 class="empty-state-title">No hay laboratorios</h3>
                    <p class="empty-state-text">Crea tu primer laboratorio para comenzar</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
        laboratorios.forEach(lab => {
            const card = document.createElement('div');
            card.className = 'entity-card';
            card.innerHTML = ui.createLaboratorioCard(lab);
            
            const actions = document.createElement('div');
            actions.className = 'entity-card-footer';
            actions.innerHTML = `
                <button class="btn btn-sm btn-secondary" onclick="modLaboratorios.view('${lab.id}')">Ver Detalle</button>
                <button class="btn btn-sm btn-primary" onclick="modLaboratorios.edit('${lab.id}')">Editar</button>
            `;
            
            card.appendChild(actions);
            grid.appendChild(card);
        });
    },

    // Ver detalle de laboratorio
    view(id) {
        const lab = storage.getLaboratorios().find(l => l.id === id);
        if (!lab) return;
        
        const equipos = storage.getEquiposByLaboratorio(id);
        const componentesCount = equipos.reduce((acc, eq) => {
            return acc + storage.getComponentesByEquipo(eq.id).length;
        }, 0);
        
        const content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Información General</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Código</span>
                        <span class="detail-value">${lab.codigo}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Nombre</span>
                        <span class="detail-value">${lab.nombre}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Ubicación</span>
                        <span class="detail-value">${lab.ubicacion}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Responsable</span>
                        <span class="detail-value">${lab.responsable}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Estadísticas</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Total Equipos</span>
                        <span class="detail-value">${equipos.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Equipos Operativos</span>
                        <span class="detail-value">${equipos.filter(e => e.estado === 'operativo').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">En Mantenimiento</span>
                        <span class="detail-value">${equipos.filter(e => e.estado === 'mantenimiento').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Componentes</span>
                        <span class="detail-value">${componentesCount}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Equipos del Laboratorio</h4>
                ${equipos.length > 0 ? `
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${equipos.map(e => `
                                <tr>
                                    <td>${e.codigo}</td>
                                    <td>${e.nombre}</td>
                                    <td><span class="badge badge-${e.estado}">${e.estado.replace('_', ' ')}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: var(--text-muted);">No hay equipos registrados</p>'}
            </div>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="ui.closeModal(); modLaboratorios.edit('${id}')">Editar</button>
        `;
        
        ui.showModal(`Laboratorio: ${lab.nombre}`, content, footer);
    },

    // Crear/Editar laboratorio
    edit(id = null) {
        const lab = id ? storage.getLaboratorios().find(l => l.id === id) : new Laboratorio();
        
        const content = `
            <form id="laboratorioForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" class="form-input" name="codigo" value="${lab.codigo}" required placeholder="LAB-XXX">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nombre *</label>
                        <input type="text" class="form-input" name="nombre" value="${lab.nombre}" required placeholder="Nombre del laboratorio">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Ubicación</label>
                    <input type="text" class="form-input" name="ubicacion" value="${lab.ubicacion}" placeholder="Edificio, planta, número de sala">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Responsable</label>
                    <input type="text" class="form-input" name="responsable" value="${lab.responsable}" placeholder="Nombre del responsable">
                </div>
                
                ${id ? `
                <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select class="form-select" name="activo">
                        <option value="true" ${lab.activo ? 'selected' : ''}>Activo</option>
                        <option value="false" ${!lab.activo ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
                ` : ''}
            </form>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="modLaboratorios.save('${id || ''}')">Guardar</button>
        `;
        
        ui.showModal(id ? 'Editar Laboratorio' : 'Nuevo Laboratorio', content, footer);
    },

    // Guardar laboratorio
    async save(id = null) {
        const form = document.getElementById('laboratorioForm');
        if (!form) return;
        
        // Obtener valores directamente de los inputs
        const codigoInput = form.querySelector('input[name="codigo"]');
        const nombreInput = form.querySelector('input[name="nombre"]');
        const ubicacionInput = form.querySelector('input[name="ubicacion"]');
        const responsableInput = form.querySelector('input[name="responsable"]');
        const activoInput = form.querySelector('select[name="activo"]');
        
        const data = {
            codigo: codigoInput ? codigoInput.value : '',
            nombre: nombreInput ? nombreInput.value : '',
            ubicacion: ubicacionInput ? ubicacionInput.value : '',
            responsable: responsableInput ? responsableInput.value : '',
            activo: activoInput ? activoInput.value === 'true' : true
        };
        
        console.log('Datos del formulario:', data);
        
        if (id) {
            const existing = storage.getLaboratorios().find(l => l.id === id);
            data.id = id;
            data.fecha_creacion = existing ? existing.fecha_creacion : new Date().toISOString();
            // Preservar código existente si el nuevo está vacío
            if (!data.codigo || data.codigo === '') {
                data.codigo = existing ? existing.codigo : '';
            }
        }
        
        console.log('Datos a guardar:', data);
        
        const laboratorio = new Laboratorio(data);
        await storage.saveLaboratorio(laboratorio.toJSON());
        
        ui.closeModal();
        ui.showToast(id ? 'Laboratorio actualizado' : 'Laboratorio creado', 'success');
        this.render();
        app.updateDashboard();
    }
};

// Exportar
window.modLaboratorios = modLaboratorios;
