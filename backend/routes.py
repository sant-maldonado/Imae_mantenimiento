from flask import Blueprint, request, jsonify, send_file
from backend.models import db, Laboratorio, Equipo, Componente, Tecnico, Tarea, Asignacion
import uuid
from fpdf import FPDF
import io

# Blueprint para las rutas API
api = Blueprint('api', __name__, url_prefix='/api')

# ============ LABORATORIOS ============

@api.route('/laboratorios', methods=['GET'])
def get_laboratorios():
    """Obtener todos los laboratorios"""
    laboratorios = Laboratorio.query.all()
    return jsonify([l.to_dict() for l in laboratorios])


@api.route('/laboratorios/<id>', methods=['GET'])
def get_laboratorio(id):
    """Obtener un laboratorio por ID"""
    laboratorio = Laboratorio.query.get(id)
    if not laboratorio:
        return jsonify({'error': 'Laboratorio no encontrado'}), 404
    return jsonify(laboratorio.to_dict())


@api.route('/laboratorios', methods=['POST'])
def create_laboratorio():
    """Crear un nuevo laboratorio"""
    data = request.get_json()
    
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    activo_value = data.get('activo')
    if activo_value is None:
        estado_value = data.get('estado', 'activo')
        activo_value = (estado_value == 'activo')
    
    laboratorio = Laboratorio(
        id=data.get('id') or str(uuid.uuid4()),
        codigo=data.get('codigo'),
        nombre=data.get('nombre'),
        ubicacion=data.get('ubicacion'),
        descripcion=data.get('descripcion'),
        responsable=data.get('responsable'),
        activo=activo_value
    )
    
    db.session.add(laboratorio)
    db.session.commit()
    
    return jsonify(laboratorio.to_dict()), 201


@api.route('/laboratorios/<id>', methods=['PUT'])
def update_laboratorio(id):
    """Actualizar un laboratorio"""
    laboratorio = Laboratorio.query.get(id)
    if not laboratorio:
        return jsonify({'error': 'Laboratorio no encontrado'}), 404
    
    data = request.get_json()
    laboratorio.codigo = data.get('codigo', laboratorio.codigo)
    laboratorio.nombre = data.get('nombre', laboratorio.nombre)
    laboratorio.ubicacion = data.get('ubicacion', laboratorio.ubicacion)
    laboratorio.descripcion = data.get('descripcion', laboratorio.descripcion)
    laboratorio.responsable = data.get('responsable', laboratorio.responsable)
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    if 'activo' in data:
        laboratorio.activo = data.get('activo')
    elif 'estado' in data:
        laboratorio.activo = (data.get('estado') == 'activo')
    
    db.session.commit()
    return jsonify(laboratorio.to_dict())


@api.route('/laboratorios/<id>', methods=['DELETE'])
def delete_laboratorio(id):
    """Eliminar un laboratorio"""
    laboratorio = Laboratorio.query.get(id)
    if not laboratorio:
        return jsonify({'error': 'Laboratorio no encontrado'}), 404
    
    db.session.delete(laboratorio)
    db.session.commit()
    return jsonify({'message': 'Laboratorio eliminado'}), 200


# ============ EQUIPOS ============

@api.route('/equipos', methods=['GET'])
def get_equipos():
    """Obtener todos los equipos"""
    id_laboratorio = request.args.get('id_laboratorio')
    if id_laboratorio:
        equipos = Equipo.query.filter_by(id_laboratorio=id_laboratorio).all()
    else:
        equipos = Equipo.query.all()
    return jsonify([e.to_dict() for e in equipos])


@api.route('/equipos/<id>', methods=['GET'])
def get_equipo(id):
    """Obtener un equipo por ID"""
    equipo = Equipo.query.get(id)
    if not equipo:
        return jsonify({'error': 'Equipo no encontrado'}), 404
    return jsonify(equipo.to_dict())


