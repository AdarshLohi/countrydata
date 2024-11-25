# Full Stack Project (Express + React)Country data dashboard

This is a full-stack project comprising a backend built with Express and a frontend built with React.

---

## Table of Contents

1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Starting the Project](#starting-the-project)
4. [Redis Installation on macOS](#redis-installation-on-macos)

---

## Installation

### 1. Clone the repository:

````bash
git clone <repository_url>
cd <repository_name>

cd backend
npm install


cd ../frontend
npm install

create .env in backend and paste
PORT=4000
JWT_SECRET=6]%<d|Q}C/W)q|Gau>5+u1r{U3pp&K
COUNTRY_API=https://restcountries.com/

Create a .env file in the frontend directory with the following content:
VITE_API_URL=http://localhost:4000/api/

Here is the README.md file content in a single block for easy use:

markdown
Copy code
# Full Stack Project (Express + React)

This is a full-stack project comprising a backend built with Express and a frontend built with React.

---

## Table of Contents
1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Starting the Project](#starting-the-project)
4. [Redis Installation on macOS](#redis-installation-on-macos)

---

## Installation

### 1. Clone the repository:
```bash
git clone <repository_url>
cd <repository_name>
2. Install dependencies for backend:
bash
Copy code
cd backend
npm install
3. Install dependencies for frontend:
bash
Copy code
cd ../frontend
npm install
Environment Setup
Backend .env File
Create a .env file in the backend directory with the following content:

env
Copy code
PORT=4000
JWT_SECRET=6]%<d|Q}C/W)q|Gau>5+u1r{U3pp&K
COUNTRY_API=https://restcountries.com/
Frontend .env File
Create a .env file in the frontend directory with the following content:

env
Copy code
VITE_API_URL=http://localhost:4000/api/

Starting the Project


Start the backend:
cd backend
npm start

Start the frontend:
cd frontend
npm run dev

Install Redis:
brew install redis

Start Redis:
brew services start redis

Verify Redis is running:
redis-cli ping

It will give an output "pong", it shows it is working fine

Ensure that your backend is running on http://localhost:400


````
