const Product = require('../models/Product');

class ProductController {
    static async create(req, res) {
        try {
            const { name, link, price, origin } = req.body;
            const product = await Product.create({ name, link, price, origin, userId: req.user.id });
            res.status(201).json(product);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Erro ao cadastrar produto!', error });
        }
    }

    static async getAll(req, res) {
        try {
            const products = await Product.findAll({
                where: { userId: req.user.id },
                attributes: ['id', 'name', 'price']
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao listar produtos', error });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({
                where: { id, userId: req.user.id }
            });

            if (product) {
                res.json(product);
            } else {
                console.error(error);
                res.status(404).json({ message: 'Produto não encontrado' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar produto', error });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, link, price, origin } = req.body;

            const product = await Product.findOne({
                where: { id, userId: req.user.id },
            });

            if (product) {
                product.name = name || product.name;
                product.link = link || product.link;
                product.price = price || product.price;
                product.origin = origin || product.origin;

                await product.save();
                res.json(product);
            } else {
                console.error(error);
                res.status(404).json({ message: 'Produto não encontrado!' });
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Erro ao atualizar produto!', error });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({
                where: { id, userId: req.user.id },
            });

            if (product) {
                await product.destroy();
                res.status(204).send();
            } else {
                console.error(error);
                res.status(404).json({ message: 'Produto não encontrado!' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao excluir produto!', error });
        }
    }
}

module.exports = ProductController