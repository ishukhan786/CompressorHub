import subprocess
import os
import sys

print("Starting custom Node.js runner for Compress Hub Ai...")

# 1. Install Node dependencies
print("Installing npm packages...")
subprocess.run("npm install", shell=True, check=True)

# 2. Build Vite frontend
print("Building frontend assets...")
subprocess.run("npm run build", shell=True, check=True)

# 3. Start Express server on Hugging Face port 7860
print("Launching Express server...")
os.environ["PORT"] = "7860"
os.environ["NODE_ENV"] = "production"

# Use exec to replace python process with node process
os.execvp("node", ["node", "dist/server.cjs"])
