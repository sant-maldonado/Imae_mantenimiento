// ============================================
// Módulo Componentes
// ============================================

const modComponentes = {
    // Renderizar lista de componentes
    render() {
        const grid = document.getElementById('componentesGrid');
        if (!grid) return;
        
        const equipoFilter = document.getElementById('filtroComponenteEquipo');
        const estadoFilter = document.getElementById('filtroComponenteEstado');
        const searchInput = document.getElementById('buscarComponente');
        
        let componentes = storage.getComponentes();
        
        // Aplicar filtros
        if (equipoFilter && equipoFilter.value) {
            componentes = componentes.filter(c => c.id_equipo === equipoFilter.value);
        }
        
        if (estadoFilter && estadoFilter.value) {
            componentes = componentes.filter(c => c.estado === estadoFilter.value);
        }
        
        if (searchInput && searchInput.value) {
            const search = searchInput.value.toLowerCase();
            componentes = componentes.filter(c => 
                c.nombre.toLowerCase().includes(search) || 
                c.codigo.toLowerCase().includes(search)
            );
        }
        
        // Cargar equipos en filtro
        this.loadEquiposFilter();
        
        if (componentes.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔩</div>
                    <h3 class="empty-state-title">No hay componentes</h3>
                    <p class="empty-state-text">Registra tu primer componente</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
        componentes.forEach(comp => {
            const card = document.createElement('div');
            card.className = 'entity-card';
            card.innerHTML = ui.createComponenteCard(comp);
            
            const actions = document.createElement('div');
            actions.className = 'entity-card-footer';
            actions.innerHTML = `
                <button class="btn btn-sm btn-secondary" onclick="modComponentes.view('${comp.id}')">Ver</button>
                <button class="btn btn-sm btn-primary" onclick="modComponentes.edit('${comp.id}')">Editar</button>
                ${(auth.esAdmin() || auth.esTecnico()) ? `<button class="btn btn-sm btn-danger" onclick="modComponentes.delete('${comp.id}')">Eliminar</button>` : ''}
            `;
            
            card.appendChild(actions);
            grid.appendChild(card);
        });
    },

    // Cargar equipos en filtro
    loadEquiposFilter() {
        const select = document.getElementById('filtroComponenteEquipo');
        if (!select) return;
        
        if (select.options.length <= 1) {
            const equipos = storage.getEquipos().filter(e => e.activo);
            equipos.forEach(eq => {
                const option = document.createElement('option');
                option.value = eq.id;
                option.textContent = `${eq.codigo} - ${eq.nombre}`;
                select.appendChild(option);
            });
        }
    },

    // Ver detalle de componente
    view(id) {
        const componente = storage.getComponentes().find(c => c.id === id);
        if (!componente) return;
        
        const equipo = storage.getEquipos().find(e => e.id === componente.id_equipo);
        
        const content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Información del Componente</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Código</span>
                        <span class="detail-value">${componente.codigo}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Nombre</span>
                        <span class="detail-value">${componente.nombre}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Equipo</span>
                        <span class="detail-value">${equipo ? equipo.nombre : '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tipo</span>
                        <span class="detail-value">${componente.tipo || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Número de Serie</span>
                        <span class="detail-value">${componente.numero_serie || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado</span>
                        <span class="detail-value"><span class="badge badge-${componente.estado}">${componente.estado}</span></span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Vida Útil</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Fecha Instalación</span>
                        <span class="detail-value">${utils.formatDate(componente.fecha_instalacion)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Vida Útil Estimada</span>
                        <span class="detail-value">${componente.vida_util_meses} meses</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Especificaciones</h4>
                <p style="color: var(--text-secondary);">${componente.especificaciones || 'Sin especificaciones'}</p>
            </div>
            
            ${componente.observaciones ? `
            <div class="detail-section">
                <h4 class="detail-section-title">Observaciones</h4>
                <p style="color: var(--text-secondary);">${componente.observaciones}</p>
            </div>
            ` : ''}
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="ui.closeModal(); modComponentes.edit('${id}')">Editar</button>
        `;
        
        ui.showModal(`Componente: ${componente.nombre}`, content, footer);
    },

    // Crear/Editar componente
    edit(id = null) {
        const componente = id ? storage.getComponentes().find(c => c.id === id) : new Componente();
        const equipos = storage.getEquipos().filter(e => e.activo);
        
        const content = `
            <form id="componenteForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" class="form-input" name="codigo" value="${componente.codigo}" required placeholder="COMP-XXX">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Equipo *</label>
                        <select class="form-select" name="id_equipo" required>
                            <option value="">Seleccionar...</option>
                            ${equipos.map(e => `
                                <option value="${e.id}" ${e.id === componente.id_equipo ? 'selected' : ''}>${e.codigo} - ${e.nombre}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-input" name="nombre" value="${componente.nombre}" required placeholder="Nombre del componente">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tipo</label>
                        <input type="text" class="form-input" name="tipo" value="${componente.tipo}" placeholder="Tipo de componente">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Número de Serie</label>
                        <input type="text" class="form-input" name="numero_serie" value="${componente.numero_serie}" placeholder="N° serie">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Fecha Instalación</label>
                        <input type="date" class="form-input" name="fecha_instalacion" value="${componente.fecha_instalacion}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Vida Útil (meses)</label>
                        <input type="number" class="form-input" name="vida_util_meses" value="${componente.vida_util_meses}" min="1">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select class="form-select" name="estado">
                        <option value="funcional" ${componente.estado === 'funcional' ? 'selected' : ''}>Funcional</option>
                        <option value="desgastado" ${componente.estado === 'desgastado' ? 'selected' : ''}>Desgastado</option>
                        <option value="daniado" ${componente.estado === 'daniado' ? 'selected' : ''}>Dañado</option>
                        <option value="reemplazado" ${componente.estado === 'reemplazado' ? 'selected' : ''}>Reemplazado</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Especificaciones</label>
                    <textarea class="form-textarea" name="especificaciones" placeholder="Especificaciones técnicas">${componente.especificaciones}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Observaciones</label>
                    <textarea class="form-textarea" name="observaciones" placeholder="Observaciones">${componente.observaciones}</textarea>
                </div>
            </form>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="modComponentes.save('${id || ''}')">Guardar</button>
        `;
        
        ui.showModal(id ? 'Editar Componente' : 'Nuevo Componente', content, footer);
    },

    // Guardar componente
    async save(id = null) {
        const form = document.getElementById('componenteForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Convertir números
        data.vida_util_meses = parseInt(data.vida_util_meses) || 12;
        
        if (id) {
            const existing = storage.getComponentes().find(c => c.id === id);
            data.id = id;
            data.activo = existing ? existing.activo : true;
        }
        
        const componente = new Componente(data);
        await storage.saveComponente(componente.toJSON());
        
        ui.closeModal();
        ui.showToast(id ? 'Componente actualizado' : 'Componente creado', 'success');
        this.render();
        app.updateDashboard();
    },

    async delete(id) {
        ui.confirm('Eliminar Componente', '¿Estás seguro de eliminar este componente?', async () => {
            try {
                await storage.deleteComponente(id);
                ui.showToast('Componente eliminado', 'success');
                this.render();
                app.updateDashboard();
            } catch (e) {
                ui.showToast('Error al eliminar componente: ' + e.message, 'error');
            }
        });
    }
};

// Exportar
window.modComponentes = modComponentes;
