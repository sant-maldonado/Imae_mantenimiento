from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Laboratorio(db.Model):
    """Modelo para Laboratorios"""
    __tablename__ = 'laboratorios'
    
    id = db.Column(db.String(50), primary_key=True)
    codigo = db.Column(db.String(50))
    nombre = db.Column(db.String(200), nullable=False)
    ubicacion = db.Column(db.String(200))
    descripcion = db.Column(db.Text)
    responsable = db.Column(db.String(200))
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con equipos
    equipos = db.relationship('Equipo', backref='laboratorio', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'codigo': self.codigo,
            'nombre': self.nombre,
            'ubicacion': self.ubicacion,
            'descripcion': self.descripcion,
            'responsable': self.responsable,
            'activo': self.activo,
            'estado': 'activo' if self.activo else 'inactivo',
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_actualizacion': self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None
        }


class Equipo(db.Model):
    """Modelo para Equipos"""
    __tablename__ = 'equipos'
    
    id = db.Column(db.String(50), primary_key=True)
    id_laboratorio = db.Column(db.String(50), db.ForeignKey('laboratorios.id'), nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    codigo = db.Column(db.String(50))
    tipo = db.Column(db.String(100))
    marca = db.Column(db.String(100))
    modelo = db.Column(db.String(100))
    serie = db.Column(db.String(100))
    numero_serie = db.Column(db.String(100))
    activo = db.Column(db.Boolean, default=True)
    fecha_instalacion = db.Column(db.Date)
    fecha_ultimo_mantenimiento = db.Column(db.Date)
    fecha_proximo_mantenimiento = db.Column(db.Date)
    descripcion = db.Column(db.Text)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con componentes y tareas
    componentes = db.relationship('Componente', backref='equipo', lazy=True, cascade='all, delete-orphan')
    tareas = db.relationship('Tarea', backref='equipo', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_laboratorio': self.id_laboratorio,
            'nombre': self.nombre,
            'codigo': self.codigo,
            'tipo': self.tipo,
            'marca': self.marca,
            'modelo': self.modelo,
            'serie': self.serie,
            'numero_serie': self.numero_serie,
            'activo': self.activo,
            'estado': 'activo' if self.activo else 'inactivo',
            'fecha_instalacion': self.fecha_instalacion.isoformat() if self.fecha_instalacion else None,
            'ultimo_mantenimiento': self.fecha_ultimo_mantenimiento.isoformat() if self.fecha_ultimo_mantenimiento else None,
            'proximo_mantenimiento': self.fecha_proximo_mantenimiento.isoformat() if self.fecha_proximo_mantenimiento else None,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_actualizacion': self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None
        }


class Componente(db.Model):
    """Modelo para Componentes"""
    __tablename__ = 'componentes'
    
    id = db.Column(db.String(50), primary_key=True)
    id_equipo = db.Column(db.String(50), db.ForeignKey('equipos.id'), nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(100))
    numero_parte = db.Column(db.String(100))
    activo = db.Column(db.Boolean, default=True)
    vida_util_horas = db.Column(db.Integer)
    horas_usadas = db.Column(db.Integer, default=0)
    fecha_ultimo_mantenimiento = db.Column(db.Date)
    descripcion = db.Column(db.Text)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_equipo': self.id_equipo,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'numero_parte': self.numero_parte,
            'activo': self.activo,
            'estado': 'activo' if self.activo else 'inactivo',
            'vida_util_horas': self.vida_util_horas,
            'horas_usadas': self.horas_usadas,
            'fecha_ultimo_mantenimiento': self.fecha_ultimo_mantenimiento.isoformat() if self.fecha_ultimo_mantenimiento else None,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_actualizacion': self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None
        }


class Tecnico(db.Model):
    """Modelo para Técnicos"""
    __tablename__ = 'tecnicos'
    
    id = db.Column(db.String(50), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), unique=True)
    telefono = db.Column(db.String(20))
    especialidad = db.Column(db.String(100))
    legajo = db.Column(db.String(50))
    activo = db.Column(db.Boolean, default=True)
    fecha_contratacion = db.Column(db.Date)
    horas_trabajadas_mes = db.Column(db.Integer, default=0)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con asignaciones
    asignaciones = db.relationship('Asignacion', backref='tecnico', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email,
            'telefono': self.telefono,
            'especialidad': self.especialidad,
            'legajo': self.legajo,
            'activo': self.activo,
            'estado': 'activo' if self.activo else 'inactivo',
            'fecha_contratacion': self.fecha_contratacion.isoformat() if self.fecha_contratacion else None,
            'fecha_ingreso': self.fecha_contratacion.isoformat() if self.fecha_contratacion else None,
            'horas_trabajadas_mes': self.horas_trabajadas_mes,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_actualizacion': self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None
        }


