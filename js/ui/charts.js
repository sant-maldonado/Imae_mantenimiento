// ============================================
// Charts - Configuración de Gráficos con Chart.js
// ============================================

const charts = {
    charts: {},
    
    // Colores del tema
    colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4',
        muted: '#64748b',
        light: '#94a3b8',
        dark: '#1e293b'
    },

    // Inicializar gráfico de equipos por estado
    initEquiposEstado() {
        const ctx = document.getElementById('chartEquiposEstado');
        if (!ctx) return;
        
        const equipos = storage.getEquipos().filter(e => e.activo);
        
        const estados = {
            operativo: 0,
            mantenimiento: 0,
            fuera_servicio: 0,
            dado_baja: 0
        };
        
        equipos.forEach(e => {
            if (estados.hasOwnProperty(e.estado)) {
                estados[e.estado]++;
            }
        });
        
        const data = {
            labels: ['Operativo', 'Mantenimiento', 'Fuera de Servicio', 'Dado de Baja'],
            datasets: [{
                data: [estados.operativo, estados.mantenimiento, estados.fuera_servicio, estados.dado_baja],
                backgroundColor: [
                    this.colors.success,
                    this.colors.primary,
                    this.colors.danger,
                    this.colors.muted
                ],
                borderWidth: 0
            }]
        };
        
        if (this.charts.equiposEstado) {
            this.charts.equiposEstado.destroy();
        }
        
        this.charts.equiposEstado = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            padding: 16,
                            usePointStyle: true,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    },

    // Inicializar gráfico de tareas por prioridad
    initTareasPrioridad() {
        const ctx = document.getElementById('chartTareasPrioridad');
        if (!ctx) return;
        
        const tareas = storage.getTareas();
        
        const prioridades = {
            baja: 0,
            media: 0,
            alta: 0,
            critica: 0
        };
        
        tareas.forEach(t => {
            if (prioridades.hasOwnProperty(t.prioridad)) {
                prioridades[t.prioridad]++;
            }
        });
        
        const data = {
            labels: ['Baja', 'Media', 'Alta', 'Crítica'],
            datasets: [{
                label: 'Tareas',
                data: [prioridades.baja, prioridades.media, prioridades.alta, prioridades.critica],
                backgroundColor: [
                    this.colors.muted,
                    this.colors.warning,
                    this.colors.warning,
                    this.colors.danger
                ],
                borderRadius: 6,
                borderSkipped: false
            }]
        };
        
        if (this.charts.tareasPrioridad) {
            this.charts.tareasPrioridad.destroy();
        }
        
        this.charts.tareasPrioridad = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#334155'
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    // Actualizar todos los gráficos
    updateAll() {
        this.initEquiposEstado();
        this.initTareasPrioridad();
    },

    // Destruir todos los gráficos
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
};

// Exportar
window.charts = charts;
