import { newConnection } from "../db/database.js";

//Ruta para manejar el registro de usuario
export const register = async (req,res) => {
    const { username, password } = req.body

    try {
        const connection = await newConnection();

        const [result] = await connection.query(`
            INSERT INTO users (username, password)
            VALUES (?,?)`, [username,password])

            res.status(201).json({
                msg: 'Registrado correctamente'
            })
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
}

// Ruta para manejar el inicio de sesión
export const login = async (req, res) => {
    const { username, password } = req.body;

    // Buscar usuario
    try {
        const connection = await newConnection();

        const [searchUser] = await connection.query(
            `SELECT * FROM users WHERE username = ?`, 
            [username]
        );

        if (searchUser.length === 0 || searchUser[0].password !== password) {
            return res.status(401).json({
                msg: 'Credenciales incorrectas'
            });
        } else {
            return res.status(200).json({
                msg: 'Inicio de sesión exitoso'
            });
        }
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
};

// Ruta para obtener los datos de la sesión
export const session = async (req, res) => {
    try {
        const connection = await newConnection()

        const [result] = await connection.query(`SELECT * FROM users`)
    
        if(result.length === 0) {
            res.status(400)
        }
    
        res.json(result)

        connection.end()
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.msg})
    }
    
};

// Ruta para cerrar la sesión
export const logout = (req, res) => {
    console.log(req.session)
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
        return res.json({ message: 'Sesión cerrada exitosamente' });
    });
};