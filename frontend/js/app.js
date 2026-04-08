// ============================================
// App - Aplicación Principal
// ============================================

const app = {
    currentPage: 'dashboard',
    
    async init() {
        console.log('Inicializando Sistema de Mantenimiento...');
        
        // Configurar navegación
        this.setupNavigation();
        
        // Configurar filtros
        this.setupFilters();
        
        // Verificar sesión antes de cargar datos
        await auth.verificarSesion();
        
        // Si hay usuario logueado, cargar datos
        if (auth.usuario) {
            await storage.init();
            this.navigateTo('dashboard');
            console.log('Sistema inicializado correctamente');
        } else {
            auth.mostrarLogin();
        }
        
        // Configurar event listeners de login
        this.setupLogin();
    },

    setupLogin() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('loginUsername').value;
                const password = document.getElementById('loginPassword').value;
                const errorDiv = document.getElementById('loginError');
                
                try {
                    await auth.login(username, password);
                    await storage.init();
                    this.navigateTo('dashboard');
                } catch (err) {
                    errorDiv.textContent = err.message;
                    errorDiv.style.display = 'block';
                }
            });
        }
    },
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) {
                    this.navigateTo(page);
                    // Cerrar sidebar en responsive
                    const sidebar = document.querySelector('.sidebar');
                    const menuToggle = document.getElementById('menuToggle');
                    if (sidebar && sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                        menuToggle.classList.remove('active');
                    }
                }
            });
        });
        
        // Configurar botones de nueva tarea
        const btnNuevaTarea = document.getElementById('btnNuevaTarea');
        if (btnNuevaTarea) {
            btnNuevaTarea.addEventListener('click', () => {
                modTareas.edit();
            });
        }
        
        // Botón nuevo equipo
        const btnNuevoEquipo = document.getElementById('btnNuevoEquipo');
        if (btnNuevoEquipo) {
            btnNuevoEquipo.addEventListener('click', () => {
                modEquipos.edit();
            });
        }
        
        // Botón nuevo componente
        const btnNuevoComponente = document.getElementById('btnNuevoComponente');
        if (btnNuevoComponente) {
            btnNuevoComponente.addEventListener('click', () => {
                modComponentes.edit();
            });
        }
        
        // Botón nuevo laboratorio
        const btnNuevoLaboratorio = document.getElementById('btnNuevoLaboratorio');
        if (btnNuevoLaboratorio) {
            btnNuevoLaboratorio.addEventListener('click', () => {
                modLaboratorios.edit();
            });
        }
        
        // Botón nuevo técnico
        const btnNuevoTecnico = document.getElementById('btnNuevoTecnico');
        if (btnNuevoTecnico) {
            btnNuevoTecnico.addEventListener('click', () => {
                modTecnicos.edit();
            });
        }
        
        // Cerrar modal al hacer click fuera
        const modalContainer = document.getElementById('modalContainer');
        if (modalContainer) {
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    ui.closeModal();
                }
            });
        }
    },

    // Configurar filtros
    setupFilters() {
        // Filtros de equipos
        const filtroLaboratorio = document.getElementById('filtroLaboratorio');
        const filtroEstado = document.getElementById('filtroEstado');
        const buscarEquipo = document.getElementById('buscarEquipo');
        
        if (filtroLaboratorio) filtroLaboratorio.addEventListener('change', () => modEquipos.render());
        if (filtroEstado) filtroEstado.addEventListener('change', () => modEquipos.render());
        if (buscarEquipo) buscarEquipo.addEventListener('input', utils.debounce(() => modEquipos.render(), 300));
        
        // Filtros de componentes
        const filtroComponenteEquipo = document.getElementById('filtroComponenteEquipo');
        const filtroComponenteEstado = document.getElementById('filtroComponenteEstado');
        const buscarComponente = document.getElementById('buscarComponente');
        
        if (filtroComponenteEquipo) filtroComponenteEquipo.addEventListener('change', () => modComponentes.render());
        if (filtroComponenteEstado) filtroComponenteEstado.addEventListener('change', () => modComponentes.render());
        if (buscarComponente) buscarComponente.addEventListener('input', utils.debounce(() => modComponentes.render(), 300));
        
        // Filtros de tareas
        const filtroTareaTipo = document.getElementById('filtroTareaTipo');
        const filtroTareaPrioridad = document.getElementById('filtroTareaPrioridad');
        const filtroTareaEstado = document.getElementById('filtroTareaEstado');
        const buscarTarea = document.getElementById('buscarTarea');
        
        if (filtroTareaTipo) filtroTareaTipo.addEventListener('change', () => modTareas.render());
        if (filtroTareaPrioridad) filtroTareaPrioridad.addEventListener('change', () => modTareas.render());
        if (filtroTareaEstado) filtroTareaEstado.addEventListener('change', () => modTareas.render());
        if (buscarTarea) buscarTarea.addEventListener('input', utils.debounce(() => modTareas.render(), 300));
    },

    // Navegar a página
    navigateTo(page) {
        this.currentPage = page;
        
        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Mostrar página correcta
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        const pageElement = document.getElementById(`page-${page}`);
        if (pageElement) {
            pageElement.classList.add('active');
        }
        
        // Actualizar título
        const titles = {
            dashboard: 'Dashboard',
            laboratorios: 'Laboratorios',
            equipos: 'Equipos',
            componentes: 'Componentes',
            tecnicos: 'Técnicos',
            tareas: 'Tareas de Mantenimiento',
            usuarios: 'Usuarios',
            reportes: 'Reportes'
        };
        
        const subtitles = {
            dashboard: 'Resumen general del sistema de mantenimiento',
            laboratorios: 'Gestión de laboratorios',
            equipos: 'Gestión de equipos',
            componentes: 'Gestión de componentes',
            tecnicos: 'Gestión del equipo técnico',
            tareas: 'Gestión de tareas de mantenimiento',
            usuarios: 'Gestión de usuarios del sistema',
            reportes: 'Generación de reportes'
        };
        
        document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';
        document.getElementById('pageSubtitle').textContent = subtitles[page] || '';
        
        // Mostrar/ocultar botón nueva tarea
        const btnNuevaTarea = document.getElementById('btnNuevaTarea');
        if (btnNuevaTarea) {
            btnNuevaTarea.style.display = page === 'tareas' ? 'inline-flex' : 'none';
        }
        
        // Mostrar/ocultar botón nuevo equipo
        const btnNuevoEquipo = document.getElementById('btnNuevoEquipo');
        if (btnNuevoEquipo) {
            btnNuevoEquipo.style.display = page === 'equipos' ? 'inline-flex' : 'none';
        }
        
        // Mostrar/ocultar botón nuevo componente
        const btnNuevoComponente = document.getElementById('btnNuevoComponente');
        if (btnNuevoComponente) {
            btnNuevoComponente.style.display = page === 'componentes' ? 'inline-flex' : 'none';
        }
        
        // Renderizar contenido según página
        this.renderPage(page);
    },

    // Renderizar página
    renderPage(page) {
        switch (page) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'laboratorios':
                modLaboratorios.render();
                break;
            case 'equipos':
                modEquipos.render();
                break;
            case 'componentes':
                modComponentes.render();
                break;
            case 'tecnicos':
                modTecnicos.render();
                break;
            case 'tareas':
                modTareas.render();
                break;
            case 'usuarios':
                modUsuarios.render();
                break;
            case 'reportes':
                // Reportes se renderiza en la página
                break;
        }
    },

    // Actualizar dashboard
    updateDashboard() {
        // KPIs
        const equipos = storage.getEquipos();
        const tareas = storage.getTareas();
        const tecnicos = storage.getTecnicos();
        const componentes = storage.getComponentes();
        
        document.getElementById('kpiEquiposActivos').textContent = equipos.filter(e => e.estado === 'operativo' || e.estado === null || e.estado === undefined || e.activo === true).length;
        document.getElementById('kpiTareasPendientes').textContent = tareas.filter(t => ['pendiente', 'asignada'].includes(t.estado)).length;
        document.getElementById('kpiTecnicosActivos').textContent = tecnicos.filter(t => t.estado === 'activo' || t.estado === null || t.estado === undefined || t.activo === true).length;
        document.getElementById('kpiComponentes').textContent = componentes.length;
        
        // Gráficos
        charts.updateAll();
        
        // Tabla de equipos operativos
        this.renderEquiposOperativos();
        
        // Tabla de tareas recientes
        this.renderTareasRecientes();
        
        // Tabla de laboratorios
        this.renderLaboratoriosDashboard();
    },

    // Renderizar tareas recientes en dashboard
    renderTareasRecientes() {
        const tbody = document.querySelector('#tablaTareasRecientes tbody');
        if (!tbody) return;
        
        const tareas = storage.getTareas()
            .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
            .slice(0, 5);
        
        tbody.innerHTML = tareas.map(t => {
            const equipo = storage.getEquipos().find(e => e.id === t.id_equipo);
            const laboratorio = equipo ? storage.getLaboratorios().find(l => l.id === equipo.id_laboratorio) : null;
            const asignaciones = t.asignaciones || [];
            // Usar datos del técnico que vienen en la asignación o buscar en storage
            let tecnico = null;
            if (asignaciones.length > 0) {
                const asig = asignaciones[0];
                if (asig.tecnico) {
                    // Usar datos del técnico que vienen en la asignación
                    tecnico = asig.tecnico;
                } else {
                    // Buscar en storage si no vienen los datos
                    tecnico = storage.getTecnicos().find(tec => tec.id === asig.id_tecnico);
                }
            }
            
            // Estado simplificado
            let estadoSimple = 'pendiente';
            if (t.estado === 'en_progreso' || t.estado === 'pausada') estadoSimple = 'en_progreso';
            if (t.estado === 'completada' || t.estado === 'cancelada') estadoSimple = 'completada';
            
            const estadoLabel = estadoSimple === 'pendiente' ? 'Pendiente' : estadoSimple === 'en_progreso' ? 'En progreso' : 'Completada';
            
            return `
                <tr>
                    <td>${t.titulo}</td>
                    <td>${equipo ? equipo.nombre : '-'}</td>
                    <td>${laboratorio ? laboratorio.nombre : '-'}</td>
                    <td>${tecnico ? (tecnico.apellido ? tecnico.nombre + ' ' + tecnico.apellido : tecnico.nombre) : '<span style="color: var(--text-muted);">-</span>'}</td>
                    <td><span class="badge badge-${estadoSimple === 'pendiente' ? 'pendiente' : estadoSimple === 'en_progreso' ? 'en_progreso' : 'completada'}">${estadoLabel}</span></td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="modTareas.view('${t.id}')">Ver</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Renderizar laboratorios en dashboard
    renderLaboratoriosDashboard() {
        const tbody = document.querySelector('#tablaLaboratorios tbody');
        if (!tbody) return;
        
        const laboratorios = storage.getLaboratorios().filter(l => l.activo);
        
        tbody.innerHTML = laboratorios.map(lab => {
            const equipos = storage.getEquipos().filter(e => e.id_laboratorio === lab.id && e.activo);
            const equiposOperativos = equipos.filter(e => (e.estado || 'operativo') === 'operativo').length;
            
            return `
                <tr>
                    <td><span style="font-family: monospace;">${lab.codigo}</span></td>
                    <td>${lab.nombre}</td>
                    <td>${lab.ubicacion}</td>
                    <td>${lab.responsable}</td>
                    <td>${equipos.length}</td>
                    <td>
                        <span class="badge ${equiposOperativos === equipos.length ? 'badge-operativo' : 'badge-mantenimiento'}">
                            ${equiposOperativos}/${equipos.length} operativos
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Renderizar equipos operativos en dashboard
    renderEquiposOperativos() {
        const tbody = document.querySelector('#tablaEquiposOperativos tbody');
        if (!tbody) return;
        
        const equipos = storage.getEquipos()
            .filter(e => e.activo && e.estado === 'operativo')
            .slice(0, 10); // Mostrar máximo 10 equipos
        
        if (equipos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay equipos operativos</td></tr>';
            return;
        }
        
        tbody.innerHTML = equipos.map(eq => {
            const laboratorio = storage.getLaboratorios().find(l => l.id === eq.id_laboratorio);
            const laboratorioNombre = laboratorio ? laboratorio.nombre : 'Sin asignar';
            
            return `
                <tr>
                    <td><strong>${eq.nombre}</strong></td>
                    <td>${eq.tipo || 'N/A'}</td>
                    <td>${laboratorioNombre}</td>
                    <td><span class="badge badge-operativo">Operativo</span></td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="app.navigateTo('equipos')">
                            Ver Detalle
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Menú responsive
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            sidebar.classList.toggle('open');
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('open');
            }
        });
    }
});

// Exportar
window.app = app;
