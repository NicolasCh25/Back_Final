# 🚀 Backend – Sistema Informativo de Proyectos de Integración Curricular (PIC)

**Trabajo de Integración Curricular – ESFOT**  
Escuela Politécnica Nacional

Backend desarrollado para la gestión centralizada de los Proyectos de Integración Curricular (PIC), permitiendo la administración de usuarios, proyectos, evidencias, evaluaciones y reportes mediante una API RESTful segura y escalable.

---

## 👥 Autores
- Edison Gabriel Escobar Obando  
- Nicolás Mauricio Chiguano Meza  
- Wilmer Adrián Ramos de la Cruz  

---

## 📖 Descripción del Proyecto
Este backend surge como solución a la falta de un sistema centralizado para la gestión de los Proyectos de Integración Curricular en la ESFOT, problemática que genera pérdida de información, duplicidad de datos y retrasos en la validación de proyectos.

El sistema permite administrar de forma estructurada los proyectos académicos mediante servicios web, garantizando trazabilidad, seguridad, comunicación institucional y acceso controlado según el rol del usuario.

---

## 🎯 Objetivo General
Desarrollar un backend que permita la gestión eficiente, segura y estructurada de la información relacionada con los Proyectos de Integración Curricular (PIC) en la ESFOT mediante una API RESTful.

---

## 🎯 Objetivos Específicos
- Analizar y definir requisitos funcionales y no funcionales  
- Diseñar un modelo de datos NoSQL optimizado  
- Implementar endpoints RESTful para la gestión académica  
- Garantizar seguridad mediante autenticación JWT  
- Aplicar metodología ágil SCRUM  
- Desplegar el backend en un entorno productivo  

---

## 🏗️ Arquitectura
El backend está basado en el **patrón Modelo–Vista–Controlador (MVC)**, lo que permite una separación clara de responsabilidades y facilita el mantenimiento y escalabilidad del sistema.

**Componentes principales:**
- Controladores
- Modelos
- Rutas
- Middleware de autenticación
- Base de datos NoSQL

---

## 🧑‍💼 Roles del Sistema
El sistema define tres perfiles principales:

### 🔹 Administrador Académico
- Gestión de usuarios y roles  
- Aprobación y cierre de proyectos  
- Generación de reportes  
- Auditoría de acciones  

### 🔹 Docente (Tutor / Evaluador)
- Visualización de proyectos asignados  
- Registro de observaciones y calificaciones  
- Revisión de evidencias  
- Seguimiento del progreso académico  

### 🔹 Estudiante
- Registro y autenticación  
- Creación y edición de proyectos  
- Carga de evidencias  
- Consulta del estado de evaluación  

---

## 🔐 Seguridad
- Autenticación mediante **JSON Web Token (JWT)**
- Rutas públicas y privadas según rol
- Encriptación de contraseñas con **bcrypt**
- Control de acceso basado en permisos

---

## 🧰 Tecnologías Utilizadas
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose (ODM)**
- **JWT**
- **Nodemailer**
- **JavaScript**
- **Render (Deployment)**

---

## 📂 Estructura del Proyecto
```text
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── config/
├── utils/
├── app.js
├── server.js
└── package.json
```

---

## 🔌 Principales Endpoints
	•	Registro e inicio de sesión de usuarios
	•	Confirmación de correo electrónico
	•	Recuperación y cambio de contraseña
	•	Gestión de perfiles
	•	CRUD de proyectos PIC
	•	Gestión de evidencias
	•	Generación de reportes
	•	Chat y comunicación académica

---

## 🚀 Despliegue
El backend se encuentra desplegado en producción en la plataforma Render:

🔗 API Backend:
https://back-final-b1du.onrender.com

📄 Documentación Postman:
https://documenter.getpostman.com/view/49837828/2sBXVoAUKC

---

## 🧪 Metodología de Desarrollo
Se aplicó la metodología SCRUM, organizando el desarrollo en Sprints:
	•	Sprint 0: Configuración del entorno
	•	Sprint 1: Gestión de usuarios
	•	Sprint 2: CRUD de proyectos
	•	Sprint 3: Despliegue del backend

Roles definidos:
	•	Product Owner
	•	Scrum Master
	•	Development Team

---

## ⚠️ Consideraciones
	•	El sistema está orientado al contexto académico ESFOT
	•	Diseñado para escalar a futuros módulos
	•	Compatible con aplicaciones frontend o móviles
	•	Preparado para integración con sistemas institucionales

---

## 📌 Conclusiones
El backend desarrollado proporciona una solución robusta, segura y escalable para la gestión de los Proyectos de Integración Curricular, mejorando la trazabilidad, la eficiencia administrativa y la calidad del proceso académico en la ESFOT.

El uso de una arquitectura MVC, base de datos NoSQL y metodología SCRUM garantiza un sistema mantenible, adaptable y preparado para futuras mejoras.

