// ============================================
// Datos de Ejemplo - Sample Data
// ============================================

const sampleData = {
    // Laboratorios de ejemplo
    laboratorios: [
        {
            id: 'LAB-001',
            nombre: 'Laboratorio de Química Analítica',
            codigo: 'LAB-QA',
            ubicacion: 'Edificio A, Planta Baja',
            responsable: 'Dr. María García',
            activo: true,
            fecha_creacion: '2024-01-15T10:00:00.000Z'
        },
        {
            id: 'LAB-002',
            nombre: 'Laboratorio de Biología Molecular',
            codigo: 'LAB-BM',
            ubicacion: 'Edificio A, Primer Piso',
            responsable: 'Dr. Carlos López',
            activo: true,
            fecha_creacion: '2024-01-20T10:00:00.000Z'
        },
        {
            id: 'LAB-003',
            nombre: 'Laboratorio de Física Aplicada',
            codigo: 'LAB-FA',
            ubicacion: 'Edificio B, Planta Baja',
            responsable: 'Dra. Ana Martínez',
            activo: true,
            fecha_creacion: '2024-02-01T10:00:00.000Z'
        }
    ],

    // Equipos de ejemplo
    equipos: [
        // Equipos del Laboratorio de Química
        {
            id: 'EQ-001',
            id_laboratorio: 'LAB-001',
            nombre: 'Centrífuga Refrigerada',
            codigo: 'EQ-CRF-001',
            tipo: 'Centrífuga',
            marca: 'Thermo Fisher',
            modelo: 'Sorvall X4',
            numero_serie: 'TF-2023-12345',
            fecha_adquisicion: '2023-06-15',
            fecha_instalacion: '2023-07-01',
            estado: 'operativo',
            prioridad_mantenimiento: 2,
            especificaciones: 'Velocidad máx: 15000 RPM, Capacidad: 6x500ml',
            ultimo_mantenimiento: '2025-02-10',
            proximo_mantenimiento: '2025-05-10',
            observaciones: 'Equipo de alto uso',
            activo: true
        },
        {
            id: 'EQ-002',
            id_laboratorio: 'LAB-001',
            nombre: 'Espectrofotómetro UV-Vis',
            codigo: 'EQ-EUV-001',
            tipo: 'Espectrómetro',
            marca: 'Shimadzu',
            modelo: 'UV-1900i',
            numero_serie: 'SH-2022-98765',
            fecha_adquisicion: '2022-11-20',
            fecha_instalacion: '2022-12-05',
            estado: 'operativo',
            prioridad_mantenimiento: 1,
            especificaciones: 'Rango: 190-1100nm, Precisión: ±0.5nm',
            ultimo_mantenimiento: '2025-01-15',
            proximo_mantenimiento: '2025-04-15',
            observaciones: '',
            activo: true
        },
        {
            id: 'EQ-003',
            id_laboratorio: 'LAB-001',
            nombre: 'Baño María Ultratermostático',
            codigo: 'EQ-BMU-001',
            tipo: 'Baño María',
            marca: 'Julabo',
            modelo: 'F12-ME',
            numero_serie: 'JB-2021-54321',
            fecha_adquisicion: '2021-03-10',
            fecha_instalacion: '2021-04-01',
            estado: 'mantenimiento',
            prioridad_mantenimiento: 2,
            especificaciones: 'Rango temp: -20°C a 200°C',
            ultimo_mantenimiento: '2025-03-01',
            proximo_mantenimiento: '2025-03-20',
            observations: 'Fuga de refrigerante detectada',
            activo: true
        },
        {
            id: 'EQ-004',
            id_laboratorio: 'LAB-001',
            nombre: 'pH-metro de Mesa',
            codigo: 'EQ-PHM-001',
            tipo: 'Medidor',
            marca: 'Mettler Toledo',
            modelo: 'SevenCompact',
            numero_serie: 'MT-2023-11111',
            fecha_adquisicion: '2023-09-01',
            fecha_instalacion: '2023-09-15',
            estado: 'operativo',
            prioridad_mantenimiento: 3,
            especificaciones: 'Rango: -2.00 a 20.00 pH',
            ultimo_mantenimiento: '2025-02-20',
            proximo_mantenimiento: '2025-05-20',
            observaciones: '',
            activo: true
        },
        
        // Equipos del Laboratorio de Biología
        {
            id: 'EQ-005',
            id_laboratorio: 'LAB-002',
            nombre: 'Microscopio de Fluorescencia',
            codigo: 'EQ-MFL-001',
            tipo: 'Microscopio',
            marca: 'Olympus',
            modelo: 'BX53',
            numero_serie: 'OL-2022-77777',
            fecha_adquisicion: '2022-08-15',
            fecha_instalacion: '2022-09-01',
            estado: 'operativo',
            prioridad_mantenimiento: 1,
            especificaciones: 'Epifluorescencia, 4 canales',
            ultimo_mantenimiento: '2025-02-05',
            proximo_mantenimiento: '2025-05-05',
            observaciones: '',
            activo: true
        },
        {
            id: 'EQ-006',
            id_laboratorio: 'LAB-002',
            nombre: 'Termociclador (PCR)',
            codigo: 'EQ-TCP-001',
            tipo: 'Termociclador',
            marca: 'Bio-Rad',
            modelo: 'T100',
            numero_serie: 'BR-2023-22222',
            fecha_adquisicion: '2023-04-20',
            fecha_instalacion: '2023-05-10',
            estado: 'operativo',
            prioridad_mantenimiento: 1,
            especificaciones: '96 wells, gradiente',
            ultimo_mantenimiento: '2025-01-25',
            proximo_mantenimiento: '2025-04-25',
            observaciones: '',
            activo: true
        },
        {
            id: 'EQ-007',
            id_laboratorio: 'LAB-002',
            nombre: 'Autoclave de Laboratorio',
            codigo: 'EQ-AUT-001',
            tipo: 'Esterilizador',
            marca: 'Tuttnauer',
            modelo: '3870EA',
            numero_serie: 'TT-2021-88888',
            fecha_adquisicion: '2021-07-01',
            fecha_instalacion: '2021-08-15',
            estado: 'fuera_servicio',
            prioridad_mantenimiento: 1,
            especificaciones: 'Capacidad: 75L, Temp máx: 137°C',
            ultimo_mantenimiento: '2025-02-28',
            proximo_mantenimiento: '2025-03-15',
            observaciones: 'Problema con la válvula de seguridad',
            activo: true
        },
        
        // Equipos del Laboratorio de Física
        {
            id: 'EQ-008',
            id_laboratorio: 'LAB-003',
            nombre: 'Espectrómetro de Masas',
            codigo: 'EQ-EMS-001',
            tipo: 'Espectrómetro',
            marca: 'Agilent',
            modelo: '7890B-5977B',
            numero_serie: 'AG-2022-33333',
            fecha_adquisicion: '2022-05-10',
            fecha_instalacion: '2022-06-20',
            estado: 'operativo',
            prioridad_mantenimiento: 1,
            especificaciones: 'Alta resolución, ionización EI/CI',
            ultimo_mantenimiento: '2025-03-01',
            proximo_mantenimiento: '2025-06-01',
            observaciones: 'Calibración programada',
            activo: true
        },
        {
            id: 'EQ-009',
            id_laboratorio: 'LAB-003',
            nombre: 'Cámara de Vacío',
            codigo: 'EQ-CVU-001',
            tipo: 'Cámara',
            marca: 'Kurt J. Lesker',
            modelo: 'KJL-24',
            numero_serie: 'KJL-2023-44444',
            fecha_adquisicion: '2023-02-28',
            fecha_instalacion: '2023-04-15',
            estado: 'operativo',
            prioridad_mantenimiento: 2,
            especificaciones: 'Vacío base: 10^-6 Torr',
            ultimo_mantenimiento: '2025-02-15',
            proximo_mantenimiento: '2025-05-15',
            observaciones: '',
            activo: true
        },
        {
            id: 'EQ-010',
            id_laboratorio: 'LAB-003',
            nombre: 'Criostato',
            codigo: 'EQ-CRI-001',
            tipo: 'Equipos criogénico',
            marca: 'Leica',
            modelo: 'CM3050 S',
            numero_serie: 'LE-2021-55555',
            fecha_adquisicion: '2021-11-10',
            fecha_instalacion: '2021-12-20',
            estado: 'mantenimiento',
            prioridad_mantenimiento: 2,
            especificaciones: 'Temp: -30°C a 0°C',
            ultimo_mantenimiento: '2025-03-10',
            proximo_mantenimiento: '2025-03-25',
            observations: 'Problema de compresión',
            activo: true
        }
    ],

    // Componentes de ejemplo
    componentes: [
        // Componentes de centrífuga EQ-001
        {
            id: 'COMP-001',
            id_equipo: 'EQ-001',
            nombre: 'Rotor de 6 plazas',
            codigo: 'ROT-6P-001',
            tipo: 'Rotor',
            numero_serie: 'ROT-2023-001',
            estado: 'funcional',
            fecha_instalacion: '2023-07-01',
            vida_util_meses: 24,
            especificaciones: 'Capacidad 6x500ml',
            observaciones: '',
            activo: true
        },
        {
            id: 'COMP-002',
            id_equipo: 'EQ-001',
            nombre: 'Sensor de temperatura',
            codigo: 'SEN-TMP-001',
            tipo: 'Sensor',
            numero_serie: 'SEN-2023-002',
            estado: 'funcional',
            fecha_instalacion: '2023-07-01',
            vida_util_meses: 36,
            especificaciones: 'Rango: -20°C a 40°C',
            observaciones: '',
            activo: true
        },
        
        // Componentes de espectrofotómetro EQ-002
        {
            id: 'COMP-003',
            id_equipo: 'EQ-002',
            nombre: 'Lámpara de deuterio',
            codigo: 'LAMP-D2-001',
            tipo: 'Lámpara',
            numero_serie: 'LAMP-2022-001',
            estado: 'desgastado',
            fecha_instalacion: '2022-12-05',
            vida_util_meses: 12,
            especificaciones: 'Vida útil: 2000 horas',
            observaciones: 'Próximo reemplazo',
            activo: true
        },
        {
            id: 'COMP-004',
            id_equipo: 'EQ-002',
            nombre: 'Cubetas de cuarzo',
            codigo: 'CUB-CU-001',
            tipo: 'Accesorio',
            numero_serie: 'CUB-2022-001',
            estado: 'funcional',
            fecha_instalacion: '2022-12-05',
            vida_util_meses: 24,
            especificaciones: 'Set de 4 cubetas',
            observaciones: '',
            activo: true
        },
        
        // Componentes de microscopio EQ-005
        {
            id: 'COMP-005',
            id_equipo: 'EQ-005',
            nombre: 'Filtro de fluorescencia GFP',
            codigo: 'FILT-GFP-001',
            tipo: 'Filtro',
            numero_serie: 'FILT-2022-001',
            estado: 'funcional',
            fecha_instalacion: '2022-09-01',
            vida_util_meses: 36,
            especificaciones: 'Ex: 488nm, Em: 509nm',
            observaciones: '',
            activo: true
        },
        {
            id: 'COMP-006',
            id_equipo: 'EQ-005',
            nombre: 'Lámpara de mercurio 100W',
            codigo: 'LAMP-HG-001',
            tipo: 'Lámpara',
            numero_serie: 'LAMP-2022-002',
            estado: 'desgastado',
            fecha_instalacion: '2022-09-01',
            vida_util_meses: 18,
            especificaciones: '100W HBO',
            observaciones: 'Reducción de intensidad',
            activo: true
        },
        
        // Componentes de autoclave EQ-007
        {
            id: 'COMP-007',
            id_equipo: 'EQ-007',
            nombre: 'Válvula de seguridad',
            codigo: 'VALV-SEC-001',
            tipo: 'Válvula',
            numero_serie: 'VALV-2021-001',
            estado: 'daniado',
            fecha_instalacion: '2021-08-15',
            vida_util_meses: 48,
            especificaciones: 'Presión máx: 2.5 bar',
            observaciones: 'Requiere reemplazo',
            activo: true
        },
        
        // Componentes de espectrómetro EQ-008
        {
            id: 'COMP-008',
            id_equipo: 'EQ-008',
            nombre: 'Filamento de ionización',
            codigo: 'FIL-ION-001',
            tipo: 'Filamento',
            numero_serie: 'FIL-2022-001',
            estado: 'funcional',
            fecha_instalacion: '2022-06-20',
            vida_util_meses: 12,
            especificaciones: 'Emisor de electrones',
            observaciones: '',
            activo: true
        },
        
        // Componentes adicionales
        {
            id: 'COMP-009',
            id_equipo: 'EQ-003',
            nombre: 'Compresor de refrigeración',
            codigo: 'COMP-REF-001',
            tipo: 'Compresor',
            numero_serie: 'COMP-2021-001',
            estado: 'daniado',
            fecha_instalacion: '2021-04-01',
            vida_util_meses: 60,
            especificaciones: '1.5 HP',
            observaciones: 'Fuga de refrigerante',
            activo: true
        },
        {
            id: 'COMP-010',
            id_equipo: 'EQ-006',
            nombre: 'Placa térmica',
            codigo: 'PLAC-TERM-001',
            tipo: 'Placa',
            numero_serie: 'PLAC-2023-001',
            estado: 'funcional',
            fecha_instalacion: '2023-05-10',
            vida_util_meses: 48,
            especificaciones: 'Rango: 0-99°C',
            observaciones: '',
            activo: true
        }
    ],

    // Técnicos de ejemplo
    tecnicos: [
        {
            id: 'TEC-001',
            nombre: 'Juan',
            apellido: 'Pérez',
            legajo: 'TEC-001',
            email: 'juan.perez@fabrica.com',
            telefono: '1155551234',
            especialidad: 'Electromecánica',
            estado: 'activo',
            fecha_ingreso: '2022-03-15',
            horas_trabajadas_mes: 160,
            activo: true
        },
        {
            id: 'TEC-002',
            nombre: 'María',
            apellido: 'Rodríguez',
            legajo: 'TEC-002',
            email: 'maria.rodriguez@fabrica.com',
            telefono: '1155552345',
            especialidad: 'Electrónica',
            estado: 'activo',
            fecha_ingreso: '2021-08-20',
            horas_trabajadas_mes: 168,
            activo: true
        },
        {
            id: 'TEC-003',
            nombre: 'Carlos',
            apellido: 'Gómez',
            legajo: 'TEC-003',
            email: 'carlos.gomez@fabrica.com',
            telefono: '1155553456',
            especialidad: 'Instrumentación',
            estado: 'activo',
            fecha_ingreso: '2023-01-10',
            horas_trabajadas_mes: 152,
            activo: true
        },
        {
            id: 'TEC-004',
            nombre: 'Ana',
            apellido: 'López',
            legajo: 'TEC-004',
            email: 'ana.lopez@fabrica.com',
            telefono: '1155554567',
            especialidad: 'General',
            estado: 'activo',
            fecha_ingreso: '2022-06-01',
            horas_trabajadas_mes: 164,
            activo: true
        },
        {
            id: 'TEC-005',
            nombre: 'Pedro',
            apellido: 'Sánchez',
            legajo: 'TEC-005',
            email: 'pedro.sanchez@fabrica.com',
            telefono: '1155555678',
            especialidad: 'Refrigeración',
            estado: 'licencia',
            fecha_ingreso: '2021-11-15',
            horas_trabajadas_mes: 40,
            activo: true
        }
    ],

    // Tareas de ejemplo
    tareas: [
        {
            id: 'TAR-001',
            id_equipo: 'EQ-001',
            id_componente: '',
            tipo_tarea: 'preventivo',
            titulo: 'Mantenimiento preventivo centrífuga',
            descripcion: 'Limpieza del rotor, verificación de calibración de velocidad, inspección de belts',
            prioridad: 'media',
            estado: 'pendiente',
            fecha_creacion: '2025-03-15T10:00:00.000Z',
            fecha_programada: '2025-03-25',
            fecha_inicio_real: '',
            fecha_fin_real: '',
            duracion_estimada_horas: 4,
            duracion_real_horas: 0,
            materiales_requeridos: 'Lubricante, limpiador',
            herramientas_requeridas: 'Llaves allen, multímetro',
            procedimiento: '1. Apagar y desconectar\n2. Retirar rotor\n3. Limpiar\n4. Lubricar\n5. Verificar velocidad\n6. Probar funcionamiento',
            resultado: '',
            observaciones: '',
            asignaciones: []
        },
        {
            id: 'TAR-002',
            id_equipo: 'EQ-003',
            id_componente: 'COMP-009',
            tipo_tarea: 'correctivo',
            titulo: 'Reparación compresor baño María',
            descripcion: 'Detección y reparación de fuga de refrigerante, recarga de gas',
            prioridad: 'alta',
            estado: 'en_progreso',
            fecha_creacion: '2025-03-10T09:00:00.000Z',
            fecha_programada: '2025-03-18',
            fecha_inicio_real: '2025-03-17T08:00:00.000Z',
            fecha_fin_real: '',
            duracion_estimada_horas: 8,
            duracion_real_horas: 3,
            materiales_requeridos: 'Refrigerante R-134a, aceite lubricante',
            herramientas_requeridas: 'Manifold, bomba de vacío,Detector de fugas',
            procedimiento: '1. Extraer refrigerante\n2. Localizar fuga\n3. Reparar\n4. Realizar vacío\n5. Recargar refrigerante',
            resultado: '',
            observaciones: 'Fuga localizada en unión del evaporador',
            asignaciones: [
                {
                    id: 'ASIG-001',
                    id_tarea: 'TAR-002',
                    id_tecnico: 'TEC-005',
                    rol: 'responsable',
                    fecha_asignacion: '2025-03-10T09:30:00.000Z',
                    fecha_aceptacion: '2025-03-10T10:00:00.000Z',
                    fecha_liberacion: '',
                    horas_trabajadas: 3,
                    estado_asignacion: 'activa'
                }
            ]
        },
        {
            id: 'TAR-003',
            id_equipo: 'EQ-007',
            id_componente: 'COMP-007',
            tipo_tarea: 'correctivo',
            titulo: 'Reemplazo válvula de seguridad autoclave',
            descripcion: 'La válvula de seguridad está dañada y requiere reemplazo',
            prioridad: 'critica',
            estado: 'pendiente',
            fecha_creacion: '2025-03-12T14:00:00.000Z',
            fecha_programada: '2025-03-20',
            fecha_inicio_real: '',
            fecha_fin_real: '',
            duracion_estimada_horas: 2,
            duracion_real_horas: 0,
            materiales_requeridos: 'Válvula de seguridad nueva',
            herramientas_requeridas: 'Llaves, detector de fugas',
            procedimiento: '1. Depressurizar\n2. Reemplazar válvula\n3. Probar',
            resultado: '',
            observaciones: 'Equipo fuera de servicio hasta reparación',
            asignaciones: []
        },
        {
            id: 'TAR-004',
            id_equipo: 'EQ-002',
            id_componente: 'COMP-003',
            tipo_tarea: 'predictivo',
            titulo: 'Reemplazo lámpara deuterio',
            descripcion: 'Lámpara alcanzando fin de vida útil, programar reemplazo',
            prioridad: 'media',
            estado: 'asignada',
            fecha_creacion: '2025-03-01T10:00:00.000Z',
            fecha_programada: '2025-03-22',
            fecha_inicio_real: '',
            fecha_fin_real: '',
            duracion_estimada_horas: 1,
            duracion_real_horas: 0,
            materiales_requeridos: 'Lámpara de deuterio de repuesto',
            herramientas_requeridas: '',
            procedimiento: '1. Apagar equipo\n2. Esperar enfriamiento\n3. Reemplazar lámpara\n4. Calibrar',
            resultado: '',
            observaciones: '',
            asignaciones: [
                {
                    id: 'ASIG-002',
                    id_tarea: 'TAR-004',
                    id_tecnico: 'TEC-002',
                    rol: 'responsable',
                    fecha_asignacion: '2025-03-02T09:00:00.000Z',
                    fecha_aceptacion: '2025-03-02T09:30:00.000Z',
                    fecha_liberacion: '',
                    horas_trabajadas: 0,
                    estado_asignacion: 'activa'
                }
            ]
        },
        {
            id: 'TAR-005',
            id_equipo: 'EQ-005',
            id_componente: 'COMP-006',
            tipo_tarea: 'preventivo',
            titulo: 'Reemplazo lámpara mercurio microscopio',
            descripcion: 'Lámpara de mercurio perdiendo intensidad, programar reemplazo',
            prioridad: 'alta',
            estado: 'completada',
            fecha_creacion: '2025-02-20T10:00:00.000Z',
            fecha_programada: '2025-03-10',
            fecha_inicio_real: '2025-03-10T09:00:00.000Z',
            fecha_fin_real: '2025-03-10T10:30:00.000Z',
            duracion_estimada_horas: 2,
            duracion_real_horas: 1.5,
            materiales_requeridos: 'Lámpara HBO 100W',
            herramientas_requeridas: '',
            procedimiento: '1. Apagar y enfriar\n2. Reemplazar lámpara\n3. Alinear\n4. Probar',
            resultado: 'Lámpara reemplazada exitosamente. Equipo funcionando correctamente.',
            observaciones: '',
            asignaciones: [
                {
                    id: 'ASIG-003',
                    id_tarea: 'TAR-005',
                    id_tecnico: 'TEC-003',
                    rol: 'responsable',
                    fecha_asignacion: '2025-02-21T09:00:00.000Z',
                    fecha_aceptacion: '2025-02-21T09:30:00.000Z',
                    fecha_liberacion: '2025-03-10T10:30:00.000Z',
                    horas_trabajadas: 1.5,
                    estado_asignacion: 'completada'
                }
            ]
        },
        {
            id: 'TAR-006',
            id_equipo: 'EQ-008',
            id_componente: 'COMP-008',
            tipo_tarea: 'preventivo',
            titulo: 'Calibración espectrómetro de masas',
            descripcion: 'Calibración de rutina y verificación de vacío',
            prioridad: 'alta',
            estado: 'pendiente',
            fecha_creacion: '2025-03-15T11:00:00.000Z',
            fecha_programada: '2025-03-28',
            fecha_inicio_real: '',
            fecha_fin_real: '',
            duracion_estimada_horas: 6,
            duracion_real_horas: 0,
            materiales_requeridos: 'Gas de calibración PFTBA',
            herramientas_requeridas: 'Computadora con software',
            procedimiento: '1. Verificar vacío\n2. Calibrar masa\n3. Verificar sensibilidad',
            resultado: '',
            observaciones: '',
            asignaciones: []
        },
        {
            id: 'TAR-007',
            id_equipo: 'EQ-010',
            id_componente: '',
            tipo_tarea: 'correctivo',
            titulo: 'Reparación criostato',
            descripcion: 'Problema con sistema de compresión, revisar gas refrigerante',
            prioridad: 'alta',
            estado: 'asignada',
            fecha_creacion: '2025-03-14T15:00:00.000Z',
            fecha_programada: '2025-03-21',
            fecha_inicio_real: '',
            fecha_fin_real: '',
            duracion_estimada_horas: 4,
            duracion_real_horas: 0,
            materiales_requeridos: 'Gas nitrógeno, conexiones',
            herramientas_requeridas: 'Manifold, llaves',
            procedimiento: '1. Diagnosticar sistema\n2. Verificar presiones\n3. Reparar',
            resultado: '',
            observaciones: '',
            asignaciones: [
                {
                    id: 'ASIG-004',
                    id_tarea: 'TAR-007',
                    id_tecnico: 'TEC-001',
                    rol: 'responsable',
                    fecha_asignacion: '2025-03-14T16:00:00.000Z',
                    fecha_aceptacion: '2025-03-15T08:00:00.000Z',
                    fecha_liberacion: '',
                    horas_trabajadas: 0,
                    estado_asignacion: 'activa'
                }
            ]
        },
        {
            id: 'TAR-008',
            id_equipo: 'EQ-004',
            id_componente: '',
            tipo_tarea: 'preventivo',
            titulo: 'Calibración pH-metro',
            descripcion: 'Calibración de electrodos y verificación de lectura',
            prioridad: 'baja',
            estado: 'completada',
            fecha_creacion: '2025-02-15T10:00:00.000Z',
            fecha_programada: '2025-02-20',
            fecha_inicio_real: '2025-02-20T09:00:00.000Z',
            fecha_fin_real: '2025-02-20T10:00:00.000Z',
            duracion_estimada_horas: 1,
            duracion_real_horas: 1,
            materiales_requeridos: 'Soluciones buffer pH 4, 7, 10',
            herramientas_requeridas: '',
            procedimiento: '1. Preparar soluciones\n2. Calibrar\n3. Verificar',
            resultado: 'Equipo calibrado correctamente',
            observaciones: '',
            asignaciones: [
                {
                    id: 'ASIG-005',
                    id_tarea: 'TAR-008',
                    id_tecnico: 'TEC-004',
                    rol: 'responsable',
                    fecha_asignacion: '2025-02-16T09:00:00.000Z',
                    fecha_aceptacion: '2025-02-16T09:30:00.000Z',
                    fecha_liberacion: '2025-02-20T10:00:00.000Z',
                    horas_trabajadas: 1,
                    estado_asignacion: 'completada'
                }
            ]
        },
        {
            id: 'TAR-009',
            id_equipo: 'EQ-006',
            id_componente: '',
            tipo_tarea: 'preventivo',
            titulo: 'Mantenimiento termociclador',
            descripcion: 'Limpieza de bloques, verificación de gradiente',
            prioridad: 'media',
            estado: 'pendiente',
            fecha_creacion: '2025-03-16T10:00:00.000Z',
            fecha_programada: '2025-04-01',
            fecha_inicio_real: '',
            fecha_fin_real: '',
            duracion_estimada_horas: 2,
            duracion_real_horas: 0,
            materiales_requeridos: 'Limpiador suave',
            herramientas_requeridas: '',
            procedimiento: '1. Apagar\n2. Limpiar bloques\n3. Verificar temp',
            resultado: '',
            observaciones: '',
            asignaciones: []
        },
        {
            id: 'TAR-010',
            id_equipo: 'EQ-009',
            id_componente: '',
            tipo_tarea: 'predictivo',
            titulo: 'Verificación de vacío cámara',
            descripcion: 'Inspección de sellos y verificación de vacío base',
            prioridad: 'media',
            estado: 'completada',
            fecha_creacion: '2025-02-10T10:00:00.000Z',
            fecha_programada: '2025-02-15',
            fecha_inicio_real: '2025-02-15T09:00:00.000Z',
            fecha_fin_real: '2025-02-15T11:00:00.000Z',
            duracion_estimada_horas: 2,
            duracion_real_horas: 2,
            materiales_requeridos: '',
            herramientas_requeridas: 'Bomba de vacío, medidor',
            procedimiento: '1. Verificar sellos\n2. Realizar vacío\n3. Medir base',
            resultado: 'Vacío baseok. Sello en buen estado',
            observaciones: '',
            asignaciones: [
                {
                    id: 'ASIG-006',
                    id_tarea: 'TAR-010',
                    id_tecnico: 'TEC-003',
                    rol: 'responsable',
                    fecha_asignacion: '2025-02-11T09:00:00.000Z',
                    fecha_aceptacion: '2025-02-11T09:30:00.000Z',
                    fecha_liberacion: '2025-02-15T11:00:00.000Z',
                    horas_trabajadas: 2,
                    estado_asignacion: 'completada'
                }
            ]
        }
    ]
};

// Función para cargar datos de ejemplo si no existen
function initSampleData() {
    const existingLaboratorios = storage.getLaboratorios();
    if (existingLaboratorios.length === 0) {
        console.log('Cargando datos de ejemplo...');
        
        // Cargar laboratorios
        sampleData.laboratorios.forEach(l => storage.saveLaboratorio(l));
        
        // Cargar equipos
        sampleData.equipos.forEach(e => storage.saveEquipo(e));
        
        // Cargar componentes
        sampleData.componentes.forEach(c => storage.saveComponente(c));
        
        // Cargar técnicos
        sampleData.tecnicos.forEach(t => storage.saveTecnico(t));
        
        // Cargar tareas
        sampleData.tareas.forEach(t => storage.saveTarea(t));
        
        console.log('Datos de ejemplo cargados correctamente');
    }
}
