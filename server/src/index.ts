// src/server/index.ts
import express from 'express'
import cors from 'cors'
import path from 'path'
import experimentRouter from './routes/experimentRouter'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

// Static file serving removed - PDFs are now served from client's public folder

// health check
app.get('/', (_req, res) => {
  res.send('Server is running!')
})

// all /experiment endpoints
app.use('/experiment', experimentRouter)
// error handler (must have 4 params: (err, req, res, next))
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
  console.log(`🚀  Server ready at http://localhost:${PORT}`)
)