@api.route('/equipos', methods=['POST'])
def create_equipo():
    """Crear un nuevo equipo"""
    data = request.get_json()
    
    fecha_instalacion = None
    if data.get('fecha_instalacion'):
        fecha_instalacion = datetime.strptime(data['fecha_instalacion'], '%Y-%m-%d').date()
    
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    activo_value = data.get('activo')
    if activo_value is None:
        estado_value = data.get('estado', 'operativo')
        activo_value = (estado_value == 'operativo' or estado_value == 'activo')
    
    equipo = Equipo(
        id=data.get('id') or str(uuid.uuid4()),
        id_laboratorio=data.get('id_laboratorio'),
        nombre=data.get('nombre'),
        codigo=data.get('codigo'),
        tipo=data.get('tipo'),
        marca=data.get('marca'),
        modelo=data.get('modelo'),
        serie=data.get('serie'),
        numero_serie=data.get('numero_serie'),
        activo=activo_value,
        fecha_instalacion=fecha_instalacion,
        descripcion=data.get('descripcion')
    )
    
    db.session.add(equipo)
    db.session.commit()
    
    return jsonify(equipo.to_dict()), 201


@api.route('/equipos/<id>', methods=['PUT'])
def update_equipo(id):
    """Actualizar un equipo"""
    equipo = Equipo.query.get(id)
    if not equipo:
        return jsonify({'error': 'Equipo no encontrado'}), 404
    
    data = request.get_json()
    
    if 'fecha_instalacion' in data and data['fecha_instalacion']:
        equipo.fecha_instalacion = datetime.strptime(data['fecha_instalacion'], '%Y-%m-%d').date()
    
    if 'id_laboratorio' in data and data['id_laboratorio']:
        equipo.id_laboratorio = data['id_laboratorio']
    
    if 'ultimo_mantenimiento' in data and data['ultimo_mantenimiento']:
        equipo.fecha_ultimo_mantenimiento = datetime.strptime(data['ultimo_mantenimiento'], '%Y-%m-%d').date()
    
    if 'proximo_mantenimiento' in data and data['proximo_mantenimiento']:
        equipo.fecha_proximo_mantenimiento = datetime.strptime(data['proximo_mantenimiento'], '%Y-%m-%d').date()
    
    equipo.nombre = data.get('nombre', equipo.nombre)
    equipo.codigo = data.get('codigo', equipo.codigo)
    equipo.tipo = data.get('tipo', equipo.tipo)
    equipo.marca = data.get('marca', equipo.marca)
    equipo.modelo = data.get('modelo', equipo.modelo)
    equipo.serie = data.get('serie', equipo.serie)
    equipo.numero_serie = data.get('numero_serie', equipo.numero_serie)
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    if 'activo' in data:
        equipo.activo = data.get('activo')
    elif 'estado' in data:
        equipo.activo = (data.get('estado') == 'operativo' or data.get('estado') == 'activo')
    equipo.descripcion = data.get('descripcion', equipo.descripcion)
    
    db.session.commit()
    return jsonify(equipo.to_dict())


@api.route('/equipos/<id>', methods=['DELETE'])
def delete_equipo(id):
    """Eliminar un equipo"""
    equipo = Equipo.query.get(id)
    if not equipo:
        return jsonify({'error': 'Equipo no encontrado'}), 404
    
    db.session.delete(equipo)
    db.session.commit()
    return jsonify({'message': 'Equipo eliminado'}), 200


# ============ COMPONENTES ============

@api.route('/componentes', methods=['GET'])
def get_componentes():
    """Obtener todos los componentes"""
    id_equipo = request.args.get('id_equipo')
    if id_equipo:
        componentes = Componente.query.filter_by(id_equipo=id_equipo).all()
    else:
        componentes = Componente.query.all()
    return jsonify([c.to_dict() for c in componentes])


@api.route('/componentes/<id>', methods=['GET'])
def get_componente(id):
    """Obtener un componente por ID"""
    componente = Componente.query.get(id)
    if not componente:
        return jsonify({'error': 'Componente no encontrado'}), 404
    return jsonify(componente.to_dict())


