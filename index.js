// backend/index.js

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const { Pool } = pkg


const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
})


pool
  .query('SELECT NOW()')
  .then((res) => console.log('DB connected at:', res.rows[0].now))
  .catch((err) => console.error(' DB connection error:', err.message))

// ---------- Express setup ----------
const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const uploadFolder = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true })
  console.log(' Created uploads folder at', uploadFolder)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'))
    }
    cb(null, true)
  },
})


app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Patient document API running' })
})


app.post('/documents/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { originalname, filename, size, path: filepath } = file

    const result = await pool.query(
      `INSERT INTO documents (filename, filepath, filesize, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, filename, filepath, filesize, created_at`,
      [originalname, filepath, size],
    )

    return res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: 'Upload failed' })
  }
})


app.get('/documents', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, filename, filepath, filesize, created_at FROM documents ORDER BY created_at DESC',
    )
    return res.json(result.rows)
  } catch (err) {
    console.error('List error:', err)
    return res.status(500).json({ error: 'Failed to fetch documents' })
  }
})


app.get('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT id, filename, filepath FROM documents WHERE id = $1',
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const doc = result.rows[0]

    
    if (!fs.existsSync(doc.filepath)) {
      return res.status(404).json({ error: 'File not found on server' })
    }

    return res.download(doc.filepath, doc.filename)
  } catch (err) {
    console.error('Download error:', err)
    return res.status(500).json({ error: 'Failed to download document' })
  }
})


app.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT id, filepath FROM documents WHERE id = $1',
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const doc = result.rows[0]

  
    fs.unlink(doc.filepath, (err) => {
      if (err) {
        console.error('Error deleting file from disk:', err.message)
      }
    })

    await pool.query('DELETE FROM documents WHERE id = $1', [id])

    return res.json({ message: 'Document deleted successfully' })
  } catch (err) {
    console.error('Delete error:', err)
    return res.status(500).json({ error: 'Failed to delete document' })
  }
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(` Backend running on port ${PORT}`)
})
