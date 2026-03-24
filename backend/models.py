from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class Laboratorio(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    codigo = db.Column(db.String(50))
    nombre = db.Column(db.String(100))
    ubicacion = db.Column(db.String(100))
    descripcion = db.Column(db.Text)
    responsable = db.Column(db.String(100))
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'codigo': self.codigo,
            'nombre': self.nombre,
            'ubicacion': self.ubicacion,
            'descripcion': self.descripcion,
            'responsable': self.responsable,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }

class Equipo(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_laboratorio = db.Column(db.String(36), db.ForeignKey('laboratorio.id'))
    nombre = db.Column(db.String(100))
    codigo = db.Column(db.String(50))
    tipo = db.Column(db.String(50))
    marca = db.Column(db.String(50))
    modelo = db.Column(db.String(50))
    serie = db.Column(db.String(50))
    numero_serie = db.Column(db.String(50))
    estado = db.Column(db.String(20), default='operativo')
    activo = db.Column(db.Boolean, default=True)
    fecha_instalacion = db.Column(db.Date)
    fecha_ultimo_mantenimiento = db.Column(db.Date)
    fecha_proximo_mantenimiento = db.Column(db.Date)
    descripcion = db.Column(db.Text)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
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
            'estado': self.estado,
            'activo': self.activo,
            'fecha_instalacion': self.fecha_instalacion.isoformat() if self.fecha_instalacion else None,
            'fecha_ultimo_mantenimiento': self.fecha_ultimo_mantenimiento.isoformat() if self.fecha_ultimo_mantenimiento else None,
            'fecha_proximo_mantenimiento': self.fecha_proximo_mantenimiento.isoformat() if self.fecha_proximo_mantenimiento else None,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }

class Componente(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_equipo = db.Column(db.String(36), db.ForeignKey('equipo.id'))
    nombre = db.Column(db.String(100))
    tipo = db.Column(db.String(50))
    numero_parte = db.Column(db.String(50))
    estado = db.Column(db.String(20), default='funcional')
    activo = db.Column(db.Boolean, default=True)
    vida_util_horas = db.Column(db.Integer)
    horas_usadas = db.Column(db.Integer, default=0)
    descripcion = db.Column(db.Text)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_equipo': self.id_equipo,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'numero_parte': self.numero_parte,
            'estado': self.estado,
            'activo': self.activo,
            'vida_util_horas': self.vida_util_horas,
            'horas_usadas': self.horas_usadas,
            'descripcion': self.descripcion,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }

class Tecnico(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(100))
    apellido = db.Column(db.String(100))
    email = db.Column(db.String(100))
    telefono = db.Column(db.String(20))
    especialidad = db.Column(db.String(50))
    legajo = db.Column(db.String(50))
    estado = db.Column(db.String(20), default='activo')
    activo = db.Column(db.Boolean, default=True)
    foto = db.Column(db.String(500))
    fecha_contratacion = db.Column(db.Date)
    horas_trabajadas_mes = db.Column(db.Integer, default=0)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email,
            'telefono': self.telefono,
            'especialidad': self.especialidad,
            'legajo': self.legajo,
            'estado': self.estado,
            'activo': self.activo,
            'foto': self.foto,
            'fecha_contratacion': self.fecha_contratacion.isoformat() if self.fecha_contratacion else None,
            'horas_trabajadas_mes': self.horas_trabajadas_mes,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }

class Tarea(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_equipo = db.Column(db.String(36), db.ForeignKey('equipo.id'))
    titulo = db.Column(db.String(200))
    descripcion = db.Column(db.Text)
    tipo = db.Column(db.String(50))
    prioridad = db.Column(db.String(20), default='media')
    estado = db.Column(db.String(20), default='pendiente')
    fecha_programada = db.Column(db.Date)
    fecha_inicio = db.Column(db.Date)
    fecha_fin = db.Column(db.Date)
    duracion_estimada_horas = db.Column(db.Float)
    notas = db.Column(db.Text)
    materiales_requeridos = db.Column(db.Text)
    herramientas_requeridas = db.Column(db.Text)
    procedimiento = db.Column(db.Text)
    resultado = db.Column(db.Text)
    fotos = db.Column(db.JSON)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_equipo': self.id_equipo,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'tipo': self.tipo,
            'prioridad': self.prioridad,
            'estado': self.estado,
            'fecha_programada': self.fecha_programada.isoformat() if self.fecha_programada else None,
            'fecha_inicio': self.fecha_inicio.isoformat() if self.fecha_inicio else None,
            'fecha_fin': self.fecha_fin.isoformat() if self.fecha_fin else None,
            'duracion_estimada_horas': self.duracion_estimada_horas,
            'notas': self.notas,
            'materiales_requeridos': self.materiales_requeridos,
            'herramientas_requeridas': self.herramientas_requeridas,
            'procedimiento': self.procedimiento,
            'resultado': self.resultado,
            'fotos': self.fotos or [],
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }

class Asignacion(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_tarea = db.Column(db.String(36), db.ForeignKey('tarea.id'))
    id_tecnico = db.Column(db.String(36), db.ForeignKey('tecnico.id'))
    notas = db.Column(db.Text)
    horas_trabajadas = db.Column(db.Float, default=0)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_tarea': self.id_tarea,
            'id_tecnico': self.id_tecnico,
            'notas': self.notas,
            'horas_trabajadas': self.horas_trabajadas,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
