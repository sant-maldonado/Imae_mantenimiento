import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuración de la aplicación"""
    
    # Usar SQLite para desarrollo local
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "mantenimiento5.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'mantenimiento-imae-secret-key-2024')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
