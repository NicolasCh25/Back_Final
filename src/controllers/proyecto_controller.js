import Proyecto from "../models/Proyecto.js"
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js"
import mongoose from "mongoose"
import path from 'path';
import { fileURLToPath } from 'url';

const registrarProyecto = async (req, res) => {
    try {

        const {
            titulo,
            descripcion,
            fecha_realizacion,
            github_url,
            video_url,
            tecnologias,
            estudiante,
            carrera,
            periodo_academico
        } = req.body
        if (!req.administradorHeader) {
            return res.status(401).json({ msg: "Administrador no autenticado" })
        }

        // 1️⃣ Validación básica
        if (!titulo || !descripcion || !fecha_realizacion || !video_url || !estudiante || !carrera) {
            return res.status(400).json({ msg: "Todos los campos obligatorios deben ser llenados" })
        }

        // 2️⃣ Crear proyecto
        const nuevoProyecto = new Proyecto({
            titulo,
            descripcion,
            fecha_realizacion,
            github_url,
            periodo_academico,
            video_url,
            tecnologias,
            estudiante,
            carrera,
            periodo_academico,
            creadoPor: req.administradorHeader._id // admin autenticado
        })

       if (req.files?.imagen) {
    const file = req.files.imagen;
    
    // Generar un nombre único para que no se sobrescriban
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.name);
    const fileName = 'img-' + uniqueSuffix + extension;

    // Obtener la ruta absoluta del directorio actual
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Definir dónde se guardará (Carpeta 'public/uploads' en la raíz del backend)
    const uploadPath = path.join(__dirname, '../public/uploads', fileName);

    // Mover el archivo a esa carpeta
    await file.mv(uploadPath);

    // Guardar en la base de datos manteniendo la estructura que espera tu Frontend
    // Usamos una URL completa apuntando a tu servidor local
    nuevoProyecto.imagenes.push({
        secure_url: `http://localhost:3000/uploads/${fileName}`, 
        public_id: fileName // Guardamos el nombre como ID referencia
    });
}

        // 4️⃣ Guardar en BD
        await nuevoProyecto.save()

        res.status(201).json({
            msg: "Proyecto registrado correctamente",
            proyecto: nuevoProyecto
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor",error })
    }
}
//TODOS LOS PROYECTOS
const listarProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find()
      .select("-__v -updatedAt")
      .sort({ fecha_realizacion: -1 }) // más recientes primero

    res.status(200).json(proyectos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Error en el servidor" })
  }
}

// Listar Proyectos por Carrera

const listarProyectosPorCarrera = async (req, res) => {
  try {
    const { carrera } = req.params

    // 🔴 ANTES: Buscaba coincidencia exacta (sensible a mayúsculas)
    // const proyectos = await Proyecto.find({ carrera })

    // ✅ AHORA: Usamos $regex con 'i' (insensible a mayúsculas/minúsculas)
    const proyectos = await Proyecto.find({ 
        carrera: { $regex: carrera, $options: "i" } 
    })
      .select("-__v -updatedAt")
      .sort({ fecha_realizacion: -1 })
      
    if (proyectos.length === 0) {
      return res.status(404).json({
        msg: `No se encontraron proyectos de ${carrera}`
      })
    }

    res.status(200).json(proyectos)
  
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Error en el servidor" })
  }
}

//Buscar Proyectos por ID

const detalleProyecto = async (req, res) => {
  try {
    const { id } = req.params

    // 1️⃣ Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        msg: "ID de proyecto no válido"
      })
    }

    // 2️⃣ Buscar proyecto
    const proyecto = await Proyecto.findById(id)
      .select("-__v")

    // 3️⃣ Validar existencia
    if (!proyecto) {
      return res.status(404).json({
        msg: "Proyecto no encontrado"
      })
    }

    // 4️⃣ Responder
    res.status(200).json(proyecto)

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Error en el servidor" })
  }
}


const eliminarProyecto=async (req,res)=>{
    try{
        const {id}=req.params

        // Validar Admin 
    if(!req.administradorHeader){
        return res.status(401).json({msg:"Administrador no auteticado."})  
    }
    // Validar ID 
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg:"ID de proyecto no válido"})

    }
    // Buscar Proyecto
    const proyecto=await Proyecto.findById(id)
    if(!proyecto){
        return res.status(404).json({msg:"Proyecto no encontrado"})

    }
    // Eliminar 
    await Proyecto.findByIdAndDelete(id)
    res.status(200).json({msg:"Proyecto eliminado correctamente"})

    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error del servidor"})
    }
    
}

//Actualizar Proyecto
const actualizarProyecto = async (req, res) => {
  try {
    const { id } = req.params

    // 1️⃣ Validar admin
    if (!req.administradorHeader) {
      return res.status(401).json({ msg: "Administrador no autenticado" })
    }

    // 2️⃣ Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ msg: "ID de proyecto no válido" })
    }

    // 3️⃣ Buscar proyecto
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" })
    }

    // 4️⃣ Imagen nueva (opcional)
    if (req.files?.imagen) {
      // eliminar imágenes anteriores
      for (const img of proyecto.imagenes) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id)
        }
      }

      const { secure_url, public_id } =
        await subirImagenCloudinary(
          req.files.imagen.tempFilePath,
          "ProyectosIntegracion"
        )

      proyecto.imagenes = [{ secure_url, public_id }]
    }

    // 5️⃣ Actualizar campos
    const camposActualizables = [
      "titulo",
      "descripcion",
      "fecha_realizacion",
      "github_url",
      "video_url",
      "tecnologias",
      "estudiante",
      "carrera",
      "periodo_academico"
    ]

    camposActualizables.forEach(campo => {
      if (req.body[campo] !== undefined) {
        proyecto[campo] = req.body[campo]
      }
    })

    // 6️⃣ Guardar cambios
    await proyecto.save()

    res.status(200).json({
      msg: "Proyecto actualizado correctamente",
      proyecto
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Error en el servidor" })
  }
}


const buscarProyectosAvanzado = async (req, res) => {
    try {
        // Extraemos los parámetros de la URL: ?titulo=...&estudiante=...&tecnologia=...
        const { titulo, estudiante, tecnologia,periodo_academico } = req.query;
        let filtros = {};

        // Filtro por Título (si existe en la petición)
        if (titulo) {
            filtros.titulo = { $regex: titulo, $options: "i" }; 
        }

        // Filtro por Autor (en tu esquema es el campo 'estudiante')
        if (estudiante) {
            filtros.estudiante = { $regex: estudiante, $options: "i" };
        }
        if(periodo_academico){
            filtros.periodo_academico = { $regex: periodo_academico, $options: "i" }
        }

        // Filtro por Tecnología (busca dentro del array 'tecnologias')
        if (tecnologia) {
            filtros.tecnologias = { $in: [new RegExp(tecnologia, "i")] };
        }

        const proyectos = await Proyecto.find(filtros);
        
        res.status(200).json(proyectos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error al realizar la búsqueda" });
    }
};


export {
    registrarProyecto,
    listarProyectos,
    listarProyectosPorCarrera,
    detalleProyecto, 
    eliminarProyecto,
    actualizarProyecto,
    buscarProyectosAvanzado


}
