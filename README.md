#  URL Shortener + Analytics - Backend-First System

A production-ready URL shortening service built with a backend-first approach, focusing on system design fundamentals, clean API architecture, and scalability considerations.

##  Project Focus

This project prioritizes **system design thinking** over feature count. It's built to demonstrate:

- **Backend engineering principles** for high-traffic services
- **Defensive programming** against edge cases
- **Scalability considerations** from day one
- **Clean API contracts** between services
- **Reliability patterns** for production systems

> **Note**: This is not "just another CRUD app". It's a case study in building resilient backend systems.

##  Features

###  Core Functionality
- **URL Shortening**: Convert long URLs to compact, shareable links
- **Redirection**: Seamless redirection from short to original URLs
- **Basic Analytics**: Track click counts and creation timestamps
- **Duplicate Handling**: Same URL → Same short link (no DB bloat)
- **Collision-Safe**: Guaranteed unique short codes using NanoID

### 🛡️ Reliability Features
- **URL Validation**: Reject invalid URLs before processing
- **Expiration Support**: Optional TTL for short links
- **Graceful Error Handling**: Proper HTTP status codes for all scenarios

### 📱 Minimal Frontend
- Plain css used for frontend (intentionally)
- Real-time feedback for user actions
- Analytics display for shortened URLs

## 🏗️ System Architecture


##  API Documentation

### Base URL  
http://localhost:4000/api

### 1️⃣ Create Short URL

**Endpoint:** `POST /shorten`  
**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-path"
}

Success Response (201 Created):
{
  "shortUrl": "http://localhost:4000/abc123"
}

🧰 Technology Stack

Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB
- ODM: Mongoose
- ID Generation: NanoID
- Validation: Native URL validation

Frontend
- Framework: React
- HTTP Client: Axios
- Styling: Plain CSS
- Build Tool: Vite

⚙️ Setup Instructions

Backend Setup:
git clone <repository-url>
cd url-shortener/backend
npm install
cp .env.example .env
npm run dev

Frontend Setup:
cd ../frontend
npm install
npm run dev

🔐 Environment Variables

Backend (.env):
PORT=4000
MONGODB_URI=mongodb://localhost:27017/url-shortener
NODE_ENV=development

🚀 Quick Start:
npm install && npm run dev

📁 Project Structure:

backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── utils/          # Helper functions
│   └── index.js        # Application entry
├── .env                # Environment variables
└── package.json

frontend/
├── src/
│   ├── api/           # API service layer
│   ├── components/    # React components
│   ├── App.jsx        # Root component
│   └── main.jsx       # Entry point
├── index.html
└── package.json

🧠 Final Note:

This project is intentionally backend-focused.
The complexity lives in the design decisions, not the UI.