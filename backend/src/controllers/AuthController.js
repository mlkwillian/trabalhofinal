import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/usuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';

class AuthController {

    // LOGIN
    static async login(req, res) {

        try {

            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Preencha email e senha'
                });
            }

            const usuario = await UsuarioModel.verificarCredenciais(
                email.trim(),
                senha
            );

            if (!usuario) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Email ou senha inválidos'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    tipo: usuario.tipo
                },
                JWT_CONFIG.secret,
                {
                    expiresIn: JWT_CONFIG.expiresIn
                }
            );

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    token,
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        tipo: usuario.tipo
                    }
                }
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao fazer login'
            });

        }
    }

    // REGISTRAR
    static async registrar(req, res) {

        try {

            const {
                nome,
                email,
                senha,
                tipo
            } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Preencha todos os campos'
                });
            }

            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Email inválido'
                });
            }

            // VERIFICAR EMAIL EXISTENTE
            const usuarioExistente =
                await UsuarioModel.buscarPorEmail(
                    email.trim().toLowerCase()
                );

            if (usuarioExistente) {

                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Usuário já existente'
                });

            }

            // CRIAR USUÁRIO
            const usuarioId = await UsuarioModel.criar({
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha,
                tipo: tipo || 'qualidade'
            });

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Conta criada com sucesso',
                dados: {
                    id: usuarioId
                }
            });

        }  catch (error) {

            console.error('Erro ao registrar usuário:', error);
        
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Usuário já existente',
                    mensagem: 'Já existe uma conta com este email'
                });
            }
        
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o usuário'
            });
        }
    }

    // PERFIL
    static async obterPerfil(req, res) {

        try {

            const usuario = await UsuarioModel.buscarPorId(
                req.usuario.id
            );

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            const { senha, ...usuarioSemSenha } = usuario;

            return res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar perfil'
            });

        }
    }

    // ATUALIZAR USUÁRIO
    static async atualizarUsuario(req, res) {

        try {

            const { id } = req.params;

            const {
                nome,
                email,
                senha,
                tipo
            } = req.body;

            const usuario =
                await UsuarioModel.buscarPorId(id);

            if (!usuario) {

                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });

            }

            const dadosAtualizacao = {
                nome,
                email,
                tipo
            };

            if (senha && senha.trim() !== '') {
                dadosAtualizacao.senha = senha;
            }

            await UsuarioModel.atualizar(
                id,
                dadosAtualizacao
            );

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso'
            });

        } catch (error) {

            console.error(error);

            if (error.code === 'ER_DUP_ENTRY') {

                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Este email já está em uso'
                });

            }

            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar usuário'
            });

        }
    }

    // EXCLUIR
    static async excluirUsuario(req, res) {

        try {

            const { id } = req.params;

            await UsuarioModel.excluir(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário excluído com sucesso'
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao excluir usuário'
            });

        }
    }
}

export default AuthController;