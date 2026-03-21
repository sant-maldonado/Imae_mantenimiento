// ============================================
// Módulo Tareas
// ============================================

const modTareas = {
    // Convertir horas a días (duración estimada - siempre en días)
    formatDuracion(horas) {
        if (!horas || horas <= 0) return '-';
        const dias = Math.ceil(horas / 8); // 8 horas = 1 día laboral
        if (dias < 1) return '1 día';
        return `${dias} día${dias > 1 ? 's' : ''}`;
    },

    // Convertir horas trabajadas: menos de 8 horas = horas, 8+ = días
    formatHorasTrabajadas(horas) {
        if (!horas || horas <= 0) return '-';
        if (horas < 8) {
            return `${horas} hora${horas > 1 ? 's' : ''}`;
        }
        const dias = Math.round(horas / 8 * 10) / 10;
        return `${dias} día${dias > 1 ? 's' : ''}`;
    },

    // Obtener estado simplificado
    getEstadoSimple(estado) {
        const estados = {
            'pendiente': 'pendiente',
            'asignada': 'pendiente',
            'en_progreso': 'en_progreso',
            'pausada': 'en_progreso',
            'completada': 'completada',
            'cancelada': 'completada'
        };
        return estados[estado] || 'pendiente';
    },

    // Renderizar lista de tareas
    render() {
        const grid = document.getElementById('tareasGrid');
        if (!grid) return;
        
        const tipoFilter = document.getElementById('filtroTareaTipo');
        const prioridadFilter = document.getElementById('filtroTareaPrioridad');
        const estadoFilter = document.getElementById('filtroTareaEstado');
        const searchInput = document.getElementById('buscarTarea');
        
        let tareas = storage.getTareas();
        
        // Aplicar filtros
        if (tipoFilter && tipoFilter.value) {
            tareas = tareas.filter(t => t.tipo_tarea === tipoFilter.value);
        }
        
        if (prioridadFilter && prioridadFilter.value) {
            tareas = tareas.filter(t => t.prioridad === prioridadFilter.value);
        }
        
        if (estadoFilter && estadoFilter.value) {
            tareas = tareas.filter(t => this.getEstadoSimple(t.estado) === estadoFilter.value);
        }
        
        if (searchInput && searchInput.value) {
            const search = searchInput.value.toLowerCase();
            tareas = tareas.filter(t => 
                t.titulo.toLowerCase().includes(search) || 
                t.id.toLowerCase().includes(search)
            );
        }
        
        if (tareas.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3 class="empty-state-title">No hay tareas</h3>
                    <p class="empty-state-text">Crea tu primera tarea de mantenimiento</p>
                </div>
            `;
            return;
        }
        
        // Ordenar por prioridad y fecha
        const prioridadOrden = { critica: 0, alta: 1, media: 2, baja: 3 };
        tareas.sort((a, b) => {
            if (prioridadOrden[a.prioridad] !== prioridadOrden[b.prioridad]) {
                return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
            }
            return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
        });
        
        // Crear tabla de tareas - alineada después del sidebar
        grid.innerHTML = `
            <div style="width: calc(100vw - 350px); overflow-x: auto; margin-left: 0;">
                <table style="width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 13px;">
                    <thead>
                        <tr>
                            <th style="padding: 14px 10px; text-align: left; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 22%;">Tarea</th>
                            <th style="padding: 14px 10px; text-align: left; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 14%;">Equipo</th>
                            <th style="padding: 14px 10px; text-align: left; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 16%;">Laboratorio</th>
                            <th style="padding: 14px 10px; text-align: left; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 14%;">Técnico</th>
                            <th style="padding: 14px 10px; text-align: center; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 8%;">Duración</th>
                            <th style="padding: 14px 10px; text-align: center; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 10%;">Estado</th>
                            <th style="padding: 14px 10px; text-align: center; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 6%;">Fotos</th>
                            <th style="padding: 14px 10px; text-align: center; background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #475569; width: 10%;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tareas.map(tarea => {
                        const equipo = storage.getEquipos().find(e => e.id === tarea.id_equipo);
                        const laboratorio = equipo ? storage.getLaboratorios().find(l => l.id === equipo.id_laboratorio) : null;
                        const asignaciones = tarea.asignaciones || [];
                        const tecnico = asignaciones.length > 0 ? storage.getTecnicos().find(tec => tec.id === asignaciones[0].id_tecnico) : null;
                        const estadoSimple = this.getEstadoSimple(tarea.estado);
                        const estadoLabel = estadoSimple === 'en_progreso' ? 'En prog.' : estadoSimple === 'pendiente' ? 'Pend.' : 'Compl.';
                        const fotos = tarea.fotos || [];
                        
                        return `
                            <tr style="border-bottom: 1px solid #334155; background: #1e293b;">
                                <td style="padding: 12px 10px; color: #f8fafc; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tarea.titulo}</td>
                                <td style="padding: 12px 10px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${equipo ? equipo.nombre : '-'}</td>
                                <td style="padding: 12px 10px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${laboratorio ? laboratorio.nombre : '-'}</td>
                                <td style="padding: 12px 10px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tecnico ? tecnico.nombre.charAt(0) + '. ' + tecnico.apellido : '<span style="color: #64748b;">-</span>'}</td>
                                <td style="padding: 12px 10px; color: #94a3b8; text-align: center;">${this.formatDuracion(tarea.duracion_estimada_horas)}</td>
                                <td style="padding: 12px 10px; text-align: center;"><span class="badge badge-${estadoSimple}" style="font-size: 10px; padding: 3px 8px;">${estadoLabel}</span></td>
                                <td style="padding: 12px 10px; text-align: center; color: #94a3b8;">${fotos.length > 0 ? `<span style="color: #10b981;">${fotos.length}</span>` : '-'}</td>
                                <td style="padding: 12px 10px; text-align: center;">
                                    <button class="btn btn-sm btn-primary" style="padding: 4px 10px; font-size: 11px;" onclick="modTareas.view('${tarea.id}')">Ver</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Ver detalle de tarea
    view(id) {
        const tarea = storage.getTareas().find(t => t.id === id);
        if (!tarea) return;
        
        const equipo = storage.getEquipos().find(e => e.id === tarea.id_equipo);
        const laboratorio = equipo ? storage.getLaboratorios().find(l => l.id === equipo.id_laboratorio) : null;
        const tecnicos = storage.getTecnicos().filter(t => t.activo);
        
        // Obtener técnicos asignados
        const asignaciones = tarea.asignaciones || [];
        const tecnicosAsignados = asignaciones.map(a => {
            const tec = tecnicos.find(t => t.id === a.id_tecnico);
            return tec ? { ...tec, asignacion: a } : null;
        }).filter(Boolean);
        
        // Estado simplificado
        const estadoSimple = this.getEstadoSimple(tarea.estado);
        const estadoLabel = estadoSimple === 'pendiente' ? 'Pendiente' : estadoSimple === 'en_progreso' ? 'En progreso' : 'Completada';
        
        const content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Tarea de Mantenimiento</h4>
                <div class="detail-grid">
                    <div class="detail-item" style="grid-column: span 2;">
                        <span class="detail-label">Título de la Tarea</span>
                        <span class="detail-value" style="font-size: 18px;">${tarea.titulo}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Información Principal</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Equipo</span>
                        <span class="detail-value">${equipo ? equipo.nombre : '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Cliente (Laboratorio)</span>
                        <span class="detail-value">${laboratorio ? laboratorio.nombre : '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Técnico Asignado</span>
                        <span class="detail-value">${tecnicosAsignados.length > 0 ? tecnicosAsignados[0].nombre + ' ' + tecnicosAsignados[0].apellido : 'Sin asignar'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado</span>
                        <span class="detail-value">
                            <span class="badge badge-${estadoSimple === 'pendiente' ? 'pendiente' : estadoSimple === 'en_progreso' ? 'en_progreso' : 'completada'}" style="font-size: 14px; padding: 6px 16px;">
                                ${estadoLabel}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Detalles Adicionales</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Tipo de Tarea</span>
                        <span class="detail-value"><span class="badge badge-${tarea.tipo_tarea}">${tarea.tipo_tarea}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Prioridad</span>
                        <span class="detail-value"><span class="badge badge-${tarea.prioridad}">${tarea.prioridad}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha Programada</span>
                        <span class="detail-value">${utils.formatDate(tarea.fecha_programada)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duración Estimada</span>
                        <span class="detail-value">${this.formatDuracion(tarea.duracion_estimada_horas)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Fotos de la Tarea</h4>
                <div id="fotosContainer">
                    ${(tarea.fotos && tarea.fotos.length > 0) ? `
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                            ${tarea.fotos.map((foto, idx) => `
                                <div style="position: relative; width: 100px; height: 100px;">
                                    <img src="${foto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onclick="window.open('${foto}', '_blank')">
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p style="color: var(--text-muted); margin-bottom: 15px;">No hay fotos adjuntas</p>'}
                </div>
                <input type="file" id="inputFoto" accept="image/*" style="display: none;" onchange="modTareas.subirFoto('${id}', this)">
                <button class="btn btn-sm btn-secondary" onclick="document.getElementById('inputFoto').click()">
                    📷 Subir Foto
                </button>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Descripción</h4>
                <p style="color: var(--text-secondary);">${tarea.descripcion || 'Sin descripción'}</p>
            </div>
            
            ${tecnicosAsignados.length > 0 ? `
            <div class="detail-section">
                <h4 class="detail-section-title">Técnicos Asignados</h4>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Horas Trabajadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tecnicosAsignados.map(ta => `
                            <tr>
                                <td>${ta.nombre} ${ta.apellido}</td>
                                <td>${this.formatHorasTrabajadas(ta.asignacion.horas_trabajadas)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            ${tarea.resultado ? `
            <div class="detail-section">
                <h4 class="detail-section-title">Resultado</h4>
                <p style="color: var(--text-secondary);">${tarea.resultado}</p>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4 class="detail-section-title">Cambiar Estado</h4>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${tarea.estado === 'pendiente' ? `<button class="btn btn-sm btn-primary" onclick="modTareas.cambiarEstado('${id}', 'asignada')">Asignar Técnico</button>` : ''}
                    ${tarea.estado === 'asignada' ? `<button class="btn btn-sm btn-primary" onclick="modTareas.cambiarEstado('${id}', 'en_progreso')">Iniciar Tarea</button>` : ''}
                    ${tarea.estado === 'en_progreso' ? `<button class="btn btn-sm btn-primary" onclick="modTareas.cambiarEstado('${id}', 'completada')">Completar Tarea</button>` : ''}
                    ${tarea.estado === 'pausada' ? `<button class="btn btn-sm btn-primary" onclick="modTareas.cambiarEstado('${id}', 'en_progreso')">Reanudar Tarea</button>` : ''}
                </div>
            </div>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="ui.closeModal(); modTareas.edit('${id}')">Editar Tarea</button>
        `;
        
        ui.showModal(`Tarea: ${tarea.titulo}`, content, footer);
    },

    // Cambiar estado de tarea
    cambiarEstado(id, nuevoEstado) {
        const tarea = storage.getTareas().find(t => t.id === id);
        if (!tarea) return;
        
        const estadoAnterior = tarea.estado;
        tarea.estado = nuevoEstado;
        
        // Registrar fechas
        if (nuevoEstado === 'en_progreso' && !tarea.fecha_inicio_real) {
            tarea.fecha_inicio_real = new Date().toISOString();
        }
        
        if (nuevoEstado === 'completada') {
            tarea.fecha_fin_real = new Date().toISOString();
            // Calcular duración real
            if (tarea.fecha_inicio_real) {
                const inicio = new Date(tarea.fecha_inicio_real);
                const fin = new Date(tarea.fecha_fin_real);
                tarea.duracion_real_horas = (fin - inicio) / 3600000;
            }
        }
        
        storage.saveTarea(tarea);
        ui.closeModal();
        ui.showToast(`Tarea marcada como: ${nuevoEstado.replace('_', ' ')}`, 'success');
        this.render();
        app.updateDashboard();
    },

    // Crear/Editar tarea
    edit(id = null) {
        const tarea = id ? storage.getTareas().find(t => t.id === id) : new Tarea();
        const equipos = storage.getEquipos().filter(e => e.activo && e.estado !== 'dado_baja');
        const tecnicos = storage.getTecnicos().filter(t => t.activo);
        
        const content = `
            <form id="tareaForm">
                <div class="form-group">
                    <label class="form-label">Título *</label>
                    <input type="text" class="form-input" name="titulo" value="${tarea.titulo}" required placeholder="Título de la tarea">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Equipo *</label>
                        <select class="form-select" name="id_equipo" required>
                            <option value="">Seleccionar...</option>
                            ${equipos.map(e => `
                                <option value="${e.id}" ${e.id === tarea.id_equipo ? 'selected' : ''}>${e.codigo} - ${e.nombre}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo de Tarea</label>
                        <select class="form-select" name="tipo_tarea">
                            <option value="preventivo" ${tarea.tipo_tarea === 'preventivo' ? 'selected' : ''}>Preventivo</option>
                            <option value="correctivo" ${tarea.tipo_tarea === 'correctivo' ? 'selected' : ''}>Correctivo</option>
                            <option value="predictivo" ${tarea.tipo_tarea === 'predictivo' ? 'selected' : ''}>Predictivo</option>
                            <option value="emergencia" ${tarea.tipo_tarea === 'emergencia' ? 'selected' : ''}>Emergencia</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Prioridad</label>
                        <select class="form-select" name="prioridad">
                            <option value="baja" ${tarea.prioridad === 'baja' ? 'selected' : ''}>Baja</option>
                            <option value="media" ${tarea.prioridad === 'media' ? 'selected' : ''}>Media</option>
                            <option value="alta" ${tarea.prioridad === 'alta' ? 'selected' : ''}>Alta</option>
                            <option value="critica" ${tarea.prioridad === 'critica' ? 'selected' : ''}>Crítica</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha Programada</label>
                        <input type="date" class="form-input" name="fecha_programada" value="${tarea.fecha_programada}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Duración Estimada (horas)</label>
                        <input type="number" class="form-input" name="duracion_estimada_horas" value="${tarea.duracion_estimada_horas}" min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" name="estado">
                            <option value="pendiente" ${tarea.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="asignada" ${tarea.estado === 'asignada' ? 'selected' : ''}>Asignada</option>
                            <option value="en_progreso" ${tarea.estado === 'en_progreso' ? 'selected' : ''}>En Progreso</option>
                            <option value="pausada" ${tarea.estado === 'pausada' ? 'selected' : ''}>Pausada</option>
                            <option value="completada" ${tarea.estado === 'completada' ? 'selected' : ''}>Completada</option>
                            <option value="cancelada" ${tarea.estado === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-textarea" name="descripcion" placeholder="Descripción de la tarea">${tarea.descripcion}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Materiales Requeridos</label>
                    <textarea class="form-textarea" name="materiales_requeridos" placeholder="Lista de materiales">${tarea.materiales_requeridos}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Herramientas Requeridas</label>
                    <textarea class="form-textarea" name="herramientas_requeridas" placeholder="Lista de herramientas">${tarea.herramientas_requeridas}</textarea>
                </div>
                
                ${id ? `
                <div class="form-group">
                    <label class="form-label">Resultado</label>
                    <textarea class="form-textarea" name="resultado" placeholder="Resultado de la tarea">${tarea.resultado}</textarea>
                </div>
                ` : ''}
                
                <div class="form-group">
                    <label class="form-label">Asignar Técnicos</label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${tecnicos.map(tec => {
                            const yaAsignado = tarea.asignaciones && tarea.asignaciones.some(a => a.id_tecnico === tec.id);
                            return `
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" name="asignados" value="${tec.id}" ${yaAsignado ? 'checked' : ''}>
                                    <span>${tec.nombre} ${tec.apellido} (${tec.especialidad})</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            </form>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="modTareas.save('${id || ''}')">Guardar</button>
        `;
        
        ui.showModal(id ? 'Editar Tarea' : 'Nueva Tarea', content, footer);
    },

    // Guardar tarea
    save(id = null) {
        const form = document.getElementById('tareaForm');
        if (!form) return;
        
        // Obtener valores directamente de los inputs para evitar problemas con FormData
        const tituloInput = form.querySelector('input[name="titulo"]');
        const equipoSelect = form.querySelector('select[name="id_equipo"]');
        const tipoTareaSelect = form.querySelector('select[name="tipo_tarea"]');
        const prioridadSelect = form.querySelector('select[name="prioridad"]');
        const fechaProgramadaInput = form.querySelector('input[name="fecha_programada"]');
        const duracionInput = form.querySelector('input[name="duracion_estimada_horas"]');
        const estadoSelect = form.querySelector('select[name="estado"]');
        const descripcionInput = form.querySelector('textarea[name="descripcion"]');
        
        const data = {
            titulo: tituloInput ? tituloInput.value : '',
            id_equipo: equipoSelect ? equipoSelect.value : '',
            tipo_tarea: tipoTareaSelect ? tipoTareaSelect.value : 'preventivo',
            prioridad: prioridadSelect ? prioridadSelect.value : 'media',
            fecha_programada: fechaProgramadaInput ? fechaProgramadaInput.value : '',
            duracion_estimada_horas: duracionInput ? parseInt(duracionInput.value) || 1 : 1,
            estado: estadoSelect ? estadoSelect.value : 'pendiente',
            descripcion: descripcionInput ? descripcionInput.value : ''
        };
        
        // Obtener técnicos marcados
        const checkboxes = form.querySelectorAll('input[name="asignados"]:checked');
        const tecnicosSeleccionados = Array.from(checkboxes).map(cb => cb.value);
        
        if (id) {
            const existing = storage.getTareas().find(t => t.id === id);
            data.id = id;
            data.fecha_creacion = existing ? existing.fecha_creacion : new Date().toISOString();
            
            // Mantener asignaciones existentes y agregar nuevas
            data.asignaciones = existing ? [...existing.asignaciones] : [];
            
            tecnicosSeleccionados.forEach(tecId => {
                const yaExiste = data.asignaciones.some(a => a.id_tecnico === tecId);
                if (!yaExiste) {
                    data.asignaciones.push({
                        id: 'ASIG-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
                        id_tarea: id,
                        id_tecnico: tecId,
                        rol: 'responsable',
                        fecha_asignacion: new Date().toISOString(),
                        fecha_aceptacion: '',
                        fecha_liberacion: '',
                        horas_trabajadas: 0,
                        estado_asignacion: 'activa'
                    });
                }
            });
        } else {
            // Nuevas asignaciones
            data.asignaciones = tecnicosSeleccionados.map(tecId => ({
                id: 'ASIG-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
                id_tarea: '',
                id_tecnico: tecId,
                rol: 'responsable',
                fecha_asignacion: new Date().toISOString(),
                fecha_aceptacion: '',
                fecha_liberacion: '',
                horas_trabajadas: 0,
                estado_asignacion: 'activa'
            }));
        }
        
        const tarea = new Tarea(data);
        storage.saveTarea(tarea.toJSON());
        
        ui.closeModal();
        ui.showToast(id ? 'Tarea actualizada' : 'Tarea creada', 'success');
        this.render();
        app.updateDashboard();
    },

    // Subir foto a tarea
    subirFoto(id, input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const tarea = storage.getTareas().find(t => t.id === id);
            if (!tarea) return;
            
            if (!tarea.fotos) {
                tarea.fotos = [];
            }
            tarea.fotos.push(e.target.result);
            storage.saveTarea(tarea);
            
            ui.showToast('Foto subida correctamente', 'success');
            
            // Recargar la vista
            this.view(id);
        };
        reader.readAsDataURL(file);
        
        // Limpiar el input
        input.value = '';
    }
};

// Exportar
window.modTareas = modTareas;
