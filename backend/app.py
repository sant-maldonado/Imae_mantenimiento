from flask import Flask
from models import db
import os
print("DATABASE_URL:", os.getenv("DATABASE_URL"))
app = Flask(__name__)
app.config.from_object("config.Config")

db.init_app(app)

with app.app_context():
    db.create_all()