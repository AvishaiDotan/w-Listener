# WhatsApp Listener

This project is a WhatsApp listener application built with Node.js and TypeScript. It listens to WhatsApp events and processes messages using various services.

## Features
- Listens to WhatsApp events
- Processes messages using a message event builder
- Integrates with a database (MongoDB)
- Provides logging and LLM services

## Prerequisites
- Node.js 18 or later
- npm (Node Package Manager)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd w-listen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

## Running the Application

### Locally
To run the application locally:
```bash
npm start
```

### Using Docker
1. Build the Docker image:
   ```bash
   docker build -t w-listen .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 w-listen
   ```

## Project Structure
- `src/`
  - Contains the source code of the application
  - Organized into modules like `services`, `models`, `helpers`, etc.
- `Dockerfile`
  - Defines the Docker image for the application
- `package.json`
  - Contains project metadata and scripts
- `tsconfig.json`
  - TypeScript configuration file

## Contributing
Feel free to submit issues and pull requests for new features, bug fixes, or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
