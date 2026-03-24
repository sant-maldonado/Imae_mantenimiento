import os
import sys

# Add the root directory to the path
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Now import the app with error handling
try:
    from backend.app import app
except Exception as e:
    print(f"Error importing app: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    raise

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
