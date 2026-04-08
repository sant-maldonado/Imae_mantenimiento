// ============================================
// Módulo Equipos
// ============================================

const modEquipos = {
    // Renderizar lista de equipos
    render() {
        const grid = document.getElementById('equiposGrid');
        if (!grid) return;
        
        const laboratorioFilter = document.getElementById('filtroLaboratorio');
        const estadoFilter = document.getElementById('filtroEstado');
        const searchInput = document.getElementById('buscarEquipo');
        
        let equipos = storage.getEquipos().filter(e => (e.estado || 'operativo') !== 'dado_baja' && (e.estado || 'operativo') !== 'inactivo' && e.activo !== false);
        
        // Aplicar filtros
        if (laboratorioFilter && laboratorioFilter.value) {
            equipos = equipos.filter(e => e.id_laboratorio === laboratorioFilter.value);
        }
        
        if (estadoFilter && estadoFilter.value) {
            equipos = equipos.filter(e => e.estado === estadoFilter.value);
        }
        
        if (searchInput && searchInput.value) {
            const search = searchInput.value.toLowerCase();
            equipos = equipos.filter(e => 
                e.nombre.toLowerCase().includes(search) || 
                e.codigo.toLowerCase().includes(search)
            );
        }
        
        // Cargar laboratorios en filtro
        this.loadLaboratoriosFilter();
        
        if (equipos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚙️</div>
                    <h3 class="empty-state-title">No hay equipos</h3>
                    <p class="empty-state-text">Registra tu primer equipo</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
        equipos.forEach(equipo => {
            const card = document.createElement('div');
            card.className = 'entity-card';
            card.innerHTML = ui.createEquipoCard(equipo);
            
            const actions = document.createElement('div');
            actions.className = 'entity-card-footer';
            actions.innerHTML = `
                <button class="btn btn-sm btn-secondary" onclick="modEquipos.view('${equipo.id}')">Ver</button>
                <button class="btn btn-sm btn-primary" onclick="modEquipos.edit('${equipo.id}')">Editar</button>
                ${(auth.esAdmin() || auth.esTecnico()) ? `<button class="btn btn-sm btn-danger" onclick="modEquipos.delete('${equipo.id}')">Eliminar</button>` : ''}
            `;
            
            card.appendChild(actions);
            grid.appendChild(card);
        });
    },

    // Cargar laboratorios en filtro
    loadLaboratoriosFilter() {
        const select = document.getElementById('filtroLaboratorio');
        if (!select) return;
        
        // Solo actualizar si no tiene opciones
        if (select.options.length <= 1) {
            const laboratorios = storage.getLaboratorios().filter(l => l.activo);
            laboratorios.forEach(lab => {
                const option = document.createElement('option');
                option.value = lab.id;
                option.textContent = lab.nombre;
                select.appendChild(option);
            });
        }
    },

    // Ver detalle de equipo
    view(id) {
        const equipo = storage.getEquipos().find(e => e.id === id);
        if (!equipo) return;
        
        const laboratorio = storage.getLaboratorios().find(l => l.id === equipo.id_laboratorio);
        const componentes = storage.getComponentesByEquipo(id);
        const tareas = storage.getTareasByEquipo(id);
        
        const content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Información del Equipo</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Código</span>
                        <span class="detail-value">${equipo.codigo}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Nombre</span>
                        <span class="detail-value">${equipo.nombre}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Laboratorio</span>
                        <span class="detail-value">${laboratorio ? laboratorio.nombre : '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Marca/Modelo</span>
                        <span class="detail-value">${equipo.marca} ${equipo.modelo}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Número de Serie</span>
                        <span class="detail-value">${equipo.numero_serie || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado</span>
                        <span class="detail-value"><span class="badge badge-${equipo.estado}">${equipo.estado.replace('_', ' ')}</span></span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Fechas de Mantenimiento</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Último Mantenimiento</span>
                        <span class="detail-value">${utils.formatDate(equipo.fecha_ultimo_mantenimiento)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Próximo Mantenimiento</span>
                        <span class="detail-value">${utils.formatDate(equipo.fecha_proximo_mantenimiento)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Componentes (${componentes.length})</h4>
                ${componentes.length > 0 ? `
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${componentes.map(c => `
                                <tr>
                                    <td>${c.nombre}</td>
                                    <td><span class="badge badge-${c.estado}">${c.estado}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: var(--text-muted);">No hay componentes</p>'}
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Tareas de Mantenimiento (${tareas.length})</h4>
                ${tareas.length > 0 ? `
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tareas.map(t => `
                                <tr>
                                    <td>${t.id}</td>
                                    <td><span class="badge badge-${t.tipo_tarea}">${t.tipo_tarea}</span></td>
                                    <td><span class="badge badge-${t.prioridad}">${t.prioridad}</span></td>
                                    <td><span class="badge badge-${t.estado}">${t.estado.replace('_', ' ')}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: var(--text-muted);">No hay tareas</p>'}
            </div>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="ui.closeModal(); modEquipos.edit('${id}')">Editar</button>
        `;
        
        ui.showModal(`Equipo: ${equipo.nombre}`, content, footer);
    },

    // Crear/Editar equipo
    edit(id = null) {
        const equipo = id ? storage.getEquipos().find(e => e.id === id) : new Equipo();
        const laboratorios = storage.getLaboratorios().filter(l => l.activo);
        
        const content = `
            <form id="equipoForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" class="form-input" name="codigo" value="${equipo.codigo}" required placeholder="EQ-XXX">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Laboratorio *</label>
                        <select class="form-select" name="id_laboratorio" required>
                            <option value="">Seleccionar...</option>
                            ${laboratorios.map(l => `
                                <option value="${l.id}" ${l.id === equipo.id_laboratorio ? 'selected' : ''}>${l.nombre}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-input" name="nombre" value="${equipo.nombre}" required placeholder="Nombre del equipo">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tipo</label>
                        <input type="text" class="form-input" name="tipo" value="${equipo.tipo}" placeholder="Tipo de equipo">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Marca</label>
                        <input type="text" class="form-input" name="marca" value="${equipo.marca}" placeholder="Marca">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Modelo</label>
                        <input type="text" class="form-input" name="modelo" value="${equipo.modelo}" placeholder="Modelo">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Número de Serie</label>
                        <input type="text" class="form-input" name="numero_serie" value="${equipo.numero_serie}" placeholder="N° serie">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Último Mantenimiento</label>
                        <input type="date" class="form-input" name="ultimo_mantenimiento" value="${equipo.fecha_ultimo_mantenimiento || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Próximo Mantenimiento</label>
                        <input type="date" class="form-input" name="proximo_mantenimiento" value="${equipo.fecha_proximo_mantenimiento || ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" name="estado">
                            <option value="operativo" ${equipo.estado === 'operativo' ? 'selected' : ''}>Operativo</option>
                            <option value="mantenimiento" ${equipo.estado === 'mantenimiento' ? 'selected' : ''}>En Mantenimiento</option>
                            <option value="fuera_servicio" ${equipo.estado === 'fuera_servicio' ? 'selected' : ''}>Fuera de Servicio</option>
                            <option value="dado_baja" ${equipo.estado === 'dado_baja' ? 'selected' : ''}>Dado de Baja</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prioridad Mantenimiento</label>
                        <select class="form-select" name="prioridad_mantenimiento">
                            <option value="1" ${equipo.prioridad_mantenimiento == 1 ? 'selected' : ''}>1 - Baja</option>
                            <option value="2" ${equipo.prioridad_mantenimiento == 2 ? 'selected' : ''}>2 - Media</option>
                            <option value="3" ${equipo.prioridad_mantenimiento == 3 ? 'selected' : ''}>3 - Alta</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Observaciones</label>
                    <textarea class="form-textarea" name="observaciones" placeholder="Observaciones adicionales">${equipo.observaciones}</textarea>
                </div>
            </form>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="modEquipos.save('${id || ''}')">Guardar</button>
        `;
        
        ui.showModal(id ? 'Editar Equipo' : 'Nuevo Equipo', content, footer);
    },

    // Guardar equipo
    async save(id = null) {
        const form = document.getElementById('equipoForm');
        if (!form) return;
        
        // Obtener valores directamente de los inputs para evitar problemas con FormData
        const nombreInput = form.querySelector('input[name="nombre"]');
        const codigoInput = form.querySelector('input[name="codigo"]');
        const tipoInput = form.querySelector('input[name="tipo"]');
        const marcaInput = form.querySelector('input[name="marca"]');
        const modeloInput = form.querySelector('input[name="modelo"]');
        const serieInput = form.querySelector('input[name="serie"]');
        const numeroSerieInput = form.querySelector('input[name="numero_serie"]');
        const laboratorioSelect = form.querySelector('select[name="id_laboratorio"]');
        const ultimoMantenimientoInput = form.querySelector('input[name="ultimo_mantenimiento"]');
        const proximoMantenimientoInput = form.querySelector('input[name="proximo_mantenimiento"]');
        const estadoSelect = form.querySelector('select[name="estado"]');
        const prioridadSelect = form.querySelector('select[name="prioridad_mantenimiento"]');
        const observacionesInput = form.querySelector('textarea[name="observaciones"]');
        
        const data = {
            nombre: nombreInput ? nombreInput.value : '',
            codigo: codigoInput ? codigoInput.value : '',
            tipo: tipoInput ? tipoInput.value : '',
            marca: marcaInput ? marcaInput.value : '',
            modelo: modeloInput ? modeloInput.value : '',
            serie: serieInput ? serieInput.value : '',
            numero_serie: numeroSerieInput ? numeroSerieInput.value : '',
            id_laboratorio: laboratorioSelect ? laboratorioSelect.value : '',
            ultimo_mantenimiento: ultimoMantenimientoInput ? ultimoMantenimientoInput.value : '',
            proximo_mantenimiento: proximoMantenimientoInput ? proximoMantenimientoInput.value : '',
            estado: estadoSelect ? estadoSelect.value : 'operativo',
            prioridad_mantenimiento: prioridadSelect ? parseInt(prioridadSelect.value) : 1,
            observaciones: observacionesInput ? observacionesInput.value : ''
        };
        
        if (id) {
            const existing = storage.getEquipos().find(e => e.id === id);
            data.id = id;
            data.fecha_adquisicion = existing ? existing.fecha_adquisicion : '';
            data.fecha_instalacion = existing ? existing.fecha_instalacion : '';
            data.activo = existing ? existing.activo : true;
        }
        
        const equipo = new Equipo(data);
        await storage.saveEquipo(equipo.toJSON());
        
        ui.closeModal();
        ui.showToast(id ? 'Equipo actualizado' : 'Equipo creado', 'success');
        this.render();
        app.updateDashboard();
    },

    async delete(id) {
        ui.confirm('Eliminar Equipo', '¿Estás seguro de eliminar este equipo?', async () => {
            try {
                await storage.deleteEquipo(id);
                ui.showToast('Equipo eliminado', 'success');
                this.render();
                app.updateDashboard();
            } catch (e) {
                ui.showToast('Error al eliminar equipo: ' + e.message, 'error');
            }
        });
    }
};

// Exportar
window.modEquipos = modEquipos;
