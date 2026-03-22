# from flask import Flask, jsonify, send_from_directory
# from flask_cors import CORS
# from config import Config
# from models import db
# from routes import api
# import os

# def create_app():
#     """Crear y configurar la aplicación Flask"""
#     app = Flask(__name__)
#     app.config.from_object(Config)
    
#     # Habilitar CORS para permitir conexiones desde cualquier origen
#     CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
#     # Inicializar SQLAlchemy
#     db.init_app(app)
    
#     # Registrar blueprint de API
#     app.register_blueprint(api)
    
#     # Ruta para servir el frontend
#     @app.route('/')
#     def index():
#         return send_from_directory('../', 'index.html')
    
#     @app.route('/<path:path>')
#     def serve_static(path):
#         return send_from_directory('../', path)
    
#     # Crear tablas en la base de datos
#     with app.app_context():
#         db.create_all()
#         print("Tablas creadas en la base de datos")
    
#     return app

# # Crear la aplicación
# app = create_app()

# if __name__ == '__main__':
#     port = int(os.getenv('PORT', 5000))
#     app.run(host='127.0.0.1', port=port, debug=True)


from flask import Flask, render_template
from flask_cors import CORS
from config import Config
from models import db
from routes import api

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    app.register_blueprint(api)

    @app.route('/')
    def index():
        return render_template("index.html")  # 👈 CLAVE

    return app

app = create_app()