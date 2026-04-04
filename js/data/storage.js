// Servicio de almacenamiento - Conecta a PostgreSQL via API REST
const getApiUrl = () => {
    const port = 3000; // Puerto del servidor Node.js
    return `http://127.0.0.1:${port}/api`;
};
const API_URL = getApiUrl();

class Storage {
    constructor() {
        this.cache = {
            laboratorios: [],
            equipos: [],
            componentes: [],
            tecnicos: [],
            tareas: [],
            usuarios: []
        };
        this.initialized = false;
    }

    // Inicializar - cargar datos desde la API
    async init() {
        if (this.initialized) return;
        
        // Limpiar localStorage al iniciar (usar solo datos de la API)
        this.limpiarLocalStorage();
        
        try {
            await this.loadAll();
            this.initialized = true;
            console.log('✅ Datos cargados desde la API');
            
            // Si no hay datos, cargar ejemplos
            if (this.cache.laboratorios.length === 0) {
                console.log('📋 No hay datos en la API, cargando ejemplos...');
                this.loadSampleData();
            }
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            // Cargar datos de muestra si no hay conexión
            this.loadSampleData();
        }
    }

    // Limpiar localStorage para usar solo datos de la API
    limpiarLocalStorage() {
        const keysToKeep = ['currentUser']; // Solo mantener sesión de usuario
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        }
        console.log('🧹 LocalStorage limpiado (solo sesión de usuario mantenida)');
    }

    // Cargar todos los datos desde la API
    async loadAll() {
        console.log('🔄 Cargando datos desde API...');
        const [labs, eqs, comps, tecs, tars, usrs] = await Promise.all([
            this.fetchAPI('/laboratorios'),
            this.fetchAPI('/equipos'),
            this.fetchAPI('/componentes'),
            this.fetchAPI('/tecnicos'),
            this.fetchAPI('/tareas'),
            this.fetchAPI('/usuarios')
        ]);

        this.cache.laboratorios = labs || [];
        this.cache.equipos = eqs || [];
        this.cache.componentes = comps || [];
        this.cache.tecnicos = tecs || [];
        this.cache.tareas = tars || [];
        this.cache.usuarios = usrs || [];
        
        console.log('📊 Técnicos cargados:', this.cache.tecnicos.length);
        console.log('📊 Lista técnicos:', this.cache.tecnicos.map(t => t.nombre + ' ' + t.apellido));
    }

    // Método genérico para hacer fetch a la API
    async fetchAPI(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en API ${endpoint}:`, error);
            return null;
        }
    }

    // ============ LABORATORIOS ============
    getLaboratorios() {
        return this.cache.laboratorios;
    }

    async addLaboratorio(laboratorio) {
        try {
            const result = await this.fetchAPI('/laboratorios', {
                method: 'POST',
                body: JSON.stringify(laboratorio)
            });
            if (result) {
                this.cache.laboratorios.push(result);
            } else {
                // Si la API no responde, agregar directamente al cache
                this.cache.laboratorios.push(laboratorio);
            }
            return result;
        } catch (e) {
            // Si hay error, agregar directamente al cache
            this.cache.laboratorios.push(laboratorio);
            return laboratorio;
        }
    }

    async updateLaboratorio(id, data) {
        try {
            const result = await this.fetchAPI(`/laboratorios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (result) {
                const index = this.cache.laboratorios.findIndex(l => l.id === id);
                if (index !== -1) this.cache.laboratorios[index] = result;
            } else {
                const index = this.cache.laboratorios.findIndex(l => l.id === id);
                if (index !== -1) this.cache.laboratorios[index] = data;
            }
            return result;
        } catch (e) {
            const index = this.cache.laboratorios.findIndex(l => l.id === id);
            if (index !== -1) this.cache.laboratorios[index] = data;
            return data;
        }
    }

    async deleteLaboratorio(id) {
        const result = await this.fetchAPI(`/laboratorios/${id}`, {
            method: 'DELETE'
        });
        if (result) {
            this.cache.laboratorios = this.cache.laboratorios.filter(l => l.id !== id);
        }
        return result;
    }

    // ============ EQUIPOS ============
    getEquipos() {
        return this.cache.equipos;
    }

    getEquiposByLaboratorio(idLaboratorio) {
        return this.cache.equipos.filter(e => e.id_laboratorio === idLaboratorio);
    }

    async addEquipo(equipo) {
        try {
            const result = await this.fetchAPI('/equipos', {
                method: 'POST',
                body: JSON.stringify(equipo)
            });
            if (result) {
                this.cache.equipos.push(result);
            } else {
                this.cache.equipos.push(equipo);
            }
            return result;
        } catch (e) {
            this.cache.equipos.push(equipo);
            return equipo;
        }
    }
    
    async updateEquipo(id, data) {
        try {
            const result = await this.fetchAPI(`/equipos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (result) {
                const index = this.cache.equipos.findIndex(e => e.id === id);
                if (index !== -1) this.cache.equipos[index] = result;
            } else {
                const index = this.cache.equipos.findIndex(e => e.id === id);
                if (index !== -1) this.cache.equipos[index] = data;
            }
            return result;
        } catch (e) {
            const index = this.cache.equipos.findIndex(e => e.id === id);
            if (index !== -1) this.cache.equipos[index] = data;
            return data;
        }
    }

    async deleteEquipo(id) {
        const result = await this.fetchAPI(`/equipos/${id}`, {
            method: 'DELETE'
        });
        if (result) {
            this.cache.equipos = this.cache.equipos.filter(e => e.id !== id);
        }
        return result;
    }

    // ============ COMPONENTES ============
    getComponentes() {
        return this.cache.componentes;
    }

    getComponentesByEquipo(idEquipo) {
        return this.cache.componentes.filter(c => c.id_equipo === idEquipo);
    }

    async addComponente(componente) {
        try {
            const result = await this.fetchAPI('/componentes', {
                method: 'POST',
                body: JSON.stringify(componente)
            });
            if (result) {
                this.cache.componentes.push(result);
            } else {
                this.cache.componentes.push(componente);
            }
            return result;
        } catch (e) {
            this.cache.componentes.push(componente);
            return componente;
        }
    }
    
    async updateComponente(id, data) {
        try {
            const result = await this.fetchAPI(`/componentes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (result) {
                const index = this.cache.componentes.findIndex(c => c.id === id);
                if (index !== -1) this.cache.componentes[index] = result;
            } else {
                const index = this.cache.componentes.findIndex(c => c.id === id);
                if (index !== -1) this.cache.componentes[index] = data;
            }
            return result;
        } catch (e) {
            const index = this.cache.componentes.findIndex(c => c.id === id);
            if (index !== -1) this.cache.componentes[index] = data;
            return data;
        }
    }

    async deleteComponente(id) {
        const result = await this.fetchAPI(`/componentes/${id}`, {
            method: 'DELETE'
        });
        if (result) {
            this.cache.componentes = this.cache.componentes.filter(c => c.id !== id);
        }
        return result;
    }

    // ============ TÉCNICOS ============
    getTecnicos() {
        return this.cache.tecnicos;
    }

    async addTecnico(tecnico) {
        try {
            const result = await this.fetchAPI('/tecnicos', {
                method: 'POST',
                body: JSON.stringify(tecnico)
            });
            if (result) {
                this.cache.tecnicos.push(result);
            } else {
                this.cache.tecnicos.push(tecnico);
            }
            return result;
        } catch (e) {
            this.cache.tecnicos.push(tecnico);
            return tecnico;
        }
    }
    
    async updateTecnico(id, data) {
        try {
            const result = await this.fetchAPI(`/tecnicos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (result) {
                const index = this.cache.tecnicos.findIndex(t => t.id === id);
                if (index !== -1) this.cache.tecnicos[index] = result;
            } else {
                const index = this.cache.tecnicos.findIndex(t => t.id === id);
                if (index !== -1) this.cache.tecnicos[index] = data;
            }
            return result;
        } catch (e) {
            const index = this.cache.tecnicos.findIndex(t => t.id === id);
            if (index !== -1) this.cache.tecnicos[index] = data;
            return data;
        }
    }

    async deleteTecnico(id) {
        const result = await this.fetchAPI(`/tecnicos/${id}`, {
            method: 'DELETE'
        });
        if (result) {
            this.cache.tecnicos = this.cache.tecnicos.filter(t => t.id !== id);
        }
        return result;
    }

    // ============ TAREAS ============
    getTareas() {
        return this.cache.tareas;
    }

    getTareasByEquipo(idEquipo) {
        return this.cache.tareas.filter(t => t.id_equipo === idEquipo);
    }

    async addTarea(tarea) {
        try {
            const result = await this.fetchAPI('/tareas', {
                method: 'POST',
                body: JSON.stringify(tarea)
            });
            if (result) {
                this.cache.tareas.push(result);
            } else {
                this.cache.tareas.push(tarea);
            }
            return result;
        } catch (e) {
            this.cache.tareas.push(tarea);
            return tarea;
        }
    }
    
    async updateTarea(id, data) {
        try {
            const result = await this.fetchAPI(`/tareas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (result) {
                const index = this.cache.tareas.findIndex(t => t.id === id);
                if (index !== -1) this.cache.tareas[index] = result;
            } else {
                const index = this.cache.tareas.findIndex(t => t.id === id);
                if (index !== -1) this.cache.tareas[index] = data;
            }
            return result;
        } catch (e) {
            const index = this.cache.tareas.findIndex(t => t.id === id);
            if (index !== -1) this.cache.tareas[index] = data;
            return data;
        }
    }

    async deleteTarea(id) {
        const result = await this.fetchAPI(`/tareas/${id}`, {
            method: 'DELETE'
        });
        if (result) {
            this.cache.tareas = this.cache.tareas.filter(t => t.id !== id);
        }
        return result;
    }

    // Función para guardar tarea (alta o modificación)
    async saveTarea(tarea) {
        if (tarea.id) {
            // Verificar si existe
            const existente = this.cache.tareas.find(t => t.id === tarea.id);
            if (existente) {
                return await this.updateTarea(tarea.id, tarea);
            }
        }
        return await this.addTarea(tarea);
    }

    // Función para guardar técnico (alta o modificación)
    async saveTecnico(tecnico) {
        if (tecnico.id) {
            const existente = this.cache.tecnicos.find(t => t.id === tecnico.id);
            if (existente) {
                return await this.updateTecnico(tecnico.id, tecnico);
            }
        }
        return await this.addTecnico(tecnico);
    }

    // Función para guardar laboratorio (alta o modificación)
    async saveLaboratorio(laboratorio) {
        if (laboratorio.id) {
            const existente = this.cache.laboratorios.find(l => l.id === laboratorio.id);
            if (existente) {
                return await this.updateLaboratorio(laboratorio.id, laboratorio);
            }
        }
        return await this.addLaboratorio(laboratorio);
    }

    // Función para guardar equipo (alta o modificación)
    async saveEquipo(equipo) {
        if (equipo.id) {
            const existente = this.cache.equipos.find(e => e.id === equipo.id);
            if (existente) {
                return await this.updateEquipo(equipo.id, equipo);
            }
        }
        return await this.addEquipo(equipo);
    }

    // Función para guardar componente (alta o modificación)
    async saveComponente(componente) {
        if (componente.id) {
            const existente = this.cache.componentes.find(c => c.id === componente.id);
            if (existente) {
                return await this.updateComponente(componente.id, componente);
            }
        }
        return await this.addComponente(componente);
    }

    // ============ DASHBOARD ============
    async getDashboard() {
        return await this.fetchAPI('/dashboard');
    }

    // ============ EXPORTAR DATOS ============
    async exportData() {
        return await this.fetchAPI('/exportar');
    }
    
    // Exportar todos los datos del cache local (sin llamar a la API)
    exportAllData() {
        return {
            laboratorios: this.getLaboratorios(),
            equipos: this.getEquipos(),
            componentes: this.getComponentes(),
            tecnicos: this.getTecnicos(),
            tareas: this.getTareas()
        };
    }

    // ============ IMPORTAR/MIGRAR DATOS ============
    async importData(data) {
        return await this.fetchAPI('/migrar', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Cargar datos de muestra (fallback si no hay API)
    loadSampleData() {
        // Cargar datos de ejemplo desde sampleData.js
        const existingLaboratorios = this.cache.laboratorios;
        if (existingLaboratorios.length === 0) {
            console.log('Cargando datos de ejemplo...');
            
            // Cargar laboratorios
            sampleData.laboratorios.forEach(l => {
                this.cache.laboratorios.push(l);
            });
            
            // Cargar equipos
            sampleData.equipos.forEach(e => {
                this.cache.equipos.push(e);
            });
            
            // Cargar componentes
            sampleData.componentes.forEach(c => {
                this.cache.componentes.push(c);
            });
            
            // Cargar técnicos
            sampleData.tecnicos.forEach(t => {
                this.cache.tecnicos.push(t);
            });
            
            // Cargar tareas
            sampleData.tareas.forEach(t => {
                this.cache.tareas.push(t);
            });
            
            console.log('Datos de ejemplo cargados correctamente');
        }
    }

    // Obtener datos de localStorage para migración
    getLocalStorageData() {
        return {
            laboratorios: JSON.parse(localStorage.getItem('laboratorios') || '[]'),
            equipos: JSON.parse(localStorage.getItem('equipos') || '[]'),
            componentes: JSON.parse(localStorage.getItem('componentes') || '[]'),
            tecnicos: JSON.parse(localStorage.getItem('tecnicos') || '[]'),
            tareas: JSON.parse(localStorage.getItem('tareas') || '[]')
        };
    }

    // Migrar datos de localStorage a la API
    async migrarDesdeLocalStorage() {
        const data = this.getLocalStorageData();
        
        // Verificar si hay datos para migrar
        const totalDatos = data.laboratorios.length + data.equipos.length + 
                          data.componentes.length + data.tecnicos.length + data.tareas.length;
        
        if (totalDatos === 0) {
            console.log('No hay datos en localStorage para migrar');
            return { message: 'No hay datos para migrar' };
        }
        
        console.log(`Migrando ${totalDatos} registros...`);
        return await this.importData(data);
    }

    // ============ USUARIOS ============
    getUsuarios() {
        return this.cache.usuarios;
    }

    getUsuarioByEmail(email) {
        return this.cache.usuarios.find(u => u.email === email);
    }

    async addUsuario(usuario) {
        const existente = this.cache.usuarios.find(u => u.email === usuario.email);
        if (existente) {
            return { error: 'El email ya está registrado' };
        }
        try {
            const result = await this.fetchAPI('/usuarios', {
                method: 'POST',
                body: JSON.stringify(usuario)
            });
            if (result) {
                this.cache.usuarios.push(result);
            } else {
                this.cache.usuarios.push(usuario);
            }
            return result || usuario;
        } catch (e) {
            this.cache.usuarios.push(usuario);
            return usuario;
        }
    }

    async actualizarUsuario(usuario) {
        const index = this.cache.usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
            this.cache.usuarios[index] = usuario;
        }
        try {
            const result = await this.fetchAPI(`/usuarios/${usuario.id}`, {
                method: 'PUT',
                body: JSON.stringify(usuario)
            });
            return result || usuario;
        } catch (e) {
            return usuario;
        }
    }
}

// Instancia global del storage
const storage = new Storage();
