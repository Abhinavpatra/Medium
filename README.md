 Medium like site.

A full-stack blogging platform inspired by Medium, built with React, TypeScript, and Cloudflare Workers for the frontend, and Hono with Prisma for the backend.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (sign up and sign in)
- Create, read, update, and delete blog posts
- Responsive design for mobile and desktop
- User profiles with author information
- Skeleton loading for better user experience

## Technologies
- **Frontend:**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Axios
- **Backend:**
  - Hono
  - Prisma
  - PostgreSQL
  - Cloudflare Workers
- **Tools:**
  - Wrangler
  - ESLint
  - Prettier

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- Wrangler CLI

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medium-clone.git
   cd medium-clone
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up your PostgreSQL database and update the `DATABASE_URL` in your environment variables.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000` to view the application.

## API Endpoints
- **User Authentication**
  - `POST /api/v1/user/signup`: Create a new user
  - `POST /api/v1/user/signin`: Sign in an existing user

- **Blog Posts**
  - `POST /api/v1/blog/new-post`: Create a new blog post
  - `PUT /api/v1/blog/update-post`: Update an existing blog post
  - `GET /api/v1/blog/bulk`: Retrieve all blog posts
  - `GET /api/v1/blog/:id`: Retrieve a specific blog post

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
