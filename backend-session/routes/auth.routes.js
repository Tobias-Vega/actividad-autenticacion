import { Router } from "express";
import { login, session, logout,register } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post('/register', register)
authRouter.post('/login', login);
authRouter.get('/session', session);
authRouter.post('/logout', logout);