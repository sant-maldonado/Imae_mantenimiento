// ============================================
// Módulo Técnicos
// ============================================

const modTecnicos = {
    // Renderizar lista de técnicos
    render() {
        const grid = document.getElementById('tecnicosGrid');
        if (!grid) return;
        
        const tecnicos = storage.getTecnicos().filter(t => t.estado === 'activo' || t.estado === null || t.estado === undefined || t.activo === true);
        
        if (tecnicos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👨‍🔧</div>
                    <h3 class="empty-state-title">No hay técnicos</h3>
                    <p class="empty-state-text">Registra tu primer técnico</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
        tecnicos.forEach(tecnico => {
            const card = document.createElement('div');
            card.className = 'entity-card';
            card.innerHTML = ui.createTecnicoCard(tecnico);
            
            const actions = document.createElement('div');
            actions.className = 'entity-card-footer';
            actions.innerHTML = `
                <button class="btn btn-sm btn-secondary" onclick="modTecnicos.view('${tecnico.id}')">Ver</button>
                <button class="btn btn-sm btn-primary" onclick="modTecnicos.edit('${tecnico.id}')">Editar</button>
            `;
            
            card.appendChild(actions);
            grid.appendChild(card);
        });
    },

    // Ver detalle de técnico
    view(id) {
        const tecnico = storage.getTecnicos().find(t => t.id === id);
        if (!tecnico) return;
        
        const tareasAsignadas = storage.getTareas().filter(t => 
            t.asignaciones && t.asignaciones.some(a => a.id_tecnico === tecnico.id && a.estado_asignacion === 'activa')
        );
        
        const fotoHTML = tecnico.foto 
            ? `<img src="${tecnico.foto}" alt="${tecnico.nombre}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color);">`
            : `<div style="width: 120px; height: 120px; border-radius: 50%; background: var(--bg-light); display: flex; align-items: center; justify-content: center; border: 3px solid var(--border-color); font-size: 48px;">👨‍🔧</div>`;
        
        const content = `
            <div style="text-align: center; margin-bottom: 20px;">
                ${fotoHTML}
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">Información Personal</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Legajo</span>
                        <span class="detail-value">${tecnico.legajo}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Nombre Completo</span>
                        <span class="detail-value">${tecnico.nombre} ${tecnico.apellido}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${tecnico.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Teléfono</span>
                        <span class="detail-value">${tecnico.telefono}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Especialidad</span>
                        <span class="detail-value">${tecnico.especialidad}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado</span>
                        <span class="detail-value"><span class="badge badge-${tecnico.estado || 'activo'}">${tecnico.estado || 'activo'}</span></span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Estadísticas</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Fecha de Ingreso</span>
                        <span class="detail-value">${utils.formatDate(tecnico.fecha_contratacion)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Horas Trabajadas (Mes)</span>
                        <span class="detail-value">${tecnico.horas_trabajadas_mes || 0} horas</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Tareas Activas (${tareasAsignadas.length})</h4>
                ${tareasAsignadas.length > 0 ? `
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tarea</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tareasAsignadas.map(t => `
                                <tr>
                                    <td>${t.id}</td>
                                    <td>${t.titulo}</td>
                                    <td><span class="badge badge-${t.estado}">${t.estado.replace('_', ' ')}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: var(--text-muted);">No tiene tareas activas</p>'}
            </div>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="ui.closeModal(); modTecnicos.edit('${id}')">Editar</button>
        `;
        
        ui.showModal(`Técnico: ${tecnico.nombre} ${tecnico.apellido}`, content, footer);
    },

    // Crear/Editar técnico
    edit(id = null) {
        const tecnico = id ? storage.getTecnicos().find(t => t.id === id) : new Tecnico();
        
        const content = `
            <form id="tecnicoForm">
                <div class="form-row">
                    <div class="form-group" style="flex: 0 0 100px; text-align: center;">
                        <label class="form-label">Foto</label>
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--bg-light); margin: 0 auto; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 2px solid var(--border-color);" id="fotoPreview">
                            ${tecnico.foto ? `<img src="${tecnico.foto}" style="width: 100%; height: 100%; object-fit: cover;">` : '<span style="font-size: 36px;">👤</span>'}
                        </div>
                        <input type="file" class="form-input" name="foto" accept="image/*" style="margin-top: 8px; font-size: 12px;" onchange="modTecnicos.previewFoto(this)">
                        <input type="hidden" name="foto_base64" id="fotoBase64" value="${tecnico.foto || ''}">
                    </div>
                    <div style="flex: 1;">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Legajo *</label>
                                <input type="text" class="form-input" name="legajo" value="${tecnico.legajo}" required placeholder="TEC-XXX">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Especialidad *</label>
                                <input type="text" class="form-input" name="especialidad" value="${tecnico.especialidad}" required placeholder="Especialidad">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Nombre *</label>
                                <input type="text" class="form-input" name="nombre" value="${tecnico.nombre}" required placeholder="Nombre">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellido *</label>
                                <input type="text" class="form-input" name="apellido" value="${tecnico.apellido}" required placeholder="Apellido">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-input" name="email" value="${tecnico.email}" required placeholder="email@empresa.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono *</label>
                        <input type="tel" class="form-input" name="telefono" value="${tecnico.telefono}" required placeholder="Teléfono">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Fecha de Ingreso</label>
                        <input type="date" class="form-input" name="fecha_contratacion" value="${tecnico.fecha_contratacion || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Horas/Mes</label>
                        <input type="number" class="form-input" name="horas_trabajadas_mes" value="${tecnico.horas_trabajadas_mes}" min="0">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select class="form-select" name="estado">
                        <option value="activo" ${tecnico.estado === 'activo' ? 'selected' : ''}>Activo</option>
                        <option value="licencia" ${tecnico.estado === 'licencia' ? 'selected' : ''}>En Licencia</option>
                        <option value="inactivo" ${tecnico.estado === 'inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            </form>
        `;
        
        const footer = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="modTecnicos.save('${id || ''}')">Guardar</button>
        `;
        
        ui.showModal(id ? 'Editar Técnico' : 'Nuevo Técnico', content, footer);
    },

    // Guardar técnico
    async save(id = null) {
        const form = document.getElementById('tecnicoForm');
        if (!form) return;
        
        // Obtener valores directamente de los inputs para evitar problemas con FormData
        const nombreInput = form.querySelector('input[name="nombre"]');
        const apellidoInput = form.querySelector('input[name="apellido"]');
        const emailInput = form.querySelector('input[name="email"]');
        const telefonoInput = form.querySelector('input[name="telefono"]');
        const especialidadInput = form.querySelector('input[name="especialidad"]');
        const legajoInput = form.querySelector('input[name="legajo"]');
        const fechaContratacionInput = form.querySelector('input[name="fecha_contratacion"]');
        const horasTrabajadasInput = form.querySelector('input[name="horas_trabajadas_mes"]');
        const activoInput = form.querySelector('input[name="activo"]');
        
        const data = {
            nombre: nombreInput ? nombreInput.value : '',
            apellido: apellidoInput ? apellidoInput.value : '',
            email: emailInput ? emailInput.value : '',
            telefono: telefonoInput ? telefonoInput.value : '',
            especialidad: especialidadInput ? especialidadInput.value : '',
            legajo: legajoInput ? legajoInput.value : '',
            fecha_contratacion: fechaContratacionInput ? fechaContratacionInput.value : '',
            horas_trabajadas_mes: horasTrabajadasInput ? parseInt(horasTrabajadasInput.value) || 0 : 0,
            activo: activoInput ? activoInput.checked : true
        };
        
        if (id) {
            const existing = storage.getTecnicos().find(t => t.id === id);
            data.id = id;
            data.activo = existing ? existing.activo : true;
            // Preservar foto existente si no se cargó una nueva
            const fotoBase64Input = form.querySelector('input[name="foto_base64"]');
            if (fotoBase64Input && fotoBase64Input.value && fotoBase64Input.value.startsWith('data:image')) {
                data.foto = fotoBase64Input.value;
            } else {
                data.foto = existing ? existing.foto : '';
            }
        }
        
        // Guardar en el backend
        await storage.saveTecnico(data);
        
        ui.closeModal();
        ui.showToast(id ? 'Técnico actualizado' : 'Técnico creado', 'success');
        this.render();
        app.updateDashboard();
    },
    
    // Preview de foto
    previewFoto(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('fotoPreview');
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                }
                const hiddenInput = document.getElementById('fotoBase64');
                if (hiddenInput) {
                    hiddenInput.value = e.target.result;
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
};

// Exportar
window.modTecnicos = modTecnicos;
