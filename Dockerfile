# Use official Node.js runtime as parent image
FROM node:20

# Install ffmpeg and system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all code
COPY . .

# Build Vite frontend assets
RUN npm run build

# Expose port 7860 (Hugging Face Spaces default port)
EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