@api.route('/componentes', methods=['POST'])
def create_componente():
    """Crear un nuevo componente"""
    data = request.get_json()
    
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    activo_value = data.get('activo')
    if activo_value is None:
        estado_value = data.get('estado', 'operativo')
        activo_value = (estado_value == 'operativo' or estado_value == 'activo')
    
    componente = Componente(
        id=data.get('id') or str(uuid.uuid4()),
        id_equipo=data.get('id_equipo'),
        nombre=data.get('nombre'),
        tipo=data.get('tipo'),
        numero_parte=data.get('numero_parte'),
        activo=activo_value,
        vida_util_horas=data.get('vida_util_horas'),
        horas_usadas=data.get('horas_usadas', 0),
        descripcion=data.get('descripcion')
    )
    
    db.session.add(componente)
    db.session.commit()
    
    return jsonify(componente.to_dict()), 201


@api.route('/componentes/<id>', methods=['PUT'])
def update_componente(id):
    """Actualizar un componente"""
    componente = Componente.query.get(id)
    if not componente:
        return jsonify({'error': 'Componente no encontrado'}), 404
    
    data = request.get_json()
    componente.nombre = data.get('nombre', componente.nombre)
    componente.tipo = data.get('tipo', componente.tipo)
    componente.numero_parte = data.get('numero_parte', componente.numero_parte)
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    if 'activo' in data:
        componente.activo = data.get('activo')
    elif 'estado' in data:
        componente.activo = (data.get('estado') == 'operativo' or data.get('estado') == 'activo')
    componente.vida_util_horas = data.get('vida_util_horas', componente.vida_util_horas)
    componente.horas_usadas = data.get('horas_usadas', componente.horas_usadas)
    componente.descripcion = data.get('descripcion', componente.descripcion)
    
    db.session.commit()
    return jsonify(componente.to_dict())


@api.route('/componentes/<id>', methods=['DELETE'])
def delete_componente(id):
    """Eliminar un componente"""
    componente = Componente.query.get(id)
    if not componente:
        return jsonify({'error': 'Componente no encontrado'}), 404
    
    db.session.delete(componente)
    db.session.commit()
    return jsonify({'message': 'Componente eliminado'}), 200


# ============ TÉCNICOS ============

@api.route('/tecnicos', methods=['GET'])
def get_tecnicos():
    """Obtener todos los técnicos"""
    tecnicos = Tecnico.query.all()
    return jsonify([t.to_dict() for t in tecnicos])


@api.route('/tecnicos/<id>', methods=['GET'])
def get_tecnico(id):
    """Obtener un técnico por ID"""
    tecnico = Tecnico.query.get(id)
    if not tecnico:
        return jsonify({'error': 'Técnico no encontrado'}), 404
    return jsonify(tecnico.to_dict())


@api.route('/tecnicos', methods=['POST'])
def create_tecnico():
    """Crear un nuevo técnico"""
    data = request.get_json()
    
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    activo_value = data.get('activo')
    if activo_value is None:
        estado_value = data.get('estado', 'activo')
        activo_value = (estado_value == 'activo')
    
    fecha_contratacion = None
    if data.get('fecha_contratacion'):
        fecha_contratacion = datetime.strptime(data['fecha_contratacion'], '%Y-%m-%d').date()
    
    tecnico = Tecnico(
        id=data.get('id') or str(uuid.uuid4()),
        nombre=data.get('nombre'),
        apellido=data.get('apellido'),
        email=data.get('email'),
        telefono=data.get('telefono'),
        especialidad=data.get('especialidad'),
        legajo=data.get('legajo'),
        activo=activo_value,
        fecha_contratacion=fecha_contratacion,
        horas_trabajadas_mes=data.get('horas_trabajadas_mes', 0)
    )
    
    db.session.add(tecnico)
    db.session.commit()
    
    return jsonify(tecnico.to_dict()), 201


