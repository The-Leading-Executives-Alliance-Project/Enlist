FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY ./package.json ./package-lock.json* ./pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Copy all server source files
COPY . .

# Expose the port your server runs on
EXPOSE 3000

# Command to run the server
CMD ["node", "server.js"]