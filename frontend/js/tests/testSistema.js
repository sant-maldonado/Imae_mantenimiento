// ============================================
// Test de Integración - Sistema de Mantenimiento
// ============================================

const testSistema = {
    async ejecutar() {
        console.log('🧪 INICIANDO TEST DEL SISTEMA...\n');
        
        let errores = [];
        let exitos = [];
        
        // Test 1: Verificar carga de datos
        console.log('TEST 1: Carga de datos desde API');
        try {
            const equipos = storage.getEquipos();
            const tecnicos = storage.getTecnicos();
            const tareas = storage.getTareas();
            const laboratorios = storage.getLaboratorios();
            const componentes = storage.getComponentes();
            
            if (equipos.length > 0) exitos.push('✅ Equipos cargados: ' + equipos.length);
            else errores.push('❌ No hay equipos cargados');
            
            if (tecnicos.length > 0) exitos.push('✅ Técnicos cargados: ' + tecnicos.length);
            else errores.push('❌ No hay técnicos cargados');
            
            if (tareas.length > 0) exitos.push('✅ Tareas cargadas: ' + tareas.length);
            else errores.push('❌ No hay tareas cargadas');
            
            if (laboratorios.length > 0) exitos.push('✅ Laboratorios cargados: ' + laboratorios.length);
            else errores.push('❌ No hay laboratorios cargados');
            
            if (componentes.length > 0) exitos.push('✅ Componentes cargados: ' + componentes.length);
            else errores.push('❌ No hay componentes cargados');
        } catch (e) {
            errores.push('❌ Error en carga de datos: ' + e.message);
        }

        // Test 2: Verificar campos requeridos en Equipos
        console.log('\nTEST 2: Verificar campos de Equipos');
        try {
            const equipos = storage.getEquipos();
            equipos.forEach(eq => {
                if (!eq.id) errores.push('❌ Equipo sin ID');
                if (!eq.nombre) errores.push('❌ Equipo sin nombre: ' + eq.id);
                if (!eq.estado && eq.estado !== null) errores.push('❌ Equipo sin estado: ' + eq.id);
                if (!eq.fecha_proximo_mantenimiento && eq.fecha_proximo_mantenimiento !== null) {
                    errores.push('❌ Equipo sin fecha_proximo_mantenimiento: ' + eq.id);
                }
                // Campos opcionales pero importantes
                if (eq.descripcion === undefined) errores.push('❌ Equipo sin campo descripcion: ' + eq.id);
            });
            if (equipos.length > 0) exitos.push('✅ Equipos tienen campos correctos');
        } catch (e) {
            errores.push('❌ Error verificando equipos: ' + e.message);
        }

        // Test 3: Verificar campos requeridos en Técnicos
        console.log('\nTEST 3: Verificar campos de Técnicos');
        try {
            const tecnicos = storage.getTecnicos();
            tecnicos.forEach(tec => {
                if (!tec.id) errores.push('❌ Técnico sin ID');
                if (!tec.nombre) errores.push('❌ Técnico sin nombre: ' + tec.id);
                if (!tec.estado && tec.estado !== null) errores.push('❌ Técnico sin estado: ' + tec.id);
            });
            if (tecnicos.length > 0) exitos.push('✅ Técnicos tienen campos correctos');
        } catch (e) {
            errores.push('❌ Error verificando técnicos: ' + e.message);
        }

        // Test 4: Verificar campos requeridos en Laboratorios
        console.log('\nTEST 4: Verificar campos de Laboratorios');
        try {
            const laboratorios = storage.getLaboratorios();
            laboratorios.forEach(lab => {
                if (!lab.id) errores.push('❌ Laboratorio sin ID');
                if (!lab.nombre) errores.push('❌ Laboratorio sin nombre: ' + lab.id);
            });
            if (laboratorios.length > 0) exitos.push('✅ Laboratorios tienen campos correctos');
        } catch (e) {
            errores.push('❌ Error verificando laboratorios: ' + e.message);
        }

        // Test 5: Verificar campos requeridos en Tareas
        console.log('\nTEST 5: Verificar campos de Tareas');
        try {
            const tareas = storage.getTareas();
            tareas.forEach(tar => {
                if (!tar.id) errores.push('❌ Tarea sin ID');
                if (!tar.titulo) errores.push('❌ Tarea sin título: ' + tar.id);
            });
            if (tareas.length > 0) exitos.push('✅ Tareas tienen campos correctos');
        } catch (e) {
            errores.push('❌ Error verificando tareas: ' + e.message);
        }

        // Test 6: Verificar componentes del UI
        console.log('\nTEST 6: Verificar componentes del UI');
        try {
            if (document.getElementById('equiposGrid')) exitos.push('✅ equiposGrid existe');
            else errores.push('❌ equiposGrid NO existe');
            
            if (document.getElementById('tecnicosGrid')) exitos.push('✅ tecnicosGrid existe');
            else errores.push('❌ tecnicosGrid NO existe');
            
            if (document.getElementById('laboratoriosGrid')) exitos.push('✅ laboratoriosGrid existe');
            else errores.push('❌ laboratoriosGrid NO existe');
            
            if (document.getElementById('tareasGrid')) exitos.push('✅ tareasGrid existe');
            else errores.push('❌ tareasGrid NO existe');
            
            if (document.getElementById('componentesGrid')) exitos.push('✅ componentesGrid existe');
            else errores.push('❌ componentesGrid NO existe');
        } catch (e) {
            errores.push('❌ Error verificando UI: ' + e.message);
        }

        // Mostrar resultados
        console.log('\n=== RESULTADOS DEL TEST ===');
        console.log('✅ PASADOS (' + exitos.length + '):');
        exitos.forEach(e => console.log(e));
        
        console.log('\n❌ ERRORES (' + errores.length + '):');
        errores.forEach(e => console.log(e));
        
        console.log('\n🧪 TEST FINALIZADO');
        
        return { exitos, errores };
    }
};

// Ejecutar test automáticamente
window.testSistema = testSistema;
console.log('🧪 Test disponible: ejecutá testSistema.ejecutar()');
