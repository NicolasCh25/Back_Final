import { Schema, model } from "mongoose";

const proyectoSchema = new Schema({
    titulo:{
        type:String,
        required:true,
        trim:true
    },
    descripcion:{
        type:String,
        required:true
    },
    fecha_realizacion:{
        type:Date,
        required:true
    },
    github_url:{
        type:String,
        default:null
    },
   
    video_url:{
        type:String,
        required:true
    },
    tecnologias:[
        {
            type:String,
            trim:true
        }
    ],
   estudiante: {
  type: String,
  required: true,
  trim: true
},
carrera: {
  type: String,
  required: true,
  trim: true
},
 periodo_academico:{
        type:String,
        required:true
    },
    imagenes: {
        type: [
            {
                public_id: String,
                secure_url: String
            }
        ],
        default: []
    }

},
{
    timestamps:true
})

export default model("Proyecto", proyectoSchema)
