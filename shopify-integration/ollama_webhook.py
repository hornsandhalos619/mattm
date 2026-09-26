import os
import time
import threading
import subprocess
import requests
from flask import Flask, request, jsonify

# Configuration
API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:11434")
WEBHOOK_HOST = "127.0.0.1"
WEBHOOK_PORT = 5000
SHARED_SECRET = os.environ.get("SHARED_SECRET", "mysecret123")  # Change in production
ALLOWED_MODELS = ["llama2", "codellama", "mistral"]   # Fixed set of allowed models for 'ollama run'

# Flask app
app = Flask(__name__)

# Helper function to unload a model via keep_alive:0
def unload_model(model_name):
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/generate",
            json={
                "model": model_name,
                "prompt": " ",  # Minimal prompt required by Ollama API
                "keep_alive": 0
            },
            timeout=10
        )
        if response.status_code == 200:
            print(f"[{time.ctime()}] Unloaded model {model_name}")
        else:
            print(f"[{time.ctime()}] Failed to unload model {model_name}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[{time.ctime()}] Error unloading model {model_name}: {e}")

# Background poller for idle model unloading
def idle_unload_poller():
    # Track first seen time for each model currently loaded
    model_first_seen = {}
    while True:
        try:
            response = requests.get(f"{API_BASE_URL}/api/ps", timeout=10)
            if response.status_code == 200:
                data = response.json()
                # Expecting {"models": [{"name": "...", ...}, ...]}
                models = data.get("models", [])
                current_model_names = {model.get('name') for model in models if model.get('name')}
                current_time = time.time()

                # Check each model we are tracking
                for model_name in list(model_first_seen.keys()):
                    if model_name not in current_model_names:
                        # Model is no longer loaded (maybe unloaded by Ollama or removed)
                        del model_first_seen[model_name]
                        continue

                    # Model is still loaded
                    first_seen = model_first_seen[model_name]
                    if current_time - first_seen > 300:  # 5 minutes idle
                        unload_model(model_name)
                        # After unloading, remove from tracking so we don't repeatedly unload
                        del model_first_seen[model_name]

                # Add new models that appeared since last check
                for model_name in current_model_names:
                    if model_name not in model_first_seen:
                        model_first_seen[model_name] = current_time

            else:
                print(f"[{time.ctime()}] Error fetching API /api/ps: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[{time.ctime()}] Error in poller: {e}")
        time.sleep(30)

# Start the poller in a background daemon thread
poller_thread = threading.Thread(target=idle_unload_poller, daemon=True)
poller_thread.start()

# Webhook endpoint for triggering commands
@app.route('/trigger', methods=['POST'])
def trigger():
    # Validate shared secret
    provided_secret = request.headers.get('X-Shared-Secret')
    if provided_secret != SHARED_SECRET:
        return jsonify({"error": "Unauthorized"}), 401

    # Parse JSON body
    data = request.get_json(silent=True)
    if not data or 'command' not in data:
        return jsonify({"error": "Missing 'command' in JSON body"}), 400

    command = data['command'].strip()

    # Validate against hardcoded allowlist
    allowed_commands = ["ollama ps"] + [f"ollama run {model}" for model in ALLOWED_MODELS]
    if command not in allowed_commands:
        return jsonify({"error": "Command not allowed"}), 403

    # Log the triggered command with timestamp
    print(f"[{time.ctime()}] Triggered command: {command}")

    # Execute the command
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30  # Prevent hanging
        )
        if result.returncode == 0:
            output = result.stdout.strip()
        else:
            output = result.stderr.strip()
        return jsonify({"output": output}), 200
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Command timed out"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run Flask app bound to localhost only
    app.run(host=WEBHOOK_HOST, port=WEBHOOK_PORT, debug=False)