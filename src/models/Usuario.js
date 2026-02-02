import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";


const usuarioSchema = new Schema({
    nombre:{ type:String, required:true, trim:true },
    apellido:{ type:String, required:true, trim:true },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    passwordUsuario:{
        type:String,
        required:true
    },
    token:{ type:String, default:null },
    confirmEmail:{ type:Boolean, default:false },
    rol:{
        type:String,
        enum:["estudiante","docente"],
        default:"estudiante"
    }
},{ timestamps:true })

// Metodo para para cifrar password
usuarioSchema.methods.encryptPassword=async function(password) {
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

// Metodo para verificar que el password es el mismo que el de la BDD 
usuarioSchema.methods.matchPassword=async function(password) {
    return bcrypt.compare(password,this.passwordUsuario)
    
}
export default ('Usuario',usuarioSchema)