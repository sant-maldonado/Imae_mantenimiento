import os
import sys
from flask import Flask, jsonify

app = Flask(__name__)

# Add logging
import logging
logging.basicConfig(level=logging.INFO)

print("Starting simple Flask app...", file=sys.stderr)

@app.route('/api/test')
def test():
    return jsonify({'status': 'ok', 'message': 'Test successful'})

@app.route('/api/tecnicos')
def tecnicos():
    return jsonify([{'id': 1, 'nombre': 'Test'}])

if __name__ == '__main__':
    print("Running Flask app", file=sys.stderr)
    app.run(host='0.0.0.0', port=5000)
