from flask import Flask
from flask_cors import CORS
from flask import session
import os

try:
    from .config import Config
    from .models import db
    from .routes import api
except ImportError:
    from config import Config
    from models import db
    from routes import api

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = os.urandom(24)

CORS(app, origins="*", allow_headers=["Content-Type"])

db.init_app(app)

app.register_blueprint(api)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)