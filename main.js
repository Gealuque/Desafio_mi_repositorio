import express from 'express'
import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  const filePath = path.resolve('index.html')
  res.sendFile(filePath)
})

//Para Crear las canciones POST

app.post('/canciones', (req, res) => {
    try {
        const {titulo, artista, tono} = req.body
        const id = crypto.randomUUID()
        const cancion = { id, titulo, artista, tono}

        if(!titulo || !artista|| !tono){
          return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' })
        }
        const canciones = JSON.parse(fs.readFileSync('canciones.json', 'utf8'))
        canciones.push(cancion)
        fs.writeFileSync('canciones.json', JSON.stringify(canciones))
        res.json({ mensaje: 'Canción Agregada!.'})
    } catch (error) {
        res.status(500).json({mensaje:'Error al ingresar la canción debido al siguiente error',error:error.message})
    }
})

//Para Obtener las canciones GET

app.get('/canciones', (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync('canciones.json', 'utf8'))
    res.json(canciones)
  } catch (error) {
    res.status(500).json({ mensaje: 'No se pudo obtener la canción', error: error.message })
  }
})

//Para Editar las canciones PUT

app.put('/canciones/:id', (req,res) => {
    try {
        const {id} = req.params
        const {titulo, artista, tono} = req.body

        if(!titulo || !artista|| !tono){
          return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' })
        }

        const canciones = JSON.parse(fs.readFileSync('canciones.json', 'utf8'))
        const index = canciones.findIndex(i => i.id == id)  
        canciones[index] = {...canciones[index], titulo,artista,tono}
        
        fs.writeFileSync('canciones.json', JSON.stringify(canciones))
        res.json({ mensaje: 'Canción editada!.' })
    } catch (error) {
        res.status(500).json({mensaje:'No se pudo borrar la canción',error:error.message})
    }
})


//Para Eliminar las Canciones DELETE

app.delete('/canciones/:id', (req,res) => {
    try {
        const {id} = req.params
        const canciones = JSON.parse(fs.readFileSync('canciones.json', 'utf8'))
        const NuevaListaCanciones = canciones.filter(e => e.id !== id)
        if(canciones.length === NuevaListaCanciones.length){
            return res.status(404).json({mensaje:'No se encontró la canción'})
        }
        fs.writeFileSync('canciones.json', JSON.stringify(NuevaListaCanciones))
        res.json({ mensaje: 'Canción eliminada!.' })
    } catch (error) {
        res.status(500).json({mensaje:'No se pudo borrar la canción',error:error.message})
    }
})



app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`)
})

