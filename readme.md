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

### 1. Install dependencies
```bash
cd backend
npm install