@api.route('/tecnicos/<id>', methods=['PUT'])
def update_tecnico(id):
    """Actualizar un técnico"""
    tecnico = Tecnico.query.get(id)
    if not tecnico:
        return jsonify({'error': 'Técnico no encontrado'}), 404
    
    data = request.get_json()
    
    # Manejar fecha de contratacion
    if 'fecha_contratacion' in data and data['fecha_contratacion']:
        tecnico.fecha_contratacion = datetime.strptime(data['fecha_contratacion'], '%Y-%m-%d').date()
    
    tecnico.nombre = data.get('nombre', tecnico.nombre)
    tecnico.apellido = data.get('apellido', tecnico.apellido)
    tecnico.email = data.get('email', tecnico.email)
    tecnico.telefono = data.get('telefono', tecnico.telefono)
    tecnico.especialidad = data.get('especialidad', tecnico.especialidad)
    tecnico.legajo = data.get('legajo', tecnico.legajo)
    if 'horas_trabajadas_mes' in data:
        tecnico.horas_trabajadas_mes = data.get('horas_trabajadas_mes')
    # Manejar backwards compatibility: aceptar 'estado' o 'activo'
    if 'activo' in data:
        tecnico.activo = data.get('activo')
    elif 'estado' in data:
        tecnico.activo = (data.get('estado') == 'activo')
    
    db.session.commit()
    return jsonify(tecnico.to_dict())


@api.route('/tecnicos/<id>', methods=['DELETE'])
def delete_tecnico(id):
    """Eliminar un técnico"""
    tecnico = Tecnico.query.get(id)
    if not tecnico:
        return jsonify({'error': 'Técnico no encontrado'}), 404
    
    db.session.delete(tecnico)
    db.session.commit()
    return jsonify({'message': 'Técnico eliminado'}), 200


# ============ TAREAS ============

@api.route('/tareas', methods=['GET'])
def get_tareas():
    """Obtener todas las tareas"""
    id_equipo = request.args.get('id_equipo')
    estado = request.args.get('estado')
    
    query = Tarea.query
    if id_equipo:
        query = query.filter_by(id_equipo=id_equipo)
    if estado:
        query = query.filter_by(estado=estado)
    
    tareas = query.all()
    return jsonify([t.to_dict() for t in tareas])


@api.route('/tareas/<id>', methods=['GET'])
def get_tarea(id):
    """Obtener una tarea por ID"""
    tarea = Tarea.query.get(id)
    if not tarea:
        return jsonify({'error': 'Tarea no encontrada'}), 404
    return jsonify(tarea.to_dict())


@api.route('/tareas', methods=['POST'])
def create_tarea():
    """Crear una nueva tarea"""
    data = request.get_json()
    
    fecha_programada = None
    if data.get('fecha_programada'):
        fecha_programada = datetime.strptime(data['fecha_programada'], '%Y-%m-%d').date()
    
    tarea = Tarea(
        id=data.get('id') or str(uuid.uuid4()),
        id_equipo=data.get('id_equipo') if data.get('id_equipo') else None,
        titulo=data.get('titulo'),
        descripcion=data.get('descripcion'),
        tipo=data.get('tipo') or data.get('tipo_tarea'),
        prioridad=data.get('prioridad', 'media'),
        estado=data.get('estado', 'pendiente'),
        fecha_programada=fecha_programada,
        duracion_estimada_horas=data.get('duracion_estimada_horas'),
        notas=data.get('notas') or data.get('observaciones'),
        materiales_requeridos=data.get('materiales_requeridos'),
        herramientas_requeridas=data.get('herramientas_requeridas'),
        procedimiento=data.get('procedimiento'),
        resultado=data.get('resultado'),
        fotos=data.get('fotos', [])
    )
    
    db.session.add(tarea)
    db.session.commit()
    
    # Crear asignaciones si existen
    if data.get('asignaciones'):
        for asig_data in data['asignaciones']:
            asignacion = Asignacion(
                id=str(uuid.uuid4()),
                id_tarea=tarea.id,
                id_tecnico=asig_data.get('id_tecnico'),
                notas=asig_data.get('notas'),
                horas_trabajadas=asig_data.get('horas_trabajadas', 0)
            )
            db.session.add(asignacion)
        db.session.commit()
    
    return jsonify(tarea.to_dict()), 201


