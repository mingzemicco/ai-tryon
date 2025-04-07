import express from 'express'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import cors from 'cors'
import multer from 'multer'

const app = express()
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

app.use(cors())

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }

    return res.status(200).json({ 
      url: `/uploads/${req.file.filename}`
    })
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      file: req.file,
      headers: req.headers
    })
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error.message 
    })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Upload server running on port ${PORT}`)
})
