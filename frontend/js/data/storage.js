// Servicio de almacenamiento - Ahora usa API REST en lugar de localStorage
const API_URL = "http://127.0.0.1:8000/api";

class Storage {
    constructor() {
        this.cache = {
            laboratorios: [],
            equipos: [],
            componentes: [],
            tecnicos: [],
            tareas: []
        };
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await this.loadAll();
            this.initialized = true;
            console.log('✅ Datos cargados desde la API');
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            this.loadSampleData();
        }
    }

    async loadAll() {
        const [labs, eqs, comps, tecs, tars] = await Promise.all([
            this.fetchAPI('/laboratorios'),
            this.fetchAPI('/equipos'),
            this.fetchAPI('/componentes'),
            this.fetchAPI('/tecnicos'),
            this.fetchAPI('/tareas')
        ]);

        console.log('DEBUG loadAll - componentes:', comps);

        this.cache.laboratorios = labs || [];
        this.cache.equipos = eqs || [];
        this.cache.componentes = comps || [];
        this.cache.tecnicos = tecs || [];
        this.cache.tareas = tars || [];
    }

    async fetchAPI(endpoint, options = {}) {
        try {
           const response = await fetch(`http://127.0.0.1:8000/api${endpoint}`,  {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            const text = await response.text();
            if (!response.ok) {
                console.error(`Error en API ${endpoint}: HTTP ${response.status}`, text);
                throw new Error(`HTTP ${response.status}: ${text}`);
            }
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error(`Error en API ${endpoint}:`, error);
            throw error;
        }
    }
    
    async refresh() {
        await this.loadAll();
    }

    getLaboratorios() { return this.cache.laboratorios; }
    getEquipos() { return this.cache.equipos; }
    getEquiposByLaboratorio(id) { return this.cache.equipos.filter(e => e.id_laboratorio === id); }
    getComponentes() { 
        console.log('DEBUG getComponentes called, cache:', this.cache.componentes);
        return this.cache.componentes; 
    }
    getComponentesByEquipo(id) { return this.cache.componentes.filter(c => c.id_equipo === id); }
    getTecnicos() { return this.cache.tecnicos; }
    getTareas() { return this.cache.tareas; }
    getTareasByEquipo(id) { return this.cache.tareas.filter(t => t.id_equipo === id); }

    async addLaboratorio(lab) {
        const result = await this.fetchAPI('/laboratorios', { method: 'POST', body: JSON.stringify(lab) });
        if (result) this.cache.laboratorios.push(result);
        return result;
    }

    async updateLaboratorio(id, data) {
        const result = await this.fetchAPI(`/laboratorios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        if (result) {
            const idx = this.cache.laboratorios.findIndex(l => l.id === id);
            if (idx !== -1) this.cache.laboratorios[idx] = result;
        }
        return result;
    }

    async deleteLaboratorio(id) {
        const result = await this.fetchAPI(`/laboratorios/${id}`, { method: 'DELETE' });
        if (result) this.cache.laboratorios = this.cache.laboratorios.filter(l => l.id !== id);
        return result;
    }

    async addEquipo(eq) {
        const result = await this.fetchAPI('/equipos', { method: 'POST', body: JSON.stringify(eq) });
        if (result) this.cache.equipos.push(result);
        return result;
    }

    async updateEquipo(id, data) {
        const result = await this.fetchAPI(`/equipos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        if (result) {
            const idx = this.cache.equipos.findIndex(e => e.id === id);
            if (idx !== -1) this.cache.equipos[idx] = result;
        }
        return result;
    }

    async deleteEquipo(id) {
        const result = await this.fetchAPI(`/equipos/${id}`, { method: 'DELETE' });
        if (result) this.cache.equipos = this.cache.equipos.filter(e => e.id !== id);
        return result;
    }

    async addComponente(comp) {
        const result = await this.fetchAPI('/componentes', { method: 'POST', body: JSON.stringify(comp) });
        if (result) this.cache.componentes.push(result);
        return result;
    }

    async updateComponente(id, data) {
        const result = await this.fetchAPI(`/componentes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        if (result) {
            const idx = this.cache.componentes.findIndex(c => c.id === id);
            if (idx !== -1) this.cache.componentes[idx] = result;
        }
        return result;
    }

    async deleteComponente(id) {
        const result = await this.fetchAPI(`/componentes/${id}`, { method: 'DELETE' });
        if (result) this.cache.componentes = this.cache.componentes.filter(c => c.id !== id);
        return result;
    }

    async addTecnico(tec) {
        const result = await this.fetchAPI('/tecnicos', { method: 'POST', body: JSON.stringify(tec) });
        if (result) this.cache.tecnicos.push(result);
        return result;
    }

    async updateTecnico(id, data) {
        const result = await this.fetchAPI(`/tecnicos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        if (result) {
            const idx = this.cache.tecnicos.findIndex(t => t.id === id);
            if (idx !== -1) this.cache.tecnicos[idx] = result;
        }
        return result;
    }

    async deleteTecnico(id) {
        const result = await this.fetchAPI(`/tecnicos/${id}`, { method: 'DELETE' });
        if (result) this.cache.tecnicos = this.cache.tecnicos.filter(t => t.id !== id);
        return result;
    }

    async addTarea(tarea) {
        const result = await this.fetchAPI('/tareas', { method: 'POST', body: JSON.stringify(tarea) });
        if (result) this.cache.tareas.push(result);
        return result;
    }

    async updateTarea(id, data) {
        const result = await this.fetchAPI(`/tareas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        if (result) {
            const idx = this.cache.tareas.findIndex(t => t.id === id);
            if (idx !== -1) this.cache.tareas[idx] = result;
        }
        return result;
    }

    async deleteTarea(id) {
        const result = await this.fetchAPI(`/tareas/${id}`, { method: 'DELETE' });
        if (result) this.cache.tareas = this.cache.tareas.filter(t => t.id !== id);
        return result;
    }

    async saveTarea(tarea) {
        if (tarea.id) {
            const existente = this.cache.tareas.find(t => t.id === tarea.id);
            if (existente) return await this.updateTarea(tarea.id, tarea);
        }
        return await this.addTarea(tarea);
    }

    async saveTecnico(tecnico) {
        if (tecnico.id) {
            const existente = this.cache.tecnicos.find(t => t.id === tecnico.id);
            if (existente) return await this.updateTecnico(tecnico.id, tecnico);
        }
        return await this.addTecnico(tecnico);
    }

    async saveLaboratorio(laboratorio) {
        if (laboratorio.id) {
            const existente = this.cache.laboratorios.find(l => l.id === laboratorio.id);
            if (existente) return await this.updateLaboratorio(laboratorio.id, laboratorio);
        }
        return await this.addLaboratorio(laboratorio);
    }

    async saveEquipo(equipo) {
        if (equipo.id) {
            const existente = this.cache.equipos.find(e => e.id === equipo.id);
            if (existente) return await this.updateEquipo(equipo.id, equipo);
        }
        return await this.addEquipo(equipo);
    }

    async saveComponente(componente) {
        if (componente.id) {
            const existente = this.cache.componentes.find(c => c.id === componente.id);
            if (existente) return await this.updateComponente(componente.id, componente);
        }
        return await this.addComponente(componente);
    }

    loadSampleData() {}
}

const storage = new Storage();