@api.route('/tareas/<id>', methods=['PUT'])
def update_tarea(id):
    """Actualizar una tarea"""
    tarea = Tarea.query.get(id)
    if not tarea:
        return jsonify({'error': 'Tarea no encontrada'}), 404
    
    data = request.get_json()
    
    if 'fecha_programada' in data and data['fecha_programada']:
        tarea.fecha_programada = datetime.strptime(data['fecha_programada'], '%Y-%m-%d').date()
    if 'fecha_inicio' in data and data['fecha_inicio']:
        tarea.fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d').date()
    if 'fecha_fin' in data and data['fecha_fin']:
        tarea.fecha_fin = datetime.strptime(data['fecha_fin'], '%Y-%m-%d').date()
    
    # Manejar id_equipo
    if 'id_equipo' in data:
        tarea.id_equipo = data['id_equipo'] if data['id_equipo'] else None
    
    tarea.titulo = data.get('titulo', tarea.titulo)
    tarea.descripcion = data.get('descripcion', tarea.descripcion)
    # Aceptar tanto 'tipo' como 'tipo_tarea' del frontend
    tarea.tipo = data.get('tipo') or data.get('tipo_tarea') or tarea.tipo
    tarea.prioridad = data.get('prioridad', tarea.prioridad)
    tarea.estado = data.get('estado', tarea.estado)
    tarea.duracion_estimada_horas = data.get('duracion_estimada_horas', tarea.duracion_estimada_horas)
    tarea.notas = data.get('notas') or data.get('observaciones') or tarea.notas
    # Actualizar los nuevos campos
    tarea.materiales_requeridos = data.get('materiales_requeridos', tarea.materiales_requeridos)
    tarea.herramientas_requeridas = data.get('herramientas_requeridas', tarea.herramientas_requeridas)
    tarea.procedimiento = data.get('procedimiento', tarea.procedimiento)
    tarea.resultado = data.get('resultado', tarea.resultado)
    tarea.fotos = data.get('fotos', tarea.fotos)
    
    # Manejar asignaciones si existen
    if data.get('asignaciones'):
        # Eliminar asignaciones existentes
        Asignacion.query.filter_by(id_tarea=id).delete()
        
        # Crear nuevas asignaciones
        for asig_data in data['asignaciones']:
            asignacion = Asignacion(
                id=asig_data.get('id') or str(uuid.uuid4()),
                id_tarea=id,
                id_tecnico=asig_data.get('id_tecnico'),
                notas=asig_data.get('notas'),
                horas_trabajadas=asig_data.get('horas_trabajadas', 0)
            )
            db.session.add(asignacion)
    
    db.session.commit()
    return jsonify(tarea.to_dict())


@api.route('/tareas/<id>', methods=['DELETE'])
def delete_tarea(id):
    """Eliminar una tarea"""
    tarea = Tarea.query.get(id)
    if not tarea:
        return jsonify({'error': 'Tarea no encontrada'}), 404
    
    db.session.delete(tarea)
    db.session.commit()
    return jsonify({'message': 'Tarea eliminada'}), 200


# ============ ASIGNACIONES ============

@api.route('/asignaciones', methods=['GET'])
def get_asignaciones():
    """Obtener todas las asignaciones"""
    id_tarea = request.args.get('id_tarea')
    id_tecnico = request.args.get('id_tecnico')
    
    query = Asignacion.query
    if id_tarea:
        query = query.filter_by(id_tarea=id_tarea)
    if id_tecnico:
        query = query.filter_by(id_tecnico=id_tecnico)
    
    asignaciones = query.all()
    return jsonify([a.to_dict() for a in asignaciones])


