import { createConnection } from 'mysql2/promise'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config/env.js'

export const newConnection = async () => {
    try {
        const connection = await createConnection({
            host: DB_HOST,
            user: DB_USER,
            database: DB_NAME,
            password: DB_PASSWORD
        })
        return connection
    } catch (error) {
        console.error('Ocurrió un error con la conexión a la base de datos')
        res.status(500).json({ msg: 'Internal server error', error: error.msg })
    }
}