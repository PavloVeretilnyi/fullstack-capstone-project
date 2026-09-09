# GiftLink 🎁

### Full-Stack JavaScript Web Application

GiftLink is a full-stack web application developed as the capstone project of the **IBM Full-Stack JavaScript Developer Professional Certificate**.

The application provides a platform for discovering household items that are available for donation. Users can browse available items, search and filter listings, view item details, and create an account to access their profile.

The project was an opportunity to work across the complete application stack — from the React user interface to REST APIs, authentication, database integration and application logging.

---

## 🚀 Key Features

* **Browse available items** through a React-based interface
* **Search listings** by name using case-insensitive partial matching
* **Filter results** by:

  * Category
  * Condition
  * Maximum age of the item
* **View detailed item information**
* **User registration and login**
* **Password hashing** using bcrypt
* **JWT-based authentication**
* **User profile management**
* **REST API** built with Node.js and Express
* **MongoDB database integration**
* **Application logging** with Pino
* **Environment-based configuration** for frontend/backend communication

---

## 🛠️ Technology Stack

### Frontend

* JavaScript
* React 18
* React Router
* React Bootstrap / Bootstrap
* React Hooks
* Fetch API
* Context API for authentication state

### Backend

* Node.js
* Express.js
* REST API
* MongoDB
* MongoDB Node.js Driver
* JWT
* bcryptjs
* Pino / pino-http
* dotenv
* CORS

### Development & Tools

* Git / GitHub
* npm
* REST API development
* Environment variables
* Full-stack application architecture

---

## 🏗️ Architecture

The project is structured as two separate applications:

```text
GiftLink
│
├── giftlink-frontend
│   ├── React application
│   ├── React Router
│   ├── Authentication context
│   ├── Search interface
│   ├── Item listings
│   ├── Item details
│   └── User profile
│
├── giftlink-backend
│   ├── Express server
│   ├── REST API
│   ├── Authentication routes
│   ├── Gift/item routes
│   ├── Search routes
│   ├── MongoDB connection
│   └── Pino logging
│
└── sentiment
    └── Auxiliary project component
```

The frontend communicates with the backend through HTTP requests to the REST API. The backend handles application logic and communicates with MongoDB for persistent data.

---

## 🔐 Authentication

GiftLink implements a basic authentication flow using:

1. User registration
2. Password hashing with **bcrypt**
3. User login
4. JWT generation
5. Authentication state management on the React frontend

Passwords are never stored as plain text. During registration, passwords are hashed before being stored in MongoDB.

Example authentication flow:

```text
React Frontend
      │
      │ POST /api/auth/register
      ▼
Express API
      │
      │ bcrypt password hashing
      ▼
MongoDB
      │
      │ JWT returned
      ▼
React Authentication Context
```

---

## 🔎 Search & Filtering

One of the main technical features of the application is its search functionality.

The backend exposes a dedicated search endpoint that builds a MongoDB query dynamically from the requested parameters.

Supported filters include:

```text
Name          → partial, case-insensitive search
Category      → exact match
Condition     → exact match
Age           → maximum age
```

For example:

```http
GET /api/search?name=desk&category=Furniture&age_years=5
```

The backend converts these parameters into a MongoDB query and returns the matching items.

This part of the project gave me practical experience working with:

* HTTP query parameters
* Dynamic MongoDB queries
* Regular expressions
* Data filtering
* Frontend/backend integration

---

## 🔌 API Overview

### Gifts

```http
GET /api/gifts
```

Retrieve available items.

```http
GET /api/gifts/:id
```

Retrieve a specific item.

```http
POST /api/gifts
```

Create a new item.

### Search

```http
GET /api/search
```

Search and filter available items.

Example:

```http
GET /api/search?name=table&condition=Good
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/update
```

---

## 💡 Technical Challenge

One of the most interesting challenges was making the frontend, backend and database work correctly together across different environments.

The application is split into separate frontend and backend services, so an issue can originate from several different layers:

```text
React UI
   ↓
API request
   ↓
Express route
   ↓
MongoDB query
   ↓
Database response
   ↓
API response
   ↓
React UI
```

