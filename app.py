import os
import sys
from flask import Flask, jsonify

# Add the root directory to the path
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Create a simple test app
app = Flask(__name__)

@app.route('/api/test')
def test():
    return jsonify({'status': 'ok', 'message': 'Test successful'})

@app.route('/api/tecnicos')
def tecnicos():
    return jsonify([{'id': 1, 'nombre': 'Test'}])
