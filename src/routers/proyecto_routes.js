import { Router } from "express";
import { registrarProyecto,listarProyectos,listarProyectosPorCarrera,detalleProyecto,eliminarProyecto,actualizarProyecto,buscarProyectosAvanzado } from "../controllers/proyecto_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";
const router=Router()

router.post("/proyecto/registro",verificarTokenJWT,registrarProyecto)
router.get("/proyectos", listarProyectos)
router.get("/proyectos/carrera/:carrera", listarProyectosPorCarrera)
// Ruta para buscar proyecto por ID 
router.get("/proyecto/:id", detalleProyecto)
//Eliminar Proyecto por administradores autenticados
router.delete( "/proyecto/:id",verificarTokenJWT,eliminarProyecto
)
// Actualizar proyecto
router.put("/proyecto/:id", verificarTokenJWT,actualizarProyecto)

// Ruta de búsqueda: GET /api/proyectos/buscar
router.get("/buscar", buscarProyectosAvanzado)



export default router