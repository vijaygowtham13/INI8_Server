# Design Document – Patient Document Portal

## 1) Frontend framework and why
**React + Vite + Tailwind CSS**

I used React because it is widely used and makes UI development fast.  
Vite provides a quick development server.  
Tailwind (new no-config version) helped me style directly in JSX without writing CSS files.

This combination allowed me to finish the UI faster with a clean, modern look.

---

## 2) Backend framework and why
**Node.js + Express**

Express is simple and is a good fit for a small REST API.  
It has a very clear request → response flow and works well with `multer` for file upload validation.  
It also makes it easier to show the API logic for the assignment.

---

## 3) Database and why
**PostgreSQL (Supabase)**

The assignment allowed SQLite or PostgreSQL.  
I used PostgreSQL hosted on Supabase because:

- it can be shared with other tools in the company,
- Supabase gives me a dashboard to view the table,
- easier to scale than a local SQLite file.

Database stores only metadata (filename, path, size, timestamp).  
Actual PDF is saved on the backend file system for this version.

---

## 4) If supporting 1,000 users
With more users, I would change:

- move files from `uploads/` to cloud storage (e.g., Supabase Storage or S3)
- add authentication and a `user_id` column
- add pagination for `/documents`
- create indexes on timestamp/user
- run multiple backend instances (stateless)
- use connection pooling

Current design works for a single user or small scale.

---

## 5) Data flow (simple summary)

### Upload
1. User selects a PDF file
2. Frontend sends `POST /documents/upload` with `FormData`
3. Express + multer checks file type and stores in `uploads/`
4. Backend inserts metadata in PostgreSQL
5. API returns new record
6. Frontend refreshes list

### Download
1. User clicks Download
2. Browser calls `GET /documents/:id`
3. Express reads metadata from DB
4. Sends file using `res.download()`

---

## 6) Assumptions
- single-user application, no authentication
- only `.pdf` files are allowed
- file sizes are within reasonable limits
- local storage is acceptable for the assignment
- CORS is open for local development
- environment:
  - backend: `http://localhost:4000`
  - frontend: Vite default port (5173)

