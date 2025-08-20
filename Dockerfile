# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y chromium

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on (if applicable)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
