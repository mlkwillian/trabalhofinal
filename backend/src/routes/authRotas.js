import express from 'express';
import AuthController from '../controllers/AuthController.js';
import {
  authMiddleware,
  adminMiddleware
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// LOGIN
router.post('/login', AuthController.login);

// REGISTRAR
router.post('/registrar', AuthController.registrar);

// PERFIL
router.get(
  '/perfil',
  authMiddleware,
  AuthController.obterPerfil
);

// LISTAR USUARIOS
router.get(
  '/usuarios',
  authMiddleware,
  adminMiddleware,
  AuthController.listarUsuarios
);

// CRIAR USUARIO
router.post(
  '/usuarios',
  authMiddleware,
  adminMiddleware,
  AuthController.criarUsuario
);

// ATUALIZAR USUARIO
router.put(
  '/usuarios/:id',
  authMiddleware,
  AuthController.atualizarUsuario
);

// DELETAR USUARIO
router.delete(
  '/usuarios/:id',
  authMiddleware,
  adminMiddleware,
  AuthController.excluirUsuario
);

export default router;