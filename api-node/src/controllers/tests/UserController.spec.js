// DESCRIBE -> Bloco de testes (tests suites)
// IT or TEST -> Declara um único teste unitário (tests cases)
// EXPECT -> Asserções do resultado (Verificar se está retornando o resultado esperado)

const UserController = require('../UserController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe("User Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should register a new User successfully", async () => {
        const request = {
            body: {
                name: "teste",
                email: "teste@teste.com",
                password: "123teste"
            }
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        }

        await UserController.register(request, response);

        expect(User.create).toHaveBeenCalledTimes(1);
        expect(User.create).toHaveBeenCalledWith({
            name: 'teste',
            email: 'teste@teste.com',
            password: '123teste'
        });
        expect(response.status).toHaveBeenCalledWith(201);
    });

    test("Should return error if User already exists", async () => {
        const request = {
            body: {
                name: "teste",
                email: "teste@teste.com",
                password: "123teste"
            }
        }

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        }

        User.findOne = jest.fn().mockResolvedValue({ id: 1, email: "teste@teste.com" });

        await UserController.register(request, response);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: "teste@teste.com" } });
        expect(response.status).toHaveBeenCalledWith(409);
        expect(response.json).toHaveBeenCalledWith({ message: 'Usuário já cadastrado com esse email!'});
    });

    test("Should return error if register fails", async () => {
        const request = {
            body: {
                name: "teste",
                email: "teste@teste.com",
                password: "123teste"
            }
        };
    
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    
        User.findOne = jest.fn().mockResolvedValue(null);
        User.create = jest.fn().mockRejectedValue(new Error("Mocking Exception"));
    
        await UserController.register(request, response);
    
        expect(User.create).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({ message: 'Erro ao registrar usuário', error: expect.any(Error) });
    });
});