@api.route('/asignaciones', methods=['POST'])
def create_asignacion():
    """Crear una nueva asignación"""
    data = request.get_json()
    
    asignacion = Asignacion(
        id=data.get('id') or str(uuid.uuid4()),
        id_tarea=data.get('id_tarea'),
        id_tecnico=data.get('id_tecnico'),
        notas=data.get('notas'),
        horas_trabajadas=data.get('horas_trabajadas', 0)
    )
    
    db.session.add(asignacion)
    db.session.commit()
    
    return jsonify(asignacion.to_dict()), 201


@api.route('/asignaciones/<id>', methods=['PUT'])
def update_asignacion(id):
    """Actualizar una asignación"""
    asignacion = Asignacion.query.get(id)
    if not asignacion:
        return jsonify({'error': 'Asignación no encontrada'}), 404
    
    data = request.get_json()
    asignacion.estado = data.get('estado', asignacion.estado)
    asignacion.notas = data.get('notas', asignacion.notas)
    asignacion.horas_trabajadas = data.get('horas_trabajadas', asignacion.horas_trabajadas)
    
    db.session.commit()
    return jsonify(asignacion.to_dict())


@api.route('/asignaciones/<id>', methods=['DELETE'])
def delete_asignacion(id):
    """Eliminar una asignación"""
    asignacion = Asignacion.query.get(id)
    if not asignacion:
        return jsonify({'error': 'Asignación no encontrada'}), 404
    
    db.session.delete(asignacion)
    db.session.commit()
    return jsonify({'message': 'Asignación eliminada'}), 200


# ============ DASHBOARD / ESTADÍSTICAS ============

