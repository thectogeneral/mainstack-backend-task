# mainstack BET

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

[Live Link](https://mainstack-backend-task.vercel.app)
[API Documentation](https://documenter.getpostman.com/view/14864771/2sAXqpA4ie)

## Getting started

1. **Clone the repository:**

   ```zsh or bash
   git clone https://github.com/thectogeneral/mainstack-backend-task.git
   ```

2. **Install Dependencies:**

   ```zsh or bash
   npm install
   ```

3. **Run Locally:**

   - Start the application in development mode:

     ```bash
     npm run start:dev
     ```

   - Open your browser and visit [http://localhost:4000](http://localhost:4000).

4. **Run with Docker:**

   Ensure Docker is installed. If Docker is not already installed,

   ### Install Docker

   - Create a Docker account
   - Download Docker app locally on your machine/desktop
   - Login
   - Start Docker

   Then run:

   ```bash
   npm run start:docker
   ```

   This script uses Docker to build and run the application. Check your terminal for container logs.

5. **Testing:**

   To run tests, use:

   ```zsh or bash
   npm test
   ```

   or

   ```zsh or bash
   npm run test
   ```
