import sendMail from "../config/nodemailer.js";

// --- 1. Correo de Registro (Confirma tu cuenta) ---
const sendMailToRegister = (userMail, token) => {
    return sendMail(
        userMail,
        "Bienvenido al Sistema de Proyectos - Confirma tu cuenta",
        `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #17243D;">Confirma tu cuenta</h1>
                <p>Hola, gracias por registrarte. Haz clic abajo para confirmar tu cuenta:</p>
                
                <a style="background-color: #17243D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;" 
                   href="${process.env.URL_FRONTEND}/confirmar/${token}">
                   Confirmar cuenta
                </a>
                
                <p style="margin-top: 20px; color: gray; font-size: 12px;">Si no solicitaste esto, ignora este mensaje.</p>
                <hr>
                <footer>Equipo de ESFOT</footer>
            </div>
        `
    );
};

// --- 2. Correo de Recuperación de Contraseña ---
const sendMailToRecoveryPassword = (userMail, token) => {
    return sendMail(
        userMail,
        "Recuperar Contraseña",
        `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #F5BD45;">Recuperación de Contraseña</h1>
                <p>Has solicitado restablecer tu contraseña.</p>
                
                <a style="background-color: #F5BD45; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;" 
                   href="${process.env.URL_FRONTEND}/recuperarpassword/${token}">
                   Restablecer Contraseña
                </a>
                
                <hr>
                <footer>Equipo de ESFOT</footer>
            </div>
        `
    );
};

// --- 3. Correo Informativo (Usuario/Pass) ---
const sendMailToUser = (userMail, password) => {
    return sendMail(
        userMail,
        "Tus Credenciales de Acceso", // 🔴 AQUÍ FALTABA LA COMA ANTES
        `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #17243D;">Bienvenido</h1>
                <p>Estas son tus credenciales de acceso:</p>
                <p><strong>Contraseña:</strong> ${password}</p>
                
                <a href="${process.env.URL_FRONTEND}/login">Iniciar sesión</a>
                <hr>
            </div>
        `
    );
};

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToUser
};