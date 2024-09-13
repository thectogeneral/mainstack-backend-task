# Use Node.js official image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]