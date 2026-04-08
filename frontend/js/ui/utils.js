// ============================================
// Utilities - Funciones de Utilidad
// ============================================

const utils = {
    // Formatear fecha
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    // Formatear fecha y hora
    formatDateTime(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Formatear tiempo relativo
    timeAgo(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `hace ${minutes} min`;
        if (hours < 24) return `hace ${hours} horas`;
        if (days < 7) return `hace ${days} días`;
        return this.formatDate(dateString);
    },

    // Generar ID único
    generateId(prefix = 'ID') {
        return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
    },

    // Capitalizar primera letra
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Convertir a slug
    slugify(str) {
        return str.toLowerCase()
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    },

    // Validar email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Obtener clase de badge según estado
    getBadgeClass(estado) {
        return `badge-${estado}`;
    },

    // Obtener color según prioridad
    getPriorityColor(prioridad) {
        const colors = {
            baja: '#94a3b8',
            media: '#f59e0b',
            alta: '#f59e0b',
            critica: '#ef4444'
        };
        return colors[prioridad] || '#94a3b8';
    },

    // Obtener color según estado
    getStatusColor(estado) {
        const colors = {
            operativo: '#10b981',
            mantenimiento: '#3b82f6',
            fuera_servicio: '#ef4444',
            dado_baja: '#64748b',
            funcional: '#10b981',
            desgastado: '#f59e0b',
            daniado: '#ef4444',
            reemplazado: '#64748b',
            pendiente: '#f59e0b',
            asignada: '#3b82f6',
            en_progreso: '#3b82f6',
            pausada: '#64748b',
            completada: '#10b981',
            cancelada: '#64748b',
            activo: '#10b981',
            licencia: '#f59e0b',
            inactivo: '#64748b'
        };
        return colors[estado] || '#94a3b8';
    },

    // Truncar texto
    truncate(str, length = 50) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    // Obtener iniciales
    getInitials(name, surname = '') {
        const first = name ? name.charAt(0).toUpperCase() : '';
        const second = surname ? surname.charAt(0).toUpperCase() : '';
        return first + second || '?';
    },

    // Debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Exportar
window.utils = utils;
