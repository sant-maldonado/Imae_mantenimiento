from flask import Blueprint, request, jsonify, session
from functools import wraps

try:
    from .models import db, Laboratorio, Equipo, Componente, Tecnico, Tarea, Asignacion, Usuario
except ImportError:
    from models import db, Laboratorio, Equipo, Componente, Tecnico, Tarea, Asignacion, Usuario
from fpdf import FPDF
from datetime import datetime
from uuid import uuid4
import uuid
import io
import os
import base64

api = Blueprint('api', __name__, url_prefix='/api')

def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return Usuario.query.get(user_id)

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not get_current_user():
            return jsonify({'error': 'No autenticado'}), 401
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'No autenticado'}), 401
        if user.rol != 'admin':
            return jsonify({'error': 'Sin permisos de administrador'}), 403
        return f(*args, **kwargs)
    return decorated

def tecnico_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'No autenticado'}), 401
        if user.rol not in ['admin', 'tecnico']:
            return jsonify({'error': 'Sin permisos'}), 403
        return f(*args, **kwargs)
    return decorated

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
    if 'activo' in data:
        laboratorio.activo = data.get('activo')
    elif 'estado' in data:
        laboratorio.activo = (data.get('estado') == 'activo')
    
    db.session.commit()
    return jsonify(laboratorio.to_dict())

@api.route('/laboratorios/<id>', methods=['DELETE'])
@admin_required
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
    if data.get('fecha_instalacion') and data['fecha_instalacion'].strip():
        fecha_instalacion = datetime.strptime(data['fecha_instalacion'], '%Y-%m-%d').date()
    
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
    
    ultimo_mantenimiento = data.get('ultimo_mantenimiento') or data.get('fecha_ultimo_mantenimiento')
    if ultimo_mantenimiento:
        equipo.fecha_ultimo_mantenimiento = datetime.strptime(ultimo_mantenimiento, '%Y-%m-%d').date()
    
    proximo_mantenimiento = data.get('proximo_mantenimiento') or data.get('fecha_proximo_mantenimiento')
    if proximo_mantenimiento:
        equipo.fecha_proximo_mantenimiento = datetime.strptime(proximo_mantenimiento, '%Y-%m-%d').date()
    
    equipo.nombre = data.get('nombre', equipo.nombre)
    equipo.codigo = data.get('codigo', equipo.codigo)
    equipo.tipo = data.get('tipo', equipo.tipo)
    equipo.marca = data.get('marca', equipo.marca)
    equipo.modelo = data.get('modelo', equipo.modelo)
    equipo.serie = data.get('serie', equipo.serie)
    equipo.numero_serie = data.get('numero_serie', equipo.numero_serie)
    
    if 'estado' in data:
        equipo.estado = data.get('estado')
    if 'activo' in data:
        equipo.activo = data.get('activo')
    elif 'estado' in data:
        equipo.activo = (data.get('estado') == 'operativo' or data.get('estado') == 'activo')
    
    equipo.descripcion = data.get('descripcion') or data.get('observaciones') or equipo.descripcion
    
    db.session.commit()
    return jsonify(equipo.to_dict())

@api.route('/equipos/<id>', methods=['DELETE'])
@tecnico_required
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
@tecnico_required
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
    
    activo_value = data.get('activo')
    if activo_value is None:
        estado_value = data.get('estado', 'activo')
        activo_value = (estado_value == 'activo')
    
    fecha_contratacion = None
    if data.get('fecha_contratacion') and data['fecha_contratacion'].strip():
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
        foto=data.get('foto'),
        fecha_contratacion=fecha_contratacion
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
    
    if 'fecha_contratacion' in data and data['fecha_contratacion']:
        tecnico.fecha_contratacion = datetime.strptime(data['fecha_contratacion'], '%Y-%m-%d').date()
    
    tecnico.nombre = data.get('nombre', tecnico.nombre)
    tecnico.apellido = data.get('apellido', tecnico.apellido)
    tecnico.email = data.get('email', tecnico.email)
    tecnico.telefono = data.get('telefono', tecnico.telefono)
    tecnico.especialidad = data.get('especialidad', tecnico.especialidad)
    tecnico.legajo = data.get('legajo', tecnico.legajo)
    if 'foto' in data:
        tecnico.foto = data.get('foto')
    
    if 'estado' in data:
        tecnico.estado = data.get('estado')
        tecnico.activo = (data.get('estado') == 'activo')
    if 'activo' in data:
        tecnico.activo = data.get('activo')
    
    db.session.commit()
    return jsonify(tecnico.to_dict())

