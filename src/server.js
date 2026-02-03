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

// Configuraciones Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middlewares 
app.use(express.json())

// ✅ CAMBIO IMPORTANTE AQUÍ: Configuración CORS específica
// Reemplazamos app.use(cors()) por esto:
app.use(cors({
    origin: process.env.URL_FRONTEND ,
    credentials: true,               // Permite envío de cookies/headers seguros
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // ¡Permite el token!
}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

app.use(express.static('public'));
// Ruta principal
app.get('/', (req, res) => res.send("Server on"))

// Rutas API
app.use('/api', routerAdministrador)
app.use('/api', routerProyecto)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

// Variables globales
app.set('port', process.env.PORT || 3000)

// Exportar
export default app