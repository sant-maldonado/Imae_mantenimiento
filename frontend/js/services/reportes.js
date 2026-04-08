// ============================================
// Reportes - Generación de Reportes
// ============================================

const reportes = {
    // Generar reporte de equipos
    generarReporteEquipos() {
        const laboratorios = storage.getLaboratorios().filter(l => l.activo);
        const equipos = storage.getEquipos().filter(e => e.activo);
        
        let content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Resumen de Equipos</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Total Equipos</span>
                        <span class="detail-value">${equipos.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Operativos</span>
                        <span class="detail-value" style="color: #10b981;">${equipos.filter(e => e.estado === 'operativo').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">En Mantenimiento</span>
                        <span class="detail-value" style="color: #3b82f6;">${equipos.filter(e => e.estado === 'mantenimiento').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fuera de Servicio</span>
                        <span class="detail-value" style="color: #ef4444;">${equipos.filter(e => e.estado === 'fuera_servicio').length}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Equipos por Laboratorio</h4>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Laboratorio</th>
                            <th>Total</th>
                            <th>Operativos</th>
                            <th>Mant.</th>
                            <th>Fuera Sv.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${laboratorios.map(lab => {
                            const labEquipos = equipos.filter(e => e.id_laboratorio === lab.id);
                            return `
                                <tr>
                                    <td>${lab.nombre}</td>
                                    <td>${labEquipos.length}</td>
                                    <td>${labEquipos.filter(e => e.estado === 'operativo').length}</td>
                                    <td>${labEquipos.filter(e => e.estado === 'mantenimiento').length}</td>
                                    <td>${labEquipos.filter(e => e.estado === 'fuera_servicio').length}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Lista de Equipos</h4>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Marca/Modelo</th>
                            <th>Estado</th>
                            <th>Próximo Mant.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${equipos.map(e => `
                            <tr>
                                <td>${e.codigo}</td>
                                <td>${e.nombre}</td>
                                <td>${e.marca} ${e.modelo}</td>
                                <td><span class="badge badge-${e.estado}">${e.estado.replace('_', ' ')}</span></td>
                                <td>${utils.formatDate(e.fecha_proximo_mantenimiento)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        ui.showModal('Reporte de Equipos', content, `<button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>`);
    },

    // Generar reporte de tareas
    generarReporteTareas() {
        const tareas = storage.getTareas();
        const equipos = storage.getEquipos();
        
        let content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Resumen de Tareas</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Total Tareas</span>
                        <span class="detail-value">${tareas.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pendientes</span>
                        <span class="detail-value" style="color: #f59e0b;">${tareas.filter(t => t.estado === 'pendiente').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">En Progreso</span>
                        <span class="detail-value" style="color: #3b82f6;">${tareas.filter(t => t.estado === 'en_progreso').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Completadas</span>
                        <span class="detail-value" style="color: #10b981;">${tareas.filter(t => t.estado === 'completada').length}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Historial de Tareas</h4>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Equipo</th>
                            <th>Tipo</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tareas.sort((a,b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)).map(t => {
                            const equipo = equipos.find(e => e.id === t.id_equipo);
                            return `
                                <tr>
                                    <td>${t.id}</td>
                                    <td>${equipo ? equipo.nombre : '-'}</td>
                                    <td><span class="badge badge-${t.tipo_tarea}">${t.tipo_tarea}</span></td>
                                    <td><span class="badge badge-${t.prioridad}">${t.prioridad}</span></td>
                                    <td><span class="badge badge-${t.estado}">${t.estado.replace('_', ' ')}</span></td>
                                    <td>${utils.formatDate(t.fecha_creacion)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        ui.showModal('Reporte de Tareas', content, `<button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>`);
    },

    // Generar reporte de técnicos
    generarReporteTecnicos() {
        const tecnicos = storage.getTecnicos().filter(t => t.activo);
        const tareas = storage.getTareas();
        
        let content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Resumen de Técnicos</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Total Técnicos</span>
                        <span class="detail-value">${tecnicos.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Activos</span>
                        <span class="detail-value" style="color: #10b981;">${tecnicos.filter(t => t.estado === 'activo').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">En Licencia</span>
                        <span class="detail-value" style="color: #f59e0b;">${tecnicos.filter(t => t.estado === 'licencia').length}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Carga de Trabajo</h4>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Especialidad</th>
                            <th>Estado</th>
                            <th>Tareas Activas</th>
                            <th>Horas/Mes</th>
                            <th>Tareas Completadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tecnicos.map(tec => {
                            const tareasActivas = tareas.filter(t => 
                                t.asignaciones && t.asignaciones.some(a => a.id_tecnico === tec.id && a.estado_asignacion === 'activa')
                            ).length;
                            const tareasCompletadas = tareas.filter(t => 
                                t.asignaciones && t.asignaciones.some(a => a.id_tecnico === tec.id && a.estado_asignacion === 'completada')
                            ).length;
                            return `
                                <tr>
                                    <td>${tec.nombre} ${tec.apellido}</td>
                                    <td>${tec.especialidad}</td>
                                    <td><span class="badge badge-${tec.estado}">${tec.estado}</span></td>
                                    <td>${tareasActivas}</td>
                                    <td>${tec.horas_trabajadas_mes}h</td>
                                    <td>${tareasCompletadas}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        ui.showModal('Reporte de Técnicos', content, `<button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>`);
    },

    // Generar reporte de componentes
    generarReporteComponentes() {
        const componentes = storage.getComponentes().filter(c => c.activo);
        
        let content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Resumen de Componentes</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Total Componentes</span>
                        <span class="detail-value">${componentes.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Funcionales</span>
                        <span class="detail-value" style="color: #10b981;">${componentes.filter(c => c.estado === 'funcional').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Desgastados</span>
                        <span class="detail-value" style="color: #f59e0b;">${componentes.filter(c => c.estado === 'desgastado').length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Dañados</span>
                        <span class="detail-value" style="color: #ef4444;">${componentes.filter(c => c.estado === 'daniado').length}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Alertas de Componentes</h4>
                ${componentes.filter(c => c.estado === 'daniado' || c.estado === 'desgastado').length > 0 ? `
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Código</th>
                                <th>Estado</th>
                                <th>Vida Útil</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${componentes.filter(c => c.estado === 'daniado' || c.estado === 'desgastado').map(c => `
                                <tr>
                                    <td>${c.nombre}</td>
                                    <td>${c.codigo}</td>
                                    <td><span class="badge badge-${c.estado}">${c.estado}</span></td>
                                    <td>${c.vida_util_meses} meses</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: var(--text-muted);">No hay componentes con alertas</p>'}
            </div>
        `;
        
        ui.showModal('Reporte de Componentes', content, `<button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>`);
    },

    // Generar reporte de KPIs
    generarReporteKPIs() {
        const equipos = storage.getEquipos().filter(e => e.activo);
        const tareas = storage.getTareas();
        
        const equiposOperativos = equipos.filter(e => e.estado === 'operativo').length;
        const disponibilidad = equipos.length > 0 ? ((equiposOperativos / equipos.length) * 100).toFixed(1) : 0;
        
        const tareasCompletadas = tareas.filter(t => t.estado === 'completada');
        const tareasTotales = tareas.length;
        const cumplimiento = tareasTotales > 0 ? ((tareasCompletadas.length / tareasTotales) * 100).toFixed(1) : 0;
        
        // Calcular MTTR (tiempo medio de reparación)
        let mttr = 0;
        if (tareasCompletadas.length > 0) {
            const totalHoras = tareasCompletadas.reduce((acc, t) => acc + (t.duracion_real_horas || 0), 0);
            mttr = (totalHoras / tareasCompletadas.length).toFixed(1);
        }
        
        let content = `
            <div class="detail-section">
                <h4 class="detail-section-title">Indicadores de Rendimiento</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Disponibilidad de Equipos</span>
                        <span class="detail-value" style="font-size: 24px; color: #3b82f6;">${disponibilidad}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tareas Completadas</span>
                        <span class="detail-value" style="font-size: 24px; color: #10b981;">${cumplimiento}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">MTTR (Media Reparación)</span>
                        <span class="detail-value" style="font-size: 24px; color: #f59e0b;">${mttr}h</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Equipos</span>
                        <span class="detail-value" style="font-size: 24px;">${equipos.length}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">Interpretación</h4>
                <div style="color: var(--text-secondary); line-height: 1.8;">
                    <p><strong>Disponibilidad:</strong> Porcentaje de equipos que están operativos actualmente.</p>
                    <p><strong>Tareas Completadas:</strong> Porcentaje de tareas finalizadas exitosamente.</p>
                    <p><strong>MTTR (Mean Time To Repair):</strong> Tiempo promedio de reparación de tareas completadas.</p>
                </div>
            </div>
        `;
        
        ui.showModal('Indicadores KPI', content, `<button class="btn btn-secondary" onclick="ui.closeModal()">Cerrar</button>`);
    },

    // Exportar datos
    exportarCSV() {
        const data = storage.exportAllData();
        
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Equipos
        csvContent += "=== EQUIPOS ===\n";
        csvContent += "ID,Código,Nombre,Marca,Modelo,Estado,Laboratorio,Último Mant,Próximo Mant\n";
        data.equipos.forEach(e => {
            const lab = data.laboratorios.find(l => l.id === e.id_laboratorio);
            csvContent += `${e.id},${e.codigo},${e.nombre},${e.marca},${e.modelo},${e.estado},${lab ? lab.nombre : ''},${e.ultimo_mantenimiento},${e.proximo_mantenimiento}\n`;
        });
        
        // Tareas
        csvContent += "\n=== TAREAS ===\n";
        csvContent += "ID,Título,Equipo,Tipo,Prioridad,Estado,Fecha Creación,Fecha Programada\n";
        data.tareas.forEach(t => {
            const eq = data.equipos.find(e => e.id === t.id_equipo);
            csvContent += `${t.id},${t.titulo},${eq ? eq.nombre : ''},${t.tipo_tarea},${t.prioridad},${t.estado},${t.fecha_creacion},${t.fecha_programada}\n`;
        });
        
        // Descargar
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reporte_mantenimiento_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        ui.showToast('Reporte exportado correctamente', 'success');
    },
    
    // Exportar a PDF
    async exportarPDF() {
        try {
            const port = 5001;
            const url = `http://localhost:${port}/api/exportar/pdf`;
            console.log('Exporting PDF from:', url);
            const response = await fetch(url, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error('Error al exportar PDF');
            }
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `informe_mantenimiento_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
            
            ui.showToast('PDF exportado correctamente', 'success');
        } catch (error) {
            console.error('Error exportando PDF:', error);
            ui.showToast('Error al exportar PDF', 'error');
        }
    },
    
    // ============ EXPORTAR REPORTES INDIVIDUALES ============
    
    // Equipos
    exportarReporteEquiposPDF() {
        const equipos = storage.getEquipos();
        const laboratorios = storage.getLaboratorios();
        
        let html = '<h1>Reporte de Equipos</h1>';
        html += '<table border="1" style="border-collapse: collapse; width: 100%;">';
        html += '<tr style="background: #eee;"><th>Nombre</th><th>Tipo</th><th>Laboratorio</th><th>Estado</th></tr>';
        
        equipos.forEach(eq => {
            const lab = laboratorios.find(l => l.id === eq.id_laboratorio);
            html += `<tr>
                <td>${eq.nombre}</td>
                <td>${eq.tipo || 'N/A'}</td>
                <td>${lab ? lab.nombre : 'N/A'}</td>
                <td>${eq.estado}</td>
            </tr>`;
        });
        html += '</table>';
        
        this.exportarHTMLToPDF(html, 'reporte_equipos');
    },
    
    exportarReporteEquiposExcel() {
        const equipos = storage.getEquipos();
        const laboratorios = storage.getLaboratorios();
        
        let csv = 'Nombre,Tipo,Laboratorio,Estado\n';
        equipos.forEach(eq => {
            const lab = laboratorios.find(l => l.id === eq.id_laboratorio);
            csv += `"${eq.nombre}","${eq.tipo || 'N/A'}","${lab ? lab.nombre : 'N/A'}","${eq.estado}"\n`;
        });
        
        this.downloadFile(csv, 'reporte_equipos.csv', 'text/csv');
    },
    
    // Tareas
    exportarReporteTareasPDF() {
        const tareas = storage.getTareas();
        const equipos = storage.getEquipos();
        
        let html = '<h1>Reporte de Tareas</h1>';
        html += '<table border="1" style="border-collapse: collapse; width: 100%;">';
        html += '<tr style="background: #eee;"><th>Título</th><th>Equipo</th><th>Estado</th><th>Prioridad</th></tr>';
        
        tareas.forEach(t => {
            const eq = equipos.find(e => e.id === t.id_equipo);
            html += `<tr>
                <td>${t.titulo}</td>
                <td>${eq ? eq.nombre : 'N/A'}</td>
                <td>${t.estado}</td>
                <td>${t.prioridad}</td>
            </tr>`;
        });
        html += '</table>';
        
        this.exportarHTMLToPDF(html, 'reporte_tareas');
    },
    
    exportarReporteTareasExcel() {
        const tareas = storage.getTareas();
        const equipos = storage.getEquipos();
        
        let csv = 'Título,Equipo,Estado,Prioridad,Fecha\n';
        tareas.forEach(t => {
            const eq = equipos.find(e => e.id === t.id_equipo);
            csv += `"${t.titulo}","${eq ? eq.nombre : 'N/A'}","${t.estado}","${t.prioridad}","${t.fecha_creacion || ''}"\n`;
        });
        
        this.downloadFile(csv, 'reporte_tareas.csv', 'text/csv');
    },
    
    // Técnicos
    exportarReporteTecnicosPDF() {
        const tecnicos = storage.getTecnicos();
        
        let html = '<h1>Reporte de Técnicos</h1>';
        html += '<table border="1" style="border-collapse: collapse; width: 100%;">';
        html += '<tr style="background: #eee;"><th>Nombre</th><th>Email</th><th>Especialidad</th><th>Estado</th></tr>';
        
        tecnicos.forEach(t => {
            html += `<tr>
                <td>${t.nombre}</td>
                <td>${t.email}</td>
                <td>${t.especialidad}</td>
                <td>${t.estado}</td>
            </tr>`;
        });
        html += '</table>';
        
        this.exportarHTMLToPDF(html, 'reporte_tecnicos');
    },
    
    exportarReporteTecnicosExcel() {
        const tecnicos = storage.getTecnicos();
        
        let csv = 'Nombre,Email,Teléfono,Especialidad,Estado\n';
        tecnicos.forEach(t => {
            csv += `"${t.nombre}","${t.email}","${t.telefono || ''}","${t.especialidad}","${t.estado}"\n`;
        });
        
        this.downloadFile(csv, 'reporte_tecnicos.csv', 'text/csv');
    },
    
    // Componentes
    exportarReporteComponentesPDF() {
        const componentes = storage.getComponentes();
        const equipos = storage.getEquipos();
        
        let html = '<h1>Reporte de Componentes</h1>';
        html += '<table border="1" style="border-collapse: collapse; width: 100%;">';
        html += '<tr style="background: #eee;"><th>Nombre</th><th>Equipo</th><th>Tipo</th><th>Estado</th></tr>';
        
        componentes.forEach(c => {
            const eq = equipos.find(e => e.id === c.id_equipo);
            html += `<tr>
                <td>${c.nombre}</td>
                <td>${eq ? eq.nombre : 'N/A'}</td>
                <td>${c.tipo}</td>
                <td>${c.estado}</td>
            </tr>`;
        });
        html += '</table>';
        
        this.exportarHTMLToPDF(html, 'reporte_componentes');
    },
    
    exportarReporteComponentesExcel() {
        const componentes = storage.getComponentes();
        const equipos = storage.getEquipos();
        
        let csv = 'Nombre,Equipo,Tipo,Estado,Vida Útil\n';
        componentes.forEach(c => {
            const eq = equipos.find(e => e.id === c.id_equipo);
            csv += `"${c.nombre}","${eq ? eq.nombre : 'N/A'}","${c.tipo}","${c.estado}","${c.vida_util || ''}"\n`;
        });
        
        this.downloadFile(csv, 'reporte_componentes.csv', 'text/csv');
    },
    
    // KPIs
    exportarReporteKPIsPDF() {
        const equipos = storage.getEquipos();
        const tareas = storage.getTareas();
        
        const operativos = equipos.filter(e => e.estado === 'operativo').length;
        const mantenimiento = equipos.filter(e => e.estado === 'mantenimiento').length;
        const tareasCompletadas = tareas.filter(t => t.estado === 'completada').length;
        const tareasPendientes = tareas.filter(t => t.estado === 'pendiente').length;
        
        let html = '<h1>Indicadores KPI</h1>';
        html += '<table border="1" style="border-collapse: collapse; width: 100%;">';
        html += '<tr style="background: #eee;"><th>Indicador</th><th>Valor</th></tr>';
        html += `<tr><td>Equipos Operativos</td><td>${operativos}</td></tr>`;
        html += `<tr><td>Equipos en Mantenimiento</td><td>${mantenimiento}</td></tr>`;
        html += `<tr><td>Tareas Completadas</td><td>${tareasCompletadas}</td></tr>`;
        html += `<tr><td>Tareas Pendientes</td><td>${tareasPendientes}</td></tr>`;
        html += '</table>';
        
        this.exportarHTMLToPDF(html, 'reporte_kpis');
    },
    
    exportarReporteKPIsExcel() {
        const equipos = storage.getEquipos();
        const tareas = storage.getTareas();
        
        const operativos = equipos.filter(e => e.estado === 'operativo').length;
        const mantenimiento = equipos.filter(e => e.estado === 'mantenimiento').length;
        const tareasCompletadas = tareas.filter(t => t.estado === 'completada').length;
        const tareasPendientes = tareas.filter(t => t.estado === 'pendiente').length;
        
        let csv = 'Indicador,Valor\n';
        csv += `Equipos Operativos,${operativos}\n`;
        csv += `Equipos en Mantenimiento,${mantenimiento}\n`;
        csv += `Tareas Completadas,${tareasCompletadas}\n`;
        csv += `Tareas Pendientes,${tareasPendientes}\n`;
        
        this.downloadFile(csv, 'reporte_kpis.csv', 'text/csv');
    },
    
    // Función auxiliar para exportar HTML a PDF
    exportarHTMLToPDF(html, filename) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>${filename}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>${html}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    },
    
    // Función auxiliar para descargar archivos
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        ui.showToast(`${filename} exportado correctamente`, 'success');
    }
};

// Exportar
window.reportes = reportes;
