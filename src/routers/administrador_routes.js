import {Router} from 'express'
import { registro,confirmarMail,recuperarPassword,comprobarTokenPassword,crearNuevoPassword,login,perfil,actualizarPerfil,actualizarPassword} from '../controllers/administrador_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()


router.post('/administrador/registro', registro)
router.get('/confirmar/:token',confirmarMail) //

router.post('/recuperarpassword',recuperarPassword) // Check 
router.get('/recuperarpassword/:token',comprobarTokenPassword)
router.post('/nuevopassword/:token',crearNuevoPassword)
router.post('/administrador/login',login) // Check 
router.get('/administrador/perfil',verificarTokenJWT,perfil)
router.put('/actualizarperfil/:id',verificarTokenJWT,actualizarPerfil) // Check 
router.put('/actualizarpassword/:id',verificarTokenJWT,actualizarPassword) 




export default router