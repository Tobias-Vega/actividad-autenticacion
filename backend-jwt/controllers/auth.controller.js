import { newConnection } from "../db/database.js";
import generarJwt from "../helpers/generar-jwt.js";

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
        }

        const token = await generarJwt({id: searchUser[0].id});

        req.session.token = token

        res.cookie('authToken', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript
            secure: false, // Cambiar a true en producción con HTTPS
            maxAge: 3600000 // Expiración en milisegundos (1 hora)
        });
        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            token
        });
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
};

// Ruta para obtener los datos de la sesión
export const session = async (req, res) => {
    if (req.session.userId) {
        return res.json({ 
            loggedIn: true, 
            user: { id: req.session.userId, username: req.session.username } });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
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