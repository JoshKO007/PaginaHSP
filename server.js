const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Configuración de PostgreSQL (Usa la variable de entorno DATABASE_URL o credenciales locales por defecto)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/paginahsp'
});

// Inicializar la tabla en PostgreSQL si no existe
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pdf_page_configurations (
                id SERIAL PRIMARY KEY,
                config_name VARCHAR(100) NOT NULL DEFAULT 'predeterminado' UNIQUE,
                is_default BOOLEAN NOT NULL DEFAULT FALSE,
                coordinates_data JSONB NOT NULL,
                table_cols_data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla pdf_page_configurations verificada / creada en PostgreSQL');
    } catch (err) {
        console.error('Error al inicializar tabla en BD:', err.message);
    }
};
initDb();

// POST /api/pdf-config : Guardar diseño en la base de datos
app.post('/api/pdf-config', async (req, res) => {
    const { config_name = 'layout_cotizacion', is_default = false, coordinates_data, table_cols_data } = req.body;
    try {
        const currentStr = JSON.stringify({ coordinates_data, table_cols_data });

        if (is_default) {
            // Verificar si ya existe un predeterminado
            const defaultRes = await pool.query(
                `SELECT coordinates_data, table_cols_data FROM pdf_page_configurations WHERE is_default = TRUE LIMIT 1`
            );

            if (defaultRes.rows.length > 0) {
                const existingStr = JSON.stringify({
                    coordinates_data: defaultRes.rows[0].coordinates_data,
                    table_cols_data: defaultRes.rows[0].table_cols_data
                });

                if (currentStr === existingStr) {
                    return res.json({
                        success: true,
                        isDuplicate: true,
                        message: 'La configuración actual es exactamente igual a la predeterminada existente. No se creó un duplicado y se usará la predeterminada.'
                    });
                }
            }

            // Guardar / Reemplazar el diseño predeterminado
            await pool.query(
                `INSERT INTO pdf_page_configurations (config_name, is_default, coordinates_data, table_cols_data, updated_at)
                 VALUES ($1, TRUE, $2, $3, NOW())
                 ON CONFLICT (config_name) 
                 DO UPDATE SET is_default = TRUE, coordinates_data = EXCLUDED.coordinates_data, table_cols_data = EXCLUDED.table_cols_data, updated_at = NOW()`,
                [config_name, JSON.stringify(coordinates_data), JSON.stringify(table_cols_data)]
            );
            return res.json({ success: true, isDefault: true, message: 'Configuración guardada y establecida como PREDETERMINADA en la base de datos.' });
        } else {
            // Guardar diseño normal
            await pool.query(
                `INSERT INTO pdf_page_configurations (config_name, is_default, coordinates_data, table_cols_data, updated_at)
                 VALUES ($1, FALSE, $2, $3, NOW())
                 ON CONFLICT (config_name) 
                 DO UPDATE SET coordinates_data = EXCLUDED.coordinates_data, table_cols_data = EXCLUDED.table_cols_data, updated_at = NOW()`,
                [config_name, JSON.stringify(coordinates_data), JSON.stringify(table_cols_data)]
            );
            return res.json({ success: true, message: 'Diseño guardado en la base de datos correctamente.' });
        }
    } catch (err) {
        console.error('Error al guardar en BD:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/pdf-config : Cargar diseño guardado o predeterminado de la base de datos
app.get('/api/pdf-config', async (req, res) => {
    const configName = req.query.config_name || 'layout_cotizacion';
    try {
        let dbRes = await pool.query(
            `SELECT coordinates_data, table_cols_data, is_default FROM pdf_page_configurations WHERE config_name = $1 LIMIT 1`,
            [configName]
        );

        if (dbRes.rows.length === 0) {
            dbRes = await pool.query(
                `SELECT coordinates_data, table_cols_data, is_default FROM pdf_page_configurations WHERE is_default = TRUE LIMIT 1`
            );
        }

        if (dbRes.rows.length > 0) {
            return res.json({ success: true, data: dbRes.rows[0] });
        }
        return res.json({ success: false, message: 'No hay configuración guardada en BD.' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor PaginaHSP en ejecución en http://localhost:${PORT}`));
