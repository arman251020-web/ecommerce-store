# 🛒 E-Commerce Web Application

A full-stack **E-Commerce Web Application** built with **React.js, Node.js, Express.js, MongoDB, and Docker**.

The application provides a complete shopping experience with user authentication, product browsing, wishlist management, and shopping cart functionality.

The project is also **Dockerized**, allowing the frontend, backend, and database services to run in isolated containers using **Docker Compose**.

---

## 🚀 Features

### 👤 User Authentication

* User registration
* User login
* User logout
* JWT-based authentication
* Cookie-based authentication
* Protected routes
* Authentication middleware
* React authentication context

### 🛍️ Products

* Display products
* Product details
* Product categories
* Dynamic product listing
* Add products to cart
* Add products to wishlist

### ❤️ Wishlist

* Create wishlist automatically
* Add products to wishlist
* Check existing wishlist products
* Prevent duplicate products
* Retrieve user's wishlist
* Protected wishlist routes

### 🛒 Shopping Cart

* Add products to cart
* Store product quantities
* Retrieve user's cart
* Update quantities
* Prevent duplicate cart items
* Protected cart routes

### 🔐 Security

* JWT authentication
* Authentication middleware
* Password hashing
* HTTP cookie authentication
* Protected API endpoints
* Environment variables
* CORS configuration

### 🐳 Docker

* Dockerized frontend
* Dockerized backend
* MongoDB container
* Docker Compose
* Isolated services
* Container-to-container communication
* Environment-based configuration
* Easy local deployment

---

# 🧰 Tech Stack

## Frontend

| Technology       | Purpose              |
| ---------------- | -------------------- |
| React.js         | User interface       |
| Vite             | Frontend build tool  |
| React Router DOM | Client-side routing  |
| JavaScript       | Application logic    |
| CSS              | Styling              |
| Context API      | Authentication state |

## Backend

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| Node.js       | Backend runtime            |
| Express.js    | REST API                   |
| MongoDB       | Database                   |
| Mongoose      | MongoDB ODM                |
| JWT           | Authentication             |
| Cookie Parser | Cookie handling            |
| CORS          | Cross-origin communication |
| dotenv        | Environment configuration  |

## DevOps

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Docker         | Containerization              |
| Docker Compose | Multi-container orchestration |
| Dockerfile     | Container image configuration |
| Git            | Version control               |
| GitHub         | Source code hosting           |

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ React Frontend   │
                         │     :5173        │
                         └────────┬─────────┘
                                  │
                             REST API
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Node + Express   │
                         │     :5000        │
                         └────────┬─────────┘
                                  │
                              Mongoose
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     MongoDB      │
                         │      :27017      │
                         └──────────────────┘
```

---

# 🐳 Docker Architecture

The application can run as multiple Docker containers:

```text
┌─────────────────────────────────────────────┐
│              Docker Compose                 │
│                                             │
│  ┌────────────────┐                         │
│  │    Frontend    │                         │
│  │   React/Vite   │                         │
│  │     :5173      │                         │
│  └───────┬────────┘                         │
│          │                                  │
│          │ HTTP API                         │
│          ▼                                  │
│  ┌────────────────┐                         │
│  │     Backend    │                         │
│  │ Node/Express   │                         │
│  │     :5000      │                         │
│  └───────┬────────┘                         │
│          │                                  │
│          │ MongoDB Protocol                 │
│          ▼                                  │
│  ┌────────────────┐                         │
│  │    MongoDB     │                         │
│  │     :27017     │                         │
│  └────────────────┘                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 📁 Project Structure

```text
ecommerce/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Registration.jsx
│   │   │   ├── Products.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── backend/
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   └── wishlist.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

# ⚙️ Local Installation Without Docker

If you want to run the application directly on your machine:

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

You will also need MongoDB running locally.

---

# 🐳 Running With Docker

## Prerequisites

Install:

* Docker
* Docker Compose

Check Docker:

```bash
docker --version
```

Check Docker Compose:

```bash
docker compose version
```

---

# 🚀 Start the Entire Application

From the root project directory:

```bash
docker compose up --build
```

This will:

1. Build the frontend image
2. Build the backend image
3. Start MongoDB
4. Create the Docker network
5. Start the backend
6. Start the frontend

---

# ▶️ Run in Background

To run the containers in detached mode:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker ps
```

