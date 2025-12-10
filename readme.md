# INI8 Labs – Backend

Backend API for uploading, listing, downloading, and deleting patient PDF documents.

## Tech
- Node.js (Express)
- Multer (file uploads)
- PostgreSQL (Supabase)
- Local storage for PDFs (`uploads/` folder)

## Routes
| Method | Endpoint             | Action          |
|--------|-----------------------|-----------------|
| POST   | /documents/upload     | Upload PDF      |
| GET    | /documents            | List documents  |
| GET    | /documents/:id        | Download PDF    |
| DELETE | /documents/:id        | Delete PDF      |

## Setup

1) Install dependencies
cd backend
npm install

2) Environment

Create .env:

DATABASE_URL=postgresql://postgres:password@...pooler.supabase.com:6543/postgres
PORT=4000

3) Database table (run in Supabase SQL editor)
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

4) Run locally
npm start

GET http://localhost:4000/ →

{ "status": "ok", "message": "Patient document API running" }

🛰️ API Endpoints

Base URL (local): http://localhost:4000

# Method	Endpoint	      Description
POST	 /documents/upload	 Upload a PDF
GET	     /documents	         List all documents
GET	     /documents/:id	     Download a document
DELETE	 /documents/:id	     Delete a document

👤 Author

Vijaygowtham
INI8 Labs — Full Stack Developer Assignment
