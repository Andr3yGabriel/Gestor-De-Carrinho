const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(cors());
app.use('/api', require('./routes/routes'));

const startServer = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Tabelas sincronizadas com sucesso!');

        app.listen(port, () => {
            console.log(`API do e-commerce rodando em http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados: ', err);
    }
};

startServer();