When the frontend was not receiving the expected data, I learned to debug the system layer by layer rather than treating the application as a single component.

I checked:

* API endpoints
* HTTP requests
* Environment variables
* Backend URLs
* MongoDB connectivity
* Express routes
* Returned JSON data
* Frontend state and rendering

This was particularly valuable because it taught me how to approach full-stack problems systematically.

---

## 📚 What I Learned

Building GiftLink strengthened my understanding of full-stack development and helped me connect concepts that had previously been studied separately.

### Frontend

* Building reusable React components
* Managing application state
* Client-side routing
* Connecting UI components to APIs
* Handling authentication state
* Building search and filtering interfaces

### Backend

* Designing REST API endpoints
* Structuring an Express application
* Working with asynchronous JavaScript
* Connecting Node.js applications to MongoDB
* Implementing authentication
* Password hashing
* Application logging
* Error handling

### Full-Stack Development

Most importantly, the project helped me understand how the different parts of a web application work together:

```text
User
 │
 ▼
React Application
 │
 │ HTTP / REST
 ▼
Express / Node.js
 │
 ▼
MongoDB
```

---

## 🎯 Project Context

This project was completed as part of the **IBM Full-Stack JavaScript Developer Professional Certificate**.

Rather than focusing only on individual technologies, the capstone required putting together a complete application and working through the practical problems that appear when frontend, backend, authentication and database components need to work together.

It represents my transition from learning individual web-development technologies toward building complete full-stack applications.

---

## 🔮 Possible Improvements

There are several areas I would improve in a future iteration:

* Add automated unit and integration tests
* Strengthen request validation
* Improve authentication and authorization middleware
* Improve error handling and API responses
* Add more comprehensive API documentation
* Improve accessibility and responsive UI
* Add pagination for larger datasets
* Add more advanced search capabilities
* Improve application monitoring and deployment automation
* Further separate business logic from route handlers

These improvements would also be useful opportunities to apply practices from a professional development environment.

---

## ▶️ Running the Project Locally

### Prerequisites

* Node.js
* npm
* MongoDB

### 1. Clone the repository

```bash
git clone <repository-url>
cd fullstack-capstone-project
```

### 2. Start the backend

```bash
cd giftlink-backend
npm install
npm start
```

The backend runs on:

```text
http://localhost:3060
```

### 3. Configure the backend

Create a `.env` file containing the environment-specific configuration required by the application, including the MongoDB connection and JWT secret.

Example:

```env
MONGO_URL=<your-mongodb-url>
JWT_SECRET=<your-secret>
```

**Do not commit real secrets or credentials to GitHub.**

### 4. Start the frontend

In another terminal:

```bash
cd giftlink-frontend
npm install
npm start
```

The React development server will start the frontend application.

---

## 📂 Project Structure

```text
fullstack-capstone-project/
│
├── giftlink-frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── DetailsPage/
│       │   ├── LoginPage/
│       │   ├── MainPage/
│       │   ├── Navbar/
│       │   ├── Profile/
│       │   ├── RegisterPage/
│       │   └── SearchPage/
│       ├── context/
│       ├── App.js
│       └── index.js
│
├── giftlink-backend/
│   ├── models/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── giftRoutes.js
│   │   └── searchRoutes.js
│   ├── util/
│   ├── app.js
│   └── logger.js
│
└── sentiment/
```

---

## 👨‍💻 About the Developer

**Pavlo Veretilnyi**

Junior Full-Stack Developer transitioning into professional software development.

Background in **Engineering** and **Project Management**, with hands-on experience developing full-stack applications using JavaScript, React, Node.js, Express and MongoDB.

Currently continuing my development journey through a **Concepteur Développeur d'Applications** program and looking for opportunities to contribute to real-world software projects.

### Core technologies

`JavaScript` · `React` · `Node.js` · `Express` · `MongoDB` · `REST APIs` · `Git` · `Docker/Kubernetes concepts`

---

## 📄 License

This project is provided for educational and portfolio purposes.