@api.route('/tecnicos/<id>', methods=['DELETE'])
@admin_required
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
        fotos=data.get('fotos', [])
    )
    
    db.session.add(tarea)
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
    
    if 'id_equipo' in data:
        tarea.id_equipo = data['id_equipo'] if data['id_equipo'] else None
    
    tarea.titulo = data.get('titulo', tarea.titulo)
    tarea.descripcion = data.get('descripcion', tarea.descripcion)
    tarea.tipo = data.get('tipo') or data.get('tipo_tarea') or tarea.tipo
    tarea.prioridad = data.get('prioridad', tarea.prioridad)
    tarea.estado = data.get('estado', tarea.estado)
    tarea.duracion_estimada_horas = data.get('duracion_estimada_horas', tarea.duracion_estimada_horas)
    tarea.notas = data.get('notas') or data.get('observaciones') or tarea.notas
    tarea.fotos = data.get('fotos', tarea.fotos)
    
    db.session.commit()
    return jsonify(tarea.to_dict())

@api.route('/tareas/<id>', methods=['DELETE'])
@tecnico_required
def delete_tarea(id):
    """Eliminar una tarea"""
    tarea = Tarea.query.get(id)
    if not tarea:
        return jsonify({'error': 'Tarea no encontrada'}), 404
    
    db.session.delete(tarea)
    db.session.commit()
    return jsonify({'message': 'Tarea eliminada'}), 200

# ============ DASHBOARD ============

@api.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Obtener estadísticas para el dashboard"""
    
    total_laboratorios = Laboratorio.query.count()
    total_equipos = Equipo.query.count()
    total_componentes = Componente.query.count()
    total_tecnicos = Tecnico.query.count()
    total_tareas = Tarea.query.count()
    
    tareas_pendientes = Tarea.query.filter_by(estado='pendiente').count()
    tareas_en_progreso = Tarea.query.filter_by(estado='en_progreso').count()
    tareas_completadas = Tarea.query.filter_by(estado='completada').count()
    
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

# ============ EXPORTAR ============

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

# ============ AUTH ============

@api.route('/auth/login', methods=['POST'])
def login():
    """Iniciar sesión"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
    
    usuario = Usuario.query.filter_by(username=username).first()
    if not usuario or not usuario.check_password(password):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    if not usuario.activo:
        return jsonify({'error': 'Usuario inactivo'}), 403
    
    session['user_id'] = usuario.id
    session['rol'] = usuario.rol
    
    return jsonify({
        'message': 'Login exitoso',
        'usuario': usuario.to_dict()
    })

@api.route('/auth/logout', methods=['POST'])
def logout():
    """Cerrar sesión"""
    session.clear()
    return jsonify({'message': 'Sesión cerrada'})

@api.route('/auth/me', methods=['GET'])
def get_current_user_info():
    """Obtener usuario actual"""
    usuario = get_current_user()
    if not usuario:
        return jsonify({'error': 'No autenticado'}), 401
    return jsonify(usuario.to_dict())

@api.route('/auth/register', methods=['POST'])
@admin_required
def register():
    """Registrar nuevo usuario"""
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    rol = data.get('rol', 'normal')
    nombre = data.get('nombre')
    email = data.get('email')
    
    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
    
    if Usuario.query.filter_by(username=username).first():
        return jsonify({'error': 'El usuario ya existe'}), 400
    
    usuario = Usuario(
        username=username,
        rol=rol,
        nombre=nombre,
        email=email
    )
    usuario.set_password(password)
    
    db.session.add(usuario)
    db.session.commit()
    
    return jsonify(usuario.to_dict()), 201

@api.route('/usuarios', methods=['GET'])
@admin_required
def get_usuarios():
    """Obtener todos los usuarios (solo admin)"""
    usuarios = Usuario.query.all()
    return jsonify([u.to_dict() for u in usuarios])

@api.route('/usuarios/<id>', methods=['DELETE'])
@admin_required
def delete_usuario(id):
    """Eliminar usuario (solo admin)"""
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuario eliminado'}), 200

@api.route('/usuarios/<id>', methods=['PUT'])
@admin_required
def update_usuario(id):
    """Actualizar usuario (solo admin)"""
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    data = request.get_json()
    if 'nombre' in data:
        usuario.nombre = data['nombre']
    if 'email' in data:
        usuario.email = data['email']
    if 'rol' in data:
        usuario.rol = data['rol']
    if 'activo' in data:
        usuario.activo = data['activo']
    if 'password' in data:
        usuario.set_password(data['password'])
    
    db.session.commit()
    return jsonify(usuario.to_dict())

@api.route('/auth/init', methods=['POST'])
def init_first_user():
    """Crear primer usuario admin (solo si no existe ninguno)"""
    if Usuario.query.first():
        return jsonify({'error': 'Ya existen usuarios'}), 400
    
    data = request.get_json()
    username = data.get('username', 'admin')
    password = data.get('password', 'admin123')
    
    usuario = Usuario(
        username=username,
        rol='admin',
        nombre='Administrador',
        email='admin@imae.go.cr'
    )
    usuario.set_password(password)
    
    db.session.add(usuario)
    db.session.commit()
    
    return jsonify({'message': 'Usuario admin creado', 'usuario': usuario.to_dict()}), 201