---

# 🛑 Stop the Application

```bash
docker compose down
```

This stops and removes the containers.

---

# 🔄 Rebuild Containers

If you make changes to your Dockerfile or dependencies:

```bash
docker compose up --build
```

---

# 📜 View Logs

View all logs:

```bash
docker compose logs
```

Backend logs:

```bash
docker compose logs backend
```

Frontend logs:

```bash
docker compose logs frontend
```

MongoDB logs:

```bash
docker compose logs mongodb
```

Follow logs continuously:

```bash
docker compose logs -f
```

---

# 🧹 Remove Containers

```bash
docker compose down
```

To also remove volumes:

```bash
docker compose down -v
```

> Be careful with `-v` because Docker volumes may contain your MongoDB data.

---

# 🐳 Example Docker Compose

The project can use a `docker-compose.yml` similar to:

```yaml
services:

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/ecommerce
      - JWT_SECRET=your_secret_key
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

The important part is that the backend connects to:

```text
mongodb://mongodb:27017/ecommerce
```

instead of:

```text
mongodb://localhost:27017/ecommerce
```

Inside Docker Compose, `mongodb` is the service name used for container-to-container communication.

---

# 🐋 Dockerfile

## Backend Dockerfile

Example:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

---

## Frontend Dockerfile

Example:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

# 🔐 Environment Variables

For local development:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

For Docker:

```env
PORT=5000

MONGO_URI=mongodb://mongodb:27017/ecommerce

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Never commit `.env` files to GitHub.

Add:

```gitignore
node_modules/
.env
```

to `.gitignore`.

---

# 🔑 Authentication Flow

```text
User
 │
 ▼
React Frontend
 │
 │ POST /login
 ▼
Express Backend
 │
 ▼
MongoDB
 │
 │ Verify credentials
 ▼
Generate JWT
 │
 ▼
Authentication Cookie
 │
 ▼
Browser
 │
 │ Protected Request
 ▼
Auth Middleware
 │
 ▼
Express Route
 │
 ▼
MongoDB
```

---

# ❤️ Wishlist Flow

```text
Click Wishlist ♡
        │
        ▼
POST /wishlist/:productid
        │
        ▼
Authentication Middleware
        │
        ▼
Find User Wishlist
        │
        ├── Doesn't Exist
        │       │
        │       ▼
        │   Create Wishlist
        │
        └── Exists
                │
                ▼
          Check Product
                │
          ┌─────┴─────┐
          │           │
       Exists      New Product
          │           │
          ▼           ▼
       Return      Add Product
                      │
                      ▼
                     Save
```

---

# 🛒 Cart Flow

```text
Click "Add"
      │
      ▼
POST /cart/:productid
      │
      ▼
Authentication Middleware
      │
      ▼
Find User Cart
      │
      ▼
Check Product
      │
      ├── Product Exists
      │       │
      │       ▼
      │   Update Quantity
      │
      └── New Product
              │
              ▼
          Add Product
              │
              ▼
             Save
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login user    |
| POST   | `/auth/logout`   | Logout user   |

## Products

| Method | Endpoint                 | Description  |
| ------ | ------------------------ | ------------ |
| GET    | `/auth/user/product`     | Get products |
| GET    | `/auth/user/product/:id` | Get product  |

## Wishlist

| Method | Endpoint                         | Description  |
| ------ | -------------------------------- | ------------ |
| GET    | `/auth/user/wishlist`            | Get wishlist |
| POST   | `/auth/user/wishlist/:productid` | Add product  |

## Cart

| Method | Endpoint                     | Description |
| ------ | ---------------------------- | ----------- |
| GET    | `/auth/user/cart`            | Get cart    |
| POST   | `/auth/user/cart/:productid` | Add product |

---

# 🧪 Testing

Backend APIs can be tested using Postman.

Recommended flow:

```text
Register
   ↓
Login
   ↓
Get Products
   ↓
Add Wishlist
   ↓
Get Wishlist
   ↓
Add Cart
   ↓
Get Cart
```

Example:

```http
POST http://localhost:5000/auth/user/wishlist/PRODUCT_ID
```

---

# 🧭 React Routing

The project uses React Router DOM.

Only one `BrowserRouter` should be present.

```jsx
<BrowserRouter>
    <App />
