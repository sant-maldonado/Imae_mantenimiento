from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import api

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"])

    db.init_app(app)

    app.register_blueprint(api)

    with app.app_context():
        db.create_all()

    return app

app = create_app()