const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

class UserController {
    static async register(req, res) {
        try {
            const {name, email, password} = req.body;
            let user = await User.findOne({ where: { email }});
            if (user) {
                res.status(409).json({ message: 'Usuário já cadastrado com esse email!'})
            } else {
                user = await User.create({name, email, password});
                res.status(201).json({message: 'Usuario criado com sucesso!', name, email});
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Erro ao registrar usuário', error});
        }
    }

    static async login(req, res) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: 'Nenhum usuário cadastrado com esse email!' });
            } else if (!(await user.validatePassword(password))) {
                return res.status(401).json({ message: 'Credenciais fornecidas são inválidas!' })
            }

            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
            res.json({ 
                token, 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                } 
            })
        } catch (err) {
            res.status(500).json({ message: 'Erro ao fazer login!', err });
            console.error(err)
        } 
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email} = req.body;

            const user = await User.findOne({
                where: { id },
            });

            if (user) {
                user.name = name || user.name;
                user.email = email || user.email;

                await user.save();
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'Usuário não encontrado!' })
            };
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: 'Erro ao atualizar as informações do usuário!', error});
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params;
        const { currentPassword } = req.body;
    
        try {
            const user = await User.findOne({ where: { id } });
    
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }
    
            const isPasswordValid = await user.validatePassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Senha atual incorreta!' });
            }
    
            await user.destroy();
            res.status(204).json({ message: 'Usuário excluído com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao excluir o usuário!', error });
        }
    }
    

    static async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;

        try {
            const userId = req.user.id;

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado!'})
            }

            const isPasswordValid = await user.validatePassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Senha atual incorreta!' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            await user.save()

            res.status(204).json({ message: 'Senha alterada com sucesso!' });
        } catch (error) {
             console.error(error)
            res.status(500).json({ message: 'Erro ao alterar senha!', error })
        }
    }
}

module.exports = UserController;
