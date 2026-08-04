import subprocess
import os
import sys
import urllib.request
import tarfile
import shutil

print("Starting custom Node.js runner for Compress Hub Ai...")

NODE_VERSION = "v20.11.0"
NODE_DIR = "/home/user/app/node"
NODE_BIN_DIR = os.path.join(NODE_DIR, "bin")

def install_node():
    if os.path.exists(os.path.join(NODE_BIN_DIR, "npm")):
        print("Node.js is already installed locally.")
        return

    print(f"Downloading Node.js {NODE_VERSION} for Linux x64...")
    url = f"https://nodejs.org/dist/{NODE_VERSION}/node-{NODE_VERSION}-linux-x64.tar.xz"
    tar_path = "/tmp/node.tar.xz"
    
    try:
        urllib.request.urlretrieve(url, tar_path)
        print("Extracting Node.js archive...")
        with tarfile.open(tar_path, "r:xz") as tar:
            tar.extractall(path="/tmp")
        
        extracted_path = f"/tmp/node-{NODE_VERSION}-linux-x64"
        if os.path.exists(NODE_DIR):
            shutil.rmtree(NODE_DIR)
            
        shutil.move(extracted_path, NODE_DIR)
        print("Node.js local installation completed.")
    except Exception as e:
        print(f"Failed to install Node.js: {e}")
        sys.exit(1)

# 1. Download and install Node.js binary
install_node()

# 2. Add Node.js to PATH
os.environ["PATH"] = NODE_BIN_DIR + os.pathsep + os.environ["PATH"]

# Double check node and npm version
try:
    node_version = subprocess.check_output(["node", "--version"]).decode().strip()
    npm_version = subprocess.check_output(["npm", "--version"]).decode().strip()
    print(f"Verified Node: {node_version}, NPM: {npm_version}")
except Exception as e:
    print(f"Failed to verify node/npm path settings: {e}")
    sys.exit(1)

# 3. Install Node dependencies
print("Installing npm packages...")
subprocess.run("npm install", shell=True, check=True)

# 4. Build Vite frontend
print("Building frontend assets...")
subprocess.run("npm run build", shell=True, check=True)

# 5. Start Express server on Hugging Face port 7860
print("Launching Express server...")
os.environ["PORT"] = "7860"
os.environ["NODE_ENV"] = "production"

# Use exec to replace python process with node process
os.execvp("node", ["node", "dist/server.cjs"])
