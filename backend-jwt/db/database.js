import { createConnection } from 'mysql2/promise'

export const newConnection = async () => {
    try {
        const connection = await createConnection({
            host: 'localhost',
            user: 'root',
            database: 'db_system',
            password: ''
        })
        return connection
    } catch (error) {
        console.error('Ocurrió un error con la conexión a la base de datos')
        res.status(500).json({ msg: 'Internal server error', error: error.msg })
    }
}