class Tarea(db.Model):
    """Modelo para Tareas de Mantenimiento"""
    __tablename__ = 'tareas'
    
    id = db.Column(db.String(50), primary_key=True)
    id_equipo = db.Column(db.String(50), db.ForeignKey('equipos.id'), nullable=True)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    tipo = db.Column(db.String(50))  # preventivo, correctivo, predictivo
    prioridad = db.Column(db.String(50), default='media')  # baja, media, alta, critica
    estado = db.Column(db.String(50), default='pendiente')  # pendiente, en_progreso, completada, cancelada
    fecha_programada = db.Column(db.Date)
    fecha_inicio = db.Column(db.Date)
    fecha_fin = db.Column(db.Date)
    duracion_estimada_horas = db.Column(db.Float)
    notas = db.Column(db.Text)
    materiales_requeridos = db.Column(db.Text)  # Materiales necesarios para la tarea
    herramientas_requeridas = db.Column(db.Text)  # Herramientas necesarias
    procedimiento = db.Column(db.Text)  # Procedimiento o proceso a seguir
    resultado = db.Column(db.Text)  # Resultado de la tarea
    fotos = db.Column(db.JSON)  # Array de URLs de fotos
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con asignaciones
    asignaciones = db.relationship('Asignacion', backref='tarea', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_equipo': self.id_equipo,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'tipo': self.tipo,
            'tipo_tarea': self.tipo,
            'prioridad': self.prioridad,
            'estado': self.estado,
            'fecha_programada': self.fecha_programada.isoformat() if self.fecha_programada else None,
            'fecha_inicio': self.fecha_inicio.isoformat() if self.fecha_inicio else None,
            'fecha_inicio_real': self.fecha_inicio.isoformat() if self.fecha_inicio else None,
            'fecha_fin': self.fecha_fin.isoformat() if self.fecha_fin else None,
            'fecha_fin_real': self.fecha_fin.isoformat() if self.fecha_fin else None,
            'duracion_estimada_horas': self.duracion_estimada_horas,
            'notas': self.notas,
            'observaciones': self.notas,
            'materiales_requeridos': self.materiales_requeridos or '',
            'herramientas_requeridas': self.herramientas_requeridas or '',
            'procedimiento': self.procedimiento or '',
            'resultado': self.resultado or '',
            'fotos': self.fotos or [],
            'asignaciones': [a.to_dict() for a in self.asignaciones],
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_actualizacion': self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None
        }


class Asignacion(db.Model):
    """Modelo para Asignaciones de Tareas a Técnicos"""
    __tablename__ = 'asignaciones'
    
    id = db.Column(db.String(50), primary_key=True)
    id_tarea = db.Column(db.String(50), db.ForeignKey('tareas.id'), nullable=False)
    id_tecnico = db.Column(db.String(50), db.ForeignKey('tecnicos.id'), nullable=False)
    fecha_asignacion = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(db.String(50), default='activa')
    notas = db.Column(db.Text)
    horas_trabajadas = db.Column(db.Float, default=0)
    
    def to_dict(self):
        # Obtener datos del técnico si existe
        tecnico_data = None
        if self.id_tecnico:
            tecnico = Tecnico.query.get(self.id_tecnico)
            if tecnico:
                tecnico_data = {
                    'id': tecnico.id,
                    'nombre': tecnico.nombre,
                    'apellido': tecnico.apellido,
                    'especialidad': tecnico.especialidad
                }
        
        return {
            'id': self.id,
            'id_tarea': self.id_tarea,
            'id_tecnico': self.id_tecnico,
            'tecnico': tecnico_data,
            'fecha_asignacion': self.fecha_asignacion.isoformat() if self.fecha_asignacion else None,
            'estado': self.estado,
            'notas': self.notas,
            'horas_trabajadas': self.horas_trabajadas
        }
