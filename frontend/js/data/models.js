// ============================================
// Modelos de Datos - Sistema de Mantenimiento
// ============================================

// Constantes de estados
const ESTADOS_EQUIPO = {
    OPERATIVO: 'operativo',
    MANTENIMIENTO: 'mantenimiento',
    FUERA_SERVICIO: 'fuera_servicio',
    DADO_BAJA: 'dado_baja'
};

const ESTADOS_COMPONENTE = {
    FUNCIONAL: 'funcional',
    DESGASTADO: 'desgastado',
    DAÑADO: 'daniado',
    REEMPLAZADO: 'reemplazado'
};

const ESTADOS_TAREA = {
    PENDIENTE: 'pendiente',
    ASIGNADA: 'asignada',
    EN_PROGRESO: 'en_progreso',
    PAUSADA: 'pausada',
    COMPLETADA: 'completada',
    CANCELADA: 'cancelada'
};

const TIPOS_TAREA = {
    PREVENTIVO: 'preventivo',
    CORRECTIVO: 'correctivo',
    PREDICTIVO: 'predictivo',
    EMERGENCIA: 'emergencia'
};

const PRIORIDADES = {
    BAJA: 'baja',
    MEDIA: 'media',
    ALTA: 'alta',
    CRITICA: 'critica'
};

const ESTADOS_TECNICO = {
    ACTIVO: 'activo',
    LICENCIA: 'licencia',
    INACTIVO: 'inactivo'
};

// Clase Laboratorio
class Laboratorio {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.nombre = data.nombre || '';
        this.codigo = data.codigo || '';
        this.ubicacion = data.ubicacion || '';
        this.responsable = data.responsable || '';
        this.activo = data.activo !== undefined ? data.activo : true;
        this.fecha_creacion = data.fecha_creacion || new Date().toISOString();
    }

    generateId() {
        return 'LAB-' + Date.now().toString(36).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            codigo: this.codigo,
            ubicacion: this.ubicacion,
            responsable: this.responsable,
            activo: this.activo,
            fecha_creacion: this.fecha_creacion
        };
    }
}

// Clase Equipo
class Equipo {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.id_laboratorio = data.id_laboratorio || '';
        this.nombre = data.nombre || '';
        this.codigo = data.codigo || '';
        this.tipo = data.tipo || '';
        this.marca = data.marca || '';
        this.modelo = data.modelo || '';
        this.numero_serie = data.numero_serie || '';
        this.fecha_adquisicion = data.fecha_adquisicion || '';
        this.fecha_instalacion = data.fecha_instalacion || '';
        this.estado = data.estado || ESTADOS_EQUIPO.OPERATIVO;
        this.prioridad_mantenimiento = data.prioridad_mantenimiento || 1;
        this.especificaciones = data.especificaciones || '';
        this.fecha_ultimo_mantenimiento = data.fecha_ultimo_mantenimiento || data.ultimo_mantenimiento || '';
        this.fecha_proximo_mantenimiento = data.fecha_proximo_mantenimiento || data.proximo_mantenimiento || '';
        this.observaciones = data.observaciones || '';
        this.activo = data.activo !== undefined ? data.activo : true;
    }

    generateId() {
        return 'EQ-' + Date.now().toString(36).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            id_laboratorio: this.id_laboratorio,
            nombre: this.nombre,
            codigo: this.codigo,
            tipo: this.tipo,
            marca: this.marca,
            modelo: this.modelo,
            numero_serie: this.numero_serie,
            fecha_adquisicion: this.fecha_adquisicion,
            fecha_instalacion: this.fecha_instalacion,
            estado: this.estado,
            prioridad_mantenimiento: this.prioridad_mantenimiento,
            especificaciones: this.especificaciones,
            ultimo_mantenimiento: this.fecha_ultimo_mantenimiento,
            proximo_mantenimiento: this.fecha_proximo_mantenimiento,
            descripcion: this.observaciones,
            activo: this.activo
        };
    }
}

// Clase Componente
class Componente {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.id_equipo = data.id_equipo || '';
        this.nombre = data.nombre || '';
        this.codigo = data.codigo || '';
        this.tipo = data.tipo || '';
        this.numero_serie = data.numero_serie || '';
        this.estado = data.estado || ESTADOS_COMPONENTE.FUNCIONAL;
        this.fecha_instalacion = data.fecha_instalacion || '';
        this.vida_util_meses = data.vida_util_meses || 12;
        this.especificaciones = data.especificaciones || '';
        this.observaciones = data.observaciones || '';
        this.activo = data.activo !== undefined ? data.activo : true;
    }

    generateId() {
        return 'COMP-' + Date.now().toString(36).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            id_equipo: this.id_equipo,
            nombre: this.nombre,
            codigo: this.codigo,
            tipo: this.tipo,
            numero_serie: this.numero_serie,
            estado: this.estado,
            fecha_instalacion: this.fecha_instalacion,
            vida_util_meses: this.vida_util_meses,
            especificaciones: this.especificaciones,
            observaciones: this.observaciones,
            activo: this.activo
        };
    }
}

