# Instalación
## Requisitos
- Node.js
- MySQL
- npm
## Pasos para la instalación
1. Clonar el repositorio
```
     git clone https://github.com/RobertoPantojaL/ETE_API.git   
     cd ETE_API
```
2. Instalar dependencias
```
     npm install
```
3. Configurar la base de datos

> Asegúrate de tener una base de datos MySQL llamada bdd_exmn y crea las tablas necesarias (usuarios, tareas). Encointararás en la raiz del proyecto el archivo **database.sql** con lo necesario para la base de datos.

4. Configurar archivo .env (opcional)
> Si necesitas configurar variables de entorno, crea un archivo .env en la raíz del proyecto con los siguientes parámetros:
```
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=bdd_exmn
      PORT=3000

```
## Ejecutar la aplicación
> Para iniciar la aplicación, usa el siguiente comando:

```
      npm start
```
> La API estará disponible en **http://localhost:3000**.
# Endpoints de la API
## 1. Registrar un nuevo usuario
- Ruta: **/usuarios**
- Método: **POST**
- Descripción: Permite registrar un nuevo usuario.
- Cuerpo de la solicitud:
```
      {
        "nombre": "Juan Pérez",
        "correo": "juan@correo.com",
        "contraseña": "123456"
      }
```
- Respuestas:
> - 201: Usuario creado exitosamente.
> - 400: Datos inválidos o correo ya registrado.
> - 500: Error al crear el usuario.

 ## 2. Crear una nueva tarea
- Ruta: **/tareas**
- Método: **POST**
- Descripción:  Permite crear una nueva tarea.
- Cuerpo de la solicitud:
```
      {
        "titulo": "Hacer limpieza",
        "descripcion": "Limpiar la oficina",
        "id_usuario": 1
      }
```
- Respuestas:
> - 201: Tarea creada exitosamente.
> - 400: Datos inválidos o el usuario no existe.
> - 500: Error al crear la tarea.
## 3. Obtener todas las tareas
- Ruta: **/tareas**
- Método: **GET**
- Descripción: Obtiene la lista de todas las tareas.
- Respuestas:
> - 200: Lista de tareas.
> - 500: Error al obtener las tareas.
## 4. Obtener tarea específica
- Ruta: **/tareas/{id}**
- Método: **GET**
- Descripción: Obtiene los detalles de una tarea específica.
- Parámetros:
> - id: ID de la tarea.
- Respuestas:
> - 200: Detalles de la tarea.
> - 404: Tarea no encontrada.
> - 500: Error al obtener la tarea.
## 5. Actualizar el estado de una tarea
- Ruta: **/tareas/{id}**
- Método: **PUT**
- Descripción: Actualiza el estado de una tarea.
- Parámetros:
> - id: ID de la tarea.
- Cuerpo de la solicitud:
```
      {
        "estado": "completado"
      }
```

- Respuestas:
> - 200: Tarea actualizada exitosamente.
> - 404: Tarea no encontrada.
> - 500: Error al actualizar la tarea.
## 6. Eliminar una tarea
- Ruta: **/tareas/{id}**
- Método: **DELETE**
- Descripción: Elimina una tarea.
- Parámetros:
> - id: ID de la tarea.
- Respuestas:
> - 200: Tarea eliminada exitosamente.
> - 404: Tarea no encontrada
> - 500: Error al eliminar la tarea.
# Documentación de la API
> La documentación de la API está generada automáticamente mediante Swagger.

> Puedes acceder a la documentación en la siguiente URL:

>[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

> La API incluye los siguientes recursos:

> - Usuarios: CRUD para gestionar usuarios (registro, login).
> - Tareas: CRUD para gestionar tareas (crear, leer, actualizar, eliminar).
## Requisitos para Swagger
> Asegúrate de tener instalado swagger-ui-express y swagger-jsdoc. Estos paquetes se usan para generar la interfaz de Swagger en la ruta /api-docs.

> Instala las dependencias si no lo has hecho:

> `npm install swagger-ui-express swagger-jsdoc`

## Ejemplo de documentación en código

 ```
          /**
     * @swagger
     * /usuarios:
     *   post:
     *     summary: Registrar un nuevo usuario
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nombre
     *               - correo
     *               - contraseña
     *             properties:
     *               nombre:
     *                 type: string
     *               correo:
     *                 type: string
     *               contraseña:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuario creado exitosamente
     *       400:
     *         description: Datos inválidos
    */
    app.post('/usuarios', async (req, res) => {
    // Lógica para crear un usuario
    });

```
## Autenticación
> La API también soporta un endpoint para login de usuarios. Al hacer login correctamente, se devuelve el **id**, **nombre** y **correo** del usuario.
- Ruta: **/usuarios/login**
- Método: **POST**
- Cuerpo de la solicitud:
```
      {
        "correo": "juan@correo.com",
        "contraseña": "123456"
      }
```
- Respuestas:
> - 200: Login exitoso.
> - 401: Credenciales inválidas.
> - 500: Error en el servidor.
# Contribuir

> ¡Gracias por tu interés en contribuir a este proyecto! Aquí te dejamos algunas pautas para comenzar:

> 1. Fork el repositorio.
> 2. Crea una nueva rama (`git checkout -b feature/mi-nueva-funcionalidad`).
> 3. Realiza los cambios que desees.
> 4. Asegúrate de que las pruebas y la documentación estén actualizadas.
> 5. Realiza un pull request a la rama **main** del repositorio original.
## Pautas de estilo
> Por favor, sigue las pautas de estilo para JavaScript en este proyecto:

> - Usa ESLint con las configuraciones recomendadas.
> - Utiliza prettier para formatear el código automáticamente.

# Licencia

Este proyecto está bajo la **Licencia MIT**.
