const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

// Configuración de CORS para liga espcifica
app.use(cors({
  origin: 'http://localhost:5173' // Permite solicitudes desde tu frontend
}));
// Configuración de CORS abierta
// app.use(cors());
// Configuración de la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bdd_exmn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(bodyParser.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Tareas',
      version: '1.0.0',
      description: 'Una API para gestionar usuarios y tareas',
    },
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Implementación de endpoints
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
  const { nombre, correo, contraseña } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
      [nombre, correo, contraseña]
    );
    res.status(201).json({ id: result[0].insertId, mensaje: 'Usuario creado exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') { // MySQL unique constraint violation
      res.status(400).json({ error: 'El correo ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }
});

/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crear una nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - id_usuario
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
app.post('/tareas', async (req, res) => {
  const { titulo, descripcion, id_usuario } = req.body;
  try {
    const userExists = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id_usuario]);
    if (userExists[0].length === 0) {
      return res.status(400).json({ error: 'El usuario especificado no existe' });
    }
    const result = await pool.query(
      'INSERT INTO tareas (titulo, descripcion, id_usuario) VALUES (?, ?, ?)',
      [titulo, descripcion, id_usuario]
    );
    res.status(201).json({ id: result[0].insertId, mensaje: 'Tarea creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Obtener todas las tareas
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
app.get('/tareas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tareas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

/**
 * @swagger
 * /tareas/{id}:
 *   get:
 *     summary: Obtener una tarea específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la tarea
 *       404:
 *         description: Tarea no encontrada
 */
app.get('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM tareas WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
});

/**
 * @swagger
 * /tareas/{id}:
 *   put:
 *     summary: Actualizar el estado de una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en progreso, completado]
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
app.put('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE tareas SET estado = ? WHERE id = ?',
      [estado, id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      const [updatedTask] = await pool.query('SELECT * FROM tareas WHERE id = ?', [id]);
      res.json({ mensaje: 'Tarea actualizada exitosamente', tarea: updatedTask[0] });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

/**
 * @swagger
 * /tareas/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
app.delete('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM tareas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.json({ mensaje: 'Tarea eliminada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Añade esta ruta después de las otras rutas en tu archivo server.js

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contraseña
 *             properties:
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
app.post('/usuarios/login', async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
      const [rows] = await pool.query('SELECT id, nombre, correo FROM usuarios WHERE correo = ? AND contraseña = ?', [correo, contraseña]);
      if (rows.length > 0) {
        res.json({ id: rows[0].id, nombre: rows[0].nombre, correo: rows[0].correo });
      } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
  
  