// Clase Técnico
class Tecnico {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.nombre = data.nombre || '';
        this.apellido = data.apellido || '';
        this.legajo = data.legajo || '';
        this.email = data.email || '';
        this.telefono = data.telefono || '';
        this.especialidad = data.especialidad || '';
        this.estado = data.estado || ESTADOS_TECNICO.ACTIVO;
        this.fecha_contratacion = data.fecha_contratacion || data.fecha_ingreso || '';
        this.horas_trabajadas_mes = data.horas_trabajadas_mes || 0;
        this.activo = data.activo !== undefined ? data.activo : true;
        this.foto = data.foto || '';
    }

    generateId() {
        return 'TEC-' + Date.now().toString(36).toUpperCase();
    }

    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            legajo: this.legajo,
            email: this.email,
            telefono: this.telefono,
            especialidad: this.especialidad,
            estado: this.estado,
            fecha_contratacion: this.fecha_contratacion,
            horas_trabajadas_mes: this.horas_trabajadas_mes,
            activo: this.activo
        };
    }
}

// Clase Tarea
class Tarea {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.id_equipo = data.id_equipo || '';
        this.id_componente = data.id_componente || '';
        this.tipo_tarea = data.tipo_tarea || TIPOS_TAREA.PREVENTIVO;
        this.titulo = data.titulo || '';
        this.descripcion = data.descripcion || '';
        this.prioridad = data.prioridad || PRIORIDADES.MEDIA;
        this.estado = data.estado || ESTADOS_TAREA.PENDIENTE;
        this.fecha_creacion = data.fecha_creacion || new Date().toISOString();
        this.fecha_programada = data.fecha_programada || '';
        this.fecha_inicio_real = data.fecha_inicio_real || '';
        this.fecha_fin_real = data.fecha_fin_real || '';
        this.duracion_estimada_horas = data.duracion_estimada_horas || 1;
        this.duracion_real_horas = data.duracion_real_horas || 0;
        this.materiales_requeridos = data.materiales_requeridos || '';
        this.herramientas_requeridas = data.herramientas_requeridas || '';
        this.procedimiento = data.procedimiento || '';
        this.resultado = data.resultado || '';
        this.observaciones = data.observaciones || '';
        this.asignaciones = data.asignaciones || [];
    }

    generateId() {
        return 'TAR-' + Date.now().toString(36).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            id_equipo: this.id_equipo,
            id_componente: this.id_componente,
            tipo_tarea: this.tipo_tarea,
            titulo: this.titulo,
            descripcion: this.descripcion,
            prioridad: this.prioridad,
            estado: this.estado,
            fecha_creacion: this.fecha_creacion,
            fecha_programada: this.fecha_programada,
            fecha_inicio_real: this.fecha_inicio_real,
            fecha_fin_real: this.fecha_fin_real,
            duracion_estimada_horas: this.duracion_estimada_horas,
            duracion_real_horas: this.duracion_real_horas,
            materiales_requeridos: this.materiales_requeridos,
            herramientas_requeridas: this.herramientas_requeridas,
            procedimiento: this.procedimiento,
            resultado: this.resultado,
            observaciones: this.observaciones,
            asignaciones: this.asignaciones
        };
    }
}

// Clase Asignación
class Asignacion {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.id_tarea = data.id_tarea || '';
        this.id_tecnico = data.id_tecnico || '';
        this.rol = data.rol || 'responsable';
        this.fecha_asignacion = data.fecha_asignacion || new Date().toISOString();
        this.fecha_aceptacion = data.fecha_aceptacion || '';
        this.fecha_liberacion = data.fecha_liberacion || '';
        this.horas_trabajadas = data.horas_trabajadas || 0;
        this.estado_asignacion = data.estado_asignacion || 'activa';
    }

    generateId() {
        return 'ASIG-' + Date.now().toString(36).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            id_tarea: this.id_tarea,
            id_tecnico: this.id_tecnico,
            rol: this.rol,
            fecha_asignacion: this.fecha_asignacion,
            fecha_aceptacion: this.fecha_aceptacion,
            fecha_liberacion: this.fecha_liberacion,
            horas_trabajadas: this.horas_trabajadas,
            estado_asignacion: this.estado_asignacion
        };
    }
}

// Clase Historial de Estado
class HistorialEstado {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.entidad_tipo = data.entidad_tipo || '';
        this.entidad_id = data.entidad_id || '';
        this.estado_anterior = data.estado_anterior || '';
        this.estado_nuevo = data.estado_nuevo || '';
        this.motivo = data.motivo || '';
        this.usuario_cambio = data.usuario_cambio || 'Sistema';
        this.fecha_cambio = data.fecha_cambio || new Date().toISOString();
    }

    generateId() {
        return 'HIST-' + Date.now().toString(36).toUpperCase();
    }

    toJSON() {
        return {
            id: this.id,
            entidad_tipo: this.entidad_tipo,
            entidad_id: this.entidad_id,
            estado_anterior: this.estado_anterior,
            estado_nuevo: this.estado_nuevo,
            motivo: this.motivo,
            usuario_cambio: this.usuario_cambio,
            fecha_cambio: this.fecha_cambio
        };
    }
}

