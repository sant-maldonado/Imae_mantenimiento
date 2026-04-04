const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuración de PostgreSQL
// Cambia 'admin123' por la contraseña que usaste al instalar PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'imaedb',
    password: '',
    port: 5433,
});

// Middleware de verificación de roles
function verificarAdmin(req, res, next) {
    const rol = req.body.rol || req.query.rol;
    if (rol !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden realizar esta acción' });
    }
    next();
}

function verificarTecnico(req, res, next) {
    const rol = req.body.rol || req.query.rol;
    if (rol !== 'admin' && rol !== 'tecnico') {
        return res.status(403).json({ error: 'Solo técnicos y administradores pueden realizar esta acción' });
    }
    next();
}

// Middleware para logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================
// RUTAS DE USUARIOS
// ============================================
app.get('/api/usuarios', async (req, res) => {
    try {
        console.log('Consultando usuarios...');
        const result = await pool.query('SELECT * FROM usuarios ORDER BY fecha_creacion DESC');
        console.log('Usuarios encontrados:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const { id, email, password, nombre, apellido, rol, activo } = req.body;
        const result = await pool.query(
            'INSERT INTO usuarios (id, email, password, nombre, apellido, rol, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, email, password, nombre, apellido, rol || 'tecnico', activo !== false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, nombre, apellido, rol, activo, ultimo_login } = req.body;
        const result = await pool.query(
            'UPDATE usuarios SET email=$1, password=$2, nombre=$3, apellido=$4, rol=$5, activo=$6, ultimo_login=$7 WHERE id=$8 RETURNING *',
            [email, password, nombre, apellido, rol, activo, ultimo_login, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE LABORATORIOS
// ============================================
app.get('/api/laboratorios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM laboratorios ORDER BY fecha_creacion DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/laboratorios/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM laboratorios WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/laboratorios', async (req, res) => {
    try {
        const { id, nombre, codigo, ubicacion, responsable, activo } = req.body;
        const result = await pool.query(
            'INSERT INTO laboratorios (id, nombre, codigo, ubicacion, responsable, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, nombre, codigo, ubicacion, responsable, activo !== false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/laboratorios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, codigo, ubicacion, responsable, activo } = req.body;
        const result = await pool.query(
            'UPDATE laboratorios SET nombre=$1, codigo=$2, ubicacion=$3, responsable=$4, activo=$5 WHERE id=$6 RETURNING *',
            [nombre, codigo, ubicacion, responsable, activo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/laboratorios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM laboratorios WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE EQUIPOS
// ============================================
app.get('/api/equipos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipos ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/equipos/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipos WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/equipos', async (req, res) => {
    try {
        const fields = Object.keys(req.body).join(', ');
        const values = Object.values(req.body);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const result = await pool.query(
            `INSERT INTO equipos (${fields}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/equipos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body).map((k, i) => `${k}=$${i + 1}`).join(', ');
        const values = [...Object.values(req.body), id];
        const result = await pool.query(`UPDATE equipos SET ${updates} WHERE id=$${values.length} RETURNING *`, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/equipos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM equipos WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE COMPONENTES
// ============================================
app.get('/api/componentes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM componentes ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/componentes/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM componentes WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/componentes', async (req, res) => {
    try {
        const fields = Object.keys(req.body).join(', ');
        const values = Object.values(req.body);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const result = await pool.query(
            `INSERT INTO componentes (${fields}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/componentes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body).map((k, i) => `${k}=$${i + 1}`).join(', ');
        const values = [...Object.values(req.body), id];
        const result = await pool.query(`UPDATE componentes SET ${updates} WHERE id=$${values.length} RETURNING *`, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/componentes/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM componentes WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE TÉCNICOS
// ============================================
app.get('/api/tecnicos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tecnicos ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tecnicos/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tecnicos WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tecnicos', async (req, res) => {
    try {
        const fields = Object.keys(req.body).join(', ');
        const values = Object.values(req.body);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const result = await pool.query(
            `INSERT INTO tecnicos (${fields}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tecnicos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body).map((k, i) => `${k}=$${i + 1}`).join(', ');
        const values = [...Object.values(req.body), id];
        const result = await pool.query(`UPDATE tecnicos SET ${updates} WHERE id=$${values.length} RETURNING *`, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tecnicos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM tecnicos WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE TAREAS
// ============================================
app.get('/api/tareas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas ORDER BY fecha_creacion DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tareas/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tareas', async (req, res) => {
    try {
        const fields = Object.keys(req.body).join(', ');
        const values = Object.values(req.body);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const result = await pool.query(
            `INSERT INTO tareas (${fields}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body).map((k, i) => `${k}=$${i + 1}`).join(', ');
        const values = [...Object.values(req.body), id];
        const result = await pool.query(`UPDATE tareas SET ${updates} WHERE id=$${values.length} RETURNING *`, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tareas/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM tareas WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTA DASHBOARD
// ============================================
app.get('/api/dashboard', async (req, res) => {
    try {
        const [equipos, tareas, tecnicos, componentes, labs] = await Promise.all([
            pool.query("SELECT COUNT(*) as total FROM equipos WHERE activo = true"),
            pool.query("SELECT COUNT(*) as total FROM tareas WHERE estado = 'pendiente'"),
            pool.query("SELECT COUNT(*) as total FROM tecnicos WHERE estado = 'activo'"),
            pool.query('SELECT COUNT(*) as total FROM componentes WHERE activo = true'),
            pool.query("SELECT COUNT(*) as total FROM laboratorios WHERE activo = true")
        ]);
        res.json({
            equiposActivos: parseInt(equipos.rows[0].total),
            tareasPendientes: parseInt(tareas.rows[0].total),
            tecnicosActivos: parseInt(tecnicos.rows[0].total),
            componentes: parseInt(componentes.rows[0].total),
            laboratorios: parseInt(labs.rows[0].total)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTA DE ESTADO
// ============================================
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log('========================================');
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('========================================');
    console.log('Rutas disponibles:');
    console.log('  - GET    /api/usuarios');
    console.log('  - POST   /api/usuarios');
    console.log('  - PUT    /api/usuarios/:id');
    console.log('  - DELETE /api/usuarios/:id');
    console.log('  - GET    /api/laboratorios');
    console.log('  - POST   /api/laboratorios');
    console.log('  - GET    /api/equipos');
    console.log('  - POST   /api/equipos');
    console.log('  - GET    /api/componentes');
    console.log('  - POST   /api/componentes');
    console.log('  - GET    /api/tecnicos');
    console.log('  - POST   /api/tecnicos');
    console.log('  - GET    /api/tareas');
    console.log('  - POST   /api/tareas');
    console.log('  - GET    /api/dashboard');
    console.log('========================================');
});