from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import api

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=[
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://cute-belekoy-b79733.netlify.app"
    ])

    db.init_app(app)

    app.register_blueprint(api)

    with app.app_context():
        db.create_all()

    return app

app = create_app()