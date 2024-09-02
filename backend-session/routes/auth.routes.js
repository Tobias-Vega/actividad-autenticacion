import { Router } from "express";
import { login, session, logout } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/session', session);
authRouter.post('/logout', logout);