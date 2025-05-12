from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko

app = Flask(__name__)
CORS(app)

# In-memory data stores
console_messages = []
info_messages = []
checklist_data = []
status_items = [
    {"id": "status1", "text": "System check", "status": "success"},
    {"id": "status2", "text": "Connection", "status": "fail"}
]

# Initialize some sample checklist data
checklist_data = [
    {"id": "1", "text": "Parent 2", "checked": True, "children": [
        {"id": "1-1", "text": "Child 1-1", "checked": True},
        {"id": "1-2", "text": "Child 1-2", "checked": True}
    ]},
    {"id": "2", "text": "Parent 2", "checked": False}
]

@app.route("/api/console", methods=["POST"])
def add_console_message():
    msg = request.json.get("message")
    console_messages.append(msg)
    return jsonify(success=True)

@app.route("/api/info", methods=["POST"])
def add_info_message():
    msg = request.json.get("message")
    info_messages.append(msg)
    return jsonify(success=True)

@app.route("/api/checklist", methods=["GET"])
def get_checklist():
    return jsonify(checklist_data)

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify(status_items)

@app.route("/api/start", methods=["POST"])
def start_action():
    checked_items = request.json.get("checkedItems", [])
    console_messages.append(f"Started with {len(checked_items)} items")
    return jsonify(success=True)

@app.route("/api/test", methods=["GET"])
def test_connection():
    return jsonify(success=True, message="Connection OK")


@app.route("/start_stream", methods=["POST"])
def start_stream():
    data = request.get_json()
    ip = data.get("ip")
    exposure = data.get("exposure")
    gain = data.get("gain")

    if not all([ip, exposure, gain]):
        return "Missing data", 400

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, username="root")

        # Stop any existing ffmpeg/libcamera stream
        ssh.exec_command("pkill -f libcamera-vid; pkill -f ffmpeg")

        cmd = (
            "libcamera-vid -t 0 --width 1280 --height 720 --framerate 15 " 
            f"--shutter {exposure} --gain {gain} "
            "--codec yuv420 --inline -o - "
            "| ffmpeg -fflags nobuffer -flags low_delay -strict experimental -f rawvideo -pix_fmt yuv420p "
            "-s 1280x720 -i - -vcodec libx264 -preset ultrafast -tune zerolatency -g 15 -keyint_min 15 "
            "-sc_threshold 0 -an -f rtsp rtsp://127.0.0.1:8554/cam"
        )

        print("Executing command:", cmd)
        # Start stream in background
        ssh.exec_command(f"nohup bash -c '{cmd}' > /dev/null 2>&1 &")


        return "Stream started", 200

    except Exception as e:
        print("Error:", e)
        return f"Failed to connect or execute: {str(e)}", 500

@app.route("/stop_stream", methods=["POST"])
def stop_stream():
    data = request.get_json()
    ip = data.get("ip")
    exposure = data.get("exposure")
    gain = data.get("gain")

    if not all([ip, exposure, gain]):
        return "Missing data", 400

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, username="root")

        # Stop any existing ffmpeg/libcamera stream
        ssh.exec_command("sudo pkill -f libcamera-vid; sudo pkill -f ffmpeg")

        return "Stream Stopped", 200

    except Exception as e:
        print("Error:", e)
        return f"Failed to connect or execute: {str(e)}", 500


if __name__ == "__main__":
    app.run(port=5000)