@api.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Obtener estadísticas para el dashboard"""
    
    # Contar por estado
    total_laboratorios = Laboratorio.query.count()
    total_equipos = Equipo.query.count()
    total_componentes = Componente.query.count()
    total_tecnicos = Tecnico.query.count()
    total_tareas = Tarea.query.count()
    
    tareas_pendientes = Tarea.query.filter_by(estado='pendiente').count()
    tareas_en_progreso = Tarea.query.filter_by(estado='en_progreso').count()
    tareas_completadas = Tarea.query.filter_by(estado='completada').count()
    
    # Equipos por estado
    equipos_operativos = Equipo.query.filter_by(estado='operativo').count()
    equipos_mantenimiento = Equipo.query.filter_by(estado='mantenimiento').count()
    equipos_dados_baja = Equipo.query.filter_by(estado='fuera_servicio').count()
    
    return jsonify({
        'total_laboratorios': total_laboratorios,
        'total_equipos': total_equipos,
        'total_componentes': total_componentes,
        'total_tecnicos': total_tecnicos,
        'total_tareas': total_tareas,
        'tareas_pendientes': tareas_pendientes,
        'tareas_en_progreso': tareas_en_progreso,
        'tareas_completadas': tareas_completadas,
        'equipos_operativos': equipos_operativos,
        'equipos_mantenimiento': equipos_mantenimiento,
        'equipos_dados_baja': equipos_dados_baja
    })


# ============ MIGRACIÓN DE DATOS ============

@api.route('/migrar', methods=['POST'])
def migrar_datos():
    """Migrar datos desde localStorage (JSON) a PostgreSQL"""
    data = request.get_json()
    
    try:
        # Migrar laboratorios
        if 'laboratorios' in data:
            for lab_data in data['laboratorios']:
                existente = Laboratorio.query.get(lab_data.get('id'))
                if not existente:
                    laboratorio = Laboratorio(
                        id=lab_data.get('id'),
                        nombre=lab_data.get('nombre'),
                        ubicacion=lab_data.get('ubicacion'),
                        descripcion=lab_data.get('descripcion'),
                        estado=lab_data.get('estado', 'activo')
                    )
                    db.session.add(laboratorio)
        
        # Migrar equipos
        if 'equipos' in data:
            for eq_data in data['equipos']:
                existente = Equipo.query.get(eq_data.get('id'))
                if not existente:
                    fecha_inst = None
                    if eq_data.get('fecha_instalacion'):
                        fecha_inst = datetime.strptime(eq_data['fecha_instalacion'], '%Y-%m-%d').date()
                    
                    equipo = Equipo(
                        id=eq_data.get('id'),
                        id_laboratorio=eq_data.get('id_laboratorio'),
                        nombre=eq_data.get('nombre'),
                        tipo=eq_data.get('tipo'),
                        modelo=eq_data.get('modelo'),
                        serie=eq_data.get('serie'),
                        estado=eq_data.get('estado', 'operativo'),
                        fecha_instalacion=fecha_inst,
                        descripcion=eq_data.get('descripcion')
                    )
                    db.session.add(equipo)
        
        # Migrar componentes
        if 'componentes' in data:
            for comp_data in data['componentes']:
                existente = Componente.query.get(comp_data.get('id'))
                if not existente:
                    componente = Componente(
                        id=comp_data.get('id'),
                        id_equipo=comp_data.get('id_equipo'),
                        nombre=comp_data.get('nombre'),
                        tipo=comp_data.get('tipo'),
                        numero_parte=comp_data.get('numero_parte'),
                        estado=comp_data.get('estado', 'operativo'),
                        vida_util_horas=comp_data.get('vida_util_horas'),
                        horas_usadas=comp_data.get('horas_usadas', 0),
                        descripcion=comp_data.get('descripcion')
                    )
                    db.session.add(componente)
        
        # Migrar técnicos
        if 'tecnicos' in data:
            for tec_data in data['tecnicos']:
                existente = Tecnico.query.get(tec_data.get('id'))
                if not existente:
                    tecnico = Tecnico(
                        id=tec_data.get('id'),
                        nombre=tec_data.get('nombre'),
                        apellido=tec_data.get('apellido'),
                        email=tec_data.get('email'),
                        telefono=tec_data.get('telefono'),
                        especialidad=tec_data.get('especialidad'),
                        estado=tec_data.get('estado', 'activo')
                    )
                    db.session.add(tecnico)
        
        # Migrar tareas
        if 'tareas' in data:
            for tar_data in data['tareas']:
                existente = Tarea.query.get(tar_data.get('id'))
                if not existente:
                    fecha_prog = None
                    if tar_data.get('fecha_programada'):
                        fecha_prog = datetime.strptime(tar_data['fecha_programada'], '%Y-%m-%d').date()
                    
                    tarea = Tarea(
                        id=tar_data.get('id'),
                        id_equipo=tar_data.get('id_equipo'),
                        titulo=tar_data.get('titulo'),
                        descripcion=tar_data.get('descripcion'),
                        tipo=tar_data.get('tipo'),
                        prioridad=tar_data.get('prioridad', 'media'),
                        estado=tar_data.get('estado', 'pendiente'),
                        fecha_programada=fecha_prog,
                        duracion_estimada_horas=tar_data.get('duracion_estimada_horas'),
                        notas=tar_data.get('notas'),
                        fotos=tar_data.get('fotos', [])
                    )
                    db.session.add(tarea)
                    db.session.flush()
                    
                    # Migrar asignaciones
                    if tar_data.get('asignaciones'):
                        for asig_data in tar_data['asignaciones']:
                            asignacion = Asignacion(
                                id=str(uuid.uuid4()),
                                id_tarea=tarea.id,
                                id_tecnico=asig_data.get('id_tecnico'),
                                notas=asig_data.get('notas'),
                                horas_trabajadas=asig_data.get('horas_trabajadas', 0)
                            )
                            db.session.add(asignacion)
        
        db.session.commit()
        return jsonify({'message': 'Datos migrados correctamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============ EXPORTAR DATOS ============

@api.route('/exportar', methods=['GET'])
def exportar_datos():
    """Exportar todos los datos a JSON"""
    laboratorios = [l.to_dict() for l in Laboratorio.query.all()]
    equipos = [e.to_dict() for e in Equipo.query.all()]
    componentes = [c.to_dict() for c in Componente.query.all()]
    tecnicos = [t.to_dict() for t in Tecnico.query.all()]
    tareas = [t.to_dict() for t in Tarea.query.all()]
    
    return jsonify({
        'laboratorios': laboratorios,
        'equipos': equipos,
        'componentes': componentes,
        'tecnicos': tecnicos,
        'tareas': tareas
    })


@api.route('/exportar/pdf', methods=['GET'])
def exportar_pdf():
    """Exportar todos los datos a PDF"""
    class PDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 15)
            self.cell(0, 10, 'Sistema de Mantenimiento IMAE - Informe Completo', 0, 1, 'C')
            self.ln(5)
        
        def chapter_title(self, title):
            self.set_font('Arial', 'B', 12)
            self.set_fill_color(200, 220, 255)
            self.cell(0, 10, title, 0, 1, 'L', 1)
            self.ln(2)
        
        def chapter_body(self, data, headers):
            self.set_font('Arial', '', 9)
            # Calcular anchos de columnas
            col_width = 190 / len(headers) if headers else 20
            # Encabezados
            self.set_font('Arial', 'B', 8)
            for h in headers:
                self.cell(col_width, 7, str(h)[:15], 1, 0, 'C')
            self.ln()
            # Datos
            self.set_font('Arial', '', 8)
            for row in data:
                for cell in row:
                    self.cell(col_width, 6, str(cell)[:15], 1, 0, 'L')
                self.ln()
            self.ln(5)
    
    pdf = PDF()
    pdf.add_page()
    
    # Laboratorios
    laboratorios = Laboratorio.query.all()
    if laboratorios:
        pdf.chapter_title('Laboratorios')
        headers = ['Nombre', 'Ubicación', 'Estado']
        data = [[l.nombre, l.ubicacion, 'Activo' if l.activo else 'Inactivo'] for l in laboratorios]
        pdf.chapter_body(data, headers)
    
    # Equipos
    equipos = Equipo.query.all()
    if equipos:
        pdf.chapter_title('Equipos')
        headers = ['Nombre', 'Tipo', 'Estado']
        data = [[e.nombre, e.tipo, 'Activo' if e.activo else 'Inactivo'] for e in equipos]
        pdf.chapter_body(data, headers)
    
    # Componentes
    componentes = Componente.query.all()
    if componentes:
        pdf.chapter_title('Componentes')
        headers = ['Nombre', 'Tipo', 'Estado']
        data = [[c.nombre, c.tipo, 'Activo' if c.activo else 'Inactivo'] for c in componentes]
        pdf.chapter_body(data, headers)
    
    # Técnicos
    tecnicos = Tecnico.query.all()
    if tecnicos:
        pdf.chapter_title('Técnicos')
        headers = ['Nombre', 'Apellido', 'Especialidad', 'Estado']
        data = [[t.nombre, t.apellido, t.especialidad, 'Activo' if t.activo else 'Inactivo'] for t in tecnicos]
        pdf.chapter_body(data, headers)
    
    # Tareas
    tareas = Tarea.query.all()
    if tareas:
        pdf.chapter_title('Tareas')
        headers = ['Título', 'Tipo', 'Prioridad', 'Estado']
        data = [[t.titulo, t.tipo, t.prioridad, t.estado] for t in tareas]
        pdf.chapter_body(data, headers)
    
    # Output to buffer
    buffer = io.BytesIO()
    pdf_output = pdf.output(dest='S').encode('latin-1')
    buffer.write(pdf_output)
    buffer.seek(0)
    
    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name='informe_mantenimiento.pdf'
    )
