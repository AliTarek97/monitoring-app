# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:16-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install TSC
# Install dependencies.
RUN npm install typescript -g && \
  npm install

# Copy local code to the container image. Copying files after install to cache node_modules
COPY . ./

# Build using tsc
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

# CMD [ "bash" ]
