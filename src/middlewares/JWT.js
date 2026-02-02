import jwt from "jsonwebtoken"
import Administrador from "../models/Administrador.js"

const createTokenJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
  }

  // Esperamos formato: "Bearer <token>"
  const parts = authorization.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ msg: "Formato de token inválido. Usa: 'Bearer <token>'" })
  }

  const token = parts[1]
  if (!token) {
    return res.status(401).json({ msg: "Token no encontrado en el encabezado Authorization" })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { id, rol } = payload

    // Si quieres aceptar más roles, amplía esta comprobación
    if (String(rol).toLowerCase() !== "administrador") {
      return res.status(403).json({ msg: "Acceso denegado: rol insuficiente" })
    }

    // Buscar administrador, seleccionando primero y luego lean()
    const administradorBDD = await Administrador.findById(id).select("-password").lean()
    if (!administradorBDD) {
      return res.status(401).json({ msg: "Usuario no encontrado" })
    }

    // Adjuntamos datos al request y continuamos
    req.administradorHeader = administradorBDD
    return next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ msg: `Token inválido o expirado - ${error.message || error}` })
  }
}

export {
  createTokenJWT,
  verificarTokenJWT
}
