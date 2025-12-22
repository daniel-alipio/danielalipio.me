const { createPool } = require('mysql2/promise');
const mongoose = require('mongoose');
const config = require('../config/config')();
const logger = require('../utils/logger');

const db = {
    mysql: null,
    mongodb: null,
};

async function connect() {
    if (config.handler.mysql.uri && config.handler.mysql.active === true) {
        try {
            const pool = createPool({
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                connectTimeout: 60000 
            });
            
            logger.info('Pool de conexões MySQL estabelecido com sucesso.');
            db.mysql = pool;
        } catch (error) {
            logger.error('Falha crítica ao conectar ao MySQL:', error);
        
            throw error; 
        }
    } else {
        logger.warn('URI do MySQL não fornecida. Conexão ao MySQL não foi estabelecida.');
    }

    if (config.handler.mongodb.uri) {
        try {
            await mongoose.connect(config.handler.mongodb.uri, {});
            
            logger.info('Conexão com o MongoDB via Mongoose realizada com sucesso.');
            db.mongodb = mongoose.connection;

            db.mongodb.on('error', (err) => {
                logger.error('Erro na conexão Mongoose:', err);
            });
            db.mongodb.on('disconnected', () => {
                logger.warn('Mongoose desconectado.');
            });

        } catch (error) {
            logger.error('Falha crítica ao conectar ao MongoDB via Mongoose:', error);
        }
    } else {
        logger.warn('URI do MongoDB não fornecida. Conexão ao MongoDB não foi estabelecida.');
    }
}

module.exports = { connect, db };
