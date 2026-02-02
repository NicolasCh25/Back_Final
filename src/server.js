// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerAdministrador from './routers/administrador_routes.js';
import routerProyecto from './routers/proyecto_routes.js';
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


// Middlewares 
app.use(express.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))
// Ruta principal
app.get('/',(req,res)=>res.send("Server on"))



app.use('/api',routerAdministrador)
app.use('/api',routerProyecto)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))



// Configuraciones 


// Variables globales
app.set('port',process.env.PORT || 3000)





// Exportar la instancia de express por medio de app
export default  app