import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js';
import { newConnection } from '../db/database.js';

export const validarJwt = async (req, res, next) => {
    console.log(req.session);
    console.log('-----------');
    console.log(req.cookies);

    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        if (!userId) {
            return res.status(401).json({ msg: 'Token inválido' });
        }

        const connection = await newConnection();

        const [result] = await connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);

        if (result.length === 0) {
            connection.end();
            return res.status(401).json({ msg: 'Usuario no encontrado' });
        }

        req.session.userId = userId;
        req.session.username = result[0].username;

        connection.end();

        next();

    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
};