</BrowserRouter>
```

Routes are defined using:

```jsx
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/login" element={<Login />} />
</Routes>
```

---

# 🔐 Authentication Context

The frontend uses React Context API.

```text
src/
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   └── Navbar.jsx
│
└── App.jsx
```

From `Navbar.jsx`:

```jsx
import { useAuth } from "../context/AuthContext";
```

The authentication context manages:

* Current user
* Login state
* Logout
* Authentication status
* User information

---

# 🛡️ Security

Current security features include:

* JWT authentication
* Password hashing
* Authentication middleware
* Protected API routes
* Cookie-based authentication
* Environment variables
* CORS configuration
* MongoDB validation

### Recommended production improvements

* `httpOnly` cookies
* `secure` cookies
* `sameSite` configuration
* Rate limiting
* Helmet
* Request validation
* Input sanitization
* Strong password policies
* Refresh tokens
* Production logging
* HTTPS

---

# 🐛 Common Problems

## Router Error

```text
You cannot render a <Router> inside another <Router>.
```

### Solution

Use only one:

```jsx
<BrowserRouter>
```

Keep it in `main.jsx`.

---

## AuthContext Import Error

If the structure is:

```text
src/
├── context/
│   └── AuthContext.jsx
└── pages/
    └── Navbar.jsx
```

use:

```jsx
import { useAuth } from "../context/AuthContext";
```

---

## Wishlist User ID Error

If you receive:

```text
wishlist validation failed:
user: Path `user` is required.
```

check your authentication middleware.

The middleware must set the user ID:

```js
req.userid = decoded.id;
```

The property must match the property stored in the JWT.

---

# 📸 Screenshots

Recommended screenshots:

```text
screenshots/
│
├── home.png
├── products.png
├── login.png
├── registration.png
├── cart.png
└── wishlist.png
```

Example:

```markdown
![Home Page](screenshots/home.png)

![Products](screenshots/products.png)

![Cart](screenshots/cart.png)

![Wishlist](screenshots/wishlist.png)
```

---

# 🚀 Future Improvements

* [ ] Product search
* [ ] Product filtering
* [ ] Product sorting
* [ ] Product pagination
* [ ] Product categories
* [ ] Product reviews
* [ ] Product ratings
* [ ] Remove from wishlist
* [ ] Cart quantity controls
* [ ] Checkout system
* [ ] Payment gateway
* [ ] Order management
* [ ] Order history
* [ ] User profile
* [ ] Admin dashboard
* [ ] Inventory management
* [ ] Email notifications
* [ ] Automated testing
* [ ] CI/CD pipeline
* [ ] Production deployment
* [ ] Docker production setup
* [ ] Nginx reverse proxy
* [ ] HTTPS

---

# 📈 Learning Objectives

This project demonstrates practical experience with:

* Full-stack web development
* React.js
* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs
* JWT authentication
* Cookies
* React Router
* React Context API
* CRUD operations
* API integration
* Docker
* Docker Compose
* Containerization
* Database management
* Authentication middleware
* Git and GitHub

---

# 🔮 Future Technology Stack

The project can eventually be upgraded toward a more production-oriented stack:

```text
Current
   │
   ├── React
   ├── Node.js
   ├── Express.js
   ├── MongoDB
   └── Docker
          │
          ▼
Future
   │
   ├── TypeScript
   ├── Next.js
   ├── NestJS
   ├── PostgreSQL
   ├── Redis
   ├── Docker
   ├── Nginx
   ├── GitHub Actions
   ├── Automated Testing
   └── CI/CD
```

---

# 🤝 Contributing

Contributions are welcome.

### Fork the repository

Create your own fork on GitHub.

### Create a branch

```bash
git checkout -b feature/new-feature
```

### Make changes

Implement your feature or fix.

### Commit

```bash
git add .
git commit -m "Add new feature"
```

### Push

```bash
git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📄 License

This project is created for **learning, development, and portfolio purposes**.

---

# 👨‍💻 Author

## Arman Rajput

Computer Science & Engineering Student

### GitHub

🔗 https://github.com/arman251020-web

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📌 Project Status

**🚧 Actively Developing**

The project is continuously being improved with new features, security enhancements, UI improvements, Docker configuration, and production-ready architecture.
# ecommerce-store
