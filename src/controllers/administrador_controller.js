import Administrador from "../models/Administrador.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { createTokenJWT } from '../middlewares/JWT.js'
import mongoose from "mongoose"

const registro = async (req, res) => {
  try {
    const { email, password } = req.body
    if (Object.values(req.body).includes("")) {
      return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    }

    const verificarEmailBDD = await Administrador.findOne({ email })
    if (verificarEmailBDD) {
      return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" })
    }

    const nuevoAdministrador = new Administrador(req.body)
    nuevoAdministrador.password = await nuevoAdministrador.encryptPassword(password)

    // Crear token y guardarlo en el documento antes de enviar el correo
    const token = nuevoAdministrador.createToken()
    nuevoAdministrador.token = token

    // Guardar primero para asegurar que el token existe en BD
    await nuevoAdministrador.save()

    // Enviar correo con token
    await sendMailToRegister(email, token)

    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" })

  } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
  }
}

const confirmarMail = async (req, res) => {
  try {
    const { token } = req.params
    const administradorBDD = await Administrador.findOne({ token })
    if (!administradorBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })

    administradorBDD.token = null
    administradorBDD.confirmEmail = true
    await administradorBDD.save()
    res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: `Error en el servidor - ${error}` })
  }
}

const recuperarPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })

    const administradorBDD = await Administrador.findOne({ email })
    if (!administradorBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })

    const token = administradorBDD.createToken()
    administradorBDD.token = token
    await administradorBDD.save()

    await sendMailToRecoveryPassword(email, token)
    console.log(token)
    res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: `Error en el servidor - ${error}` })
  }
}

const comprobarTokenPassword = async (req, res) => {
  try {
    const { token } = req.params
    const administradorBDD = await Administrador.findOne({ token })
    if (!administradorBDD) return res.status(400).json({ msg: "Token inválido o expirado" })

    // Si lo encuentras ya está confirmado que el token existe en BD
    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: `Error en el servidor ${error}` })
  }
}

const crearNuevoPassword = async (req, res) => {
  try {
    const { password, confirmpassword } = req.body
    const { token } = req.params

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos." })
    if (password !== confirmpassword) return res.status(400).json({ msg: "Las contraseñas no coinciden" })

    const administradorBDD = await Administrador.findOne({ token })
    if (!administradorBDD) return res.status(404).json({ msg: "No se puede validar la cuenta" })

    administradorBDD.token = null
    administradorBDD.password = await administradorBDD.encryptPassword(password)
    await administradorBDD.save()

    res.status(200).json({ msg: "Ya puedes iniciar sesión con tu nueva contraseña" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: `Error en el servidor - ${error}` })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" })

    const administradorBDD = await Administrador.findOne({ email }).select("-status -__v -token -updatedAt -createdAt")
    if (!administradorBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
    if (!administradorBDD.confirmEmail) return res.status(403).json({ msg: "Debes verificar tu cuenta antes de iniciar sesión" })

    const verificarificarPassword = await administradorBDD.matchPassword(password)
    if (!verificarificarPassword) return res.status(401).json({ msg: "La contraseña no es correcta" })

    const { nombre, apellido, rol, _id } = administradorBDD
    const token = createTokenJWT(administradorBDD._id, String(administradorBDD.rol).toLowerCase())

    res.status(200).json({
      token,
      rol,
      nombre,
      apellido,
      _id,
      email: administradorBDD.email
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: `Error en el servidor ${error}` })
  }
}

const perfil = (req, res) => {
  // Excluyo campos internos y devuelvo el resto como perfil
  const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } = req.administradorHeader
  res.status(200).json(datosPerfil)
}

const actualizarPerfil=async(req,res)=>{

  try{
    const {id}=req.params
    const {nombre,apellido,email}=req.body
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:`ID inválido: ${id}`})
    const administradorBDD=await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({ msg: `No existe el administrador con ID ${id}` })
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
    if(administradorBDD.email !== email)
    {
            const emailExistente  = await Administrador.findOne({email})
            if (emailExistente )
            {
                return res.status(404).json({msg:`El email ya se encuentra registrado`})  
            }
        }
        administradorBDD.nombre = nombre ?? administradorBDD.nombre
        administradorBDD.apellido = apellido ?? administradorBDD.apellido
       administradorBDD.email = email ?? administradorBDD.email
        await administradorBDD.save()
        res.status(200).json(administradorBDD)

  }catch (error) {
        console.error(error)
        res.status(500).json({ msg: ` Error en el servidor - ${error}` })
}
}

const actualizarPassword = async (req,res)=>{
    try {
        const administradorBDD = await Administrador.findById(req.administradorHeader._id)
        if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})
        const verificarPassword = await administradorBDD.matchPassword(req.body.passwordactual)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
        administradorBDD.password = await administradorBDD.encryptPassword(req.body.passwordnuevo)
        await administradorBDD.save()

    res.status(200).json({msg:"Password actualizado correctamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


export {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword,
  login,
  perfil,
  actualizarPerfil,
  actualizarPassword
  
}
