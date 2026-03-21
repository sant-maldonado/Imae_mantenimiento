// ============================================
// Export Service - Servicio de Exportación
// ============================================

const exportService = {
    // Exportar todos los datos
    exportAll() {
        const data = storage.exportAllData();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup_mantenimiento_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        ui.showToast('Datos exportados correctamente', 'success');
    },

    // Exportar a CSV
    exportToCSV() {
        reportes.exportarCSV();
    },

    // Importar datos desde JSON
    importFromJSON(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.laboratorios || !data.equipos) {
                    throw new Error('Formato de archivo inválido');
                }
                
                ui.confirm(
                    'Confirmar Importación',
                    'Esta acción reemplazará todos los datos actuales. ¿Continuar?',
                    () => {
                        storage.importData(data);
                        ui.showToast('Datos importados correctamente', 'success');
                        app.init();
                    }
                );
            } catch (error) {
                ui.showToast('Error al importar: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    },

    // Crear archivo de importación
    createImportInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            if (e.target.files[0]) {
                this.importFromJSON(e.target.files[0]);
            }
        };
        input.click();
    }
};

// Event listener para el botón de exportar
document.addEventListener('DOMContentLoaded', () => {
    const btnExport = document.getElementById('btnExportData');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            ui.showModal('Exportar Datos', `
                <div style="text-align: center;">
                    <p style="margin-bottom: 20px; color: var(--text-secondary);">Selecciona el formato de exportación</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-primary" onclick="exportService.exportAll()">
                            📦 Exportar JSON
                        </button>
                        <button class="btn btn-secondary" onclick="exportService.exportToCSV()">
                            📊 Exportar CSV
                        </button>
                    </div>
                </div>
            `, '<button class="btn btn-secondary" onclick="ui.closeModal()">Cancelar</button>');
        });
    }
});

// Exportar
window.exportService = exportService;
