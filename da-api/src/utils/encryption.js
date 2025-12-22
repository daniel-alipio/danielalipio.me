const crypto = require('crypto');
const bcrypt = require('bcrypt');
const logger = require('./logger');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : null;
const HASH_SECRET = process.env.HASH_SECRET;
const ALGORITHM = 'aes-256-gcm';
const SALT_ROUNDS = 12;
const MAX_TEXT_LENGTH = 10000;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!ENCRYPTION_KEY || !HASH_SECRET)) {
    logger.error('🚨 ERRO CRÍTICO: ENCRYPTION_KEY e/ou HASH_SECRET não configurados.');
    process.exit(1);
}

if (!isProduction && (!ENCRYPTION_KEY || !HASH_SECRET)) {
    if (process.env.NODE_ENV === 'production') {
        logger.error('🚨 ERRO CRÍTICO: ENCRYPTION_KEY ou HASH_SECRET não definidos');
        process.exit(1);
    }
    logger.warn('⚠️ ATENÇÃO: Usando chaves de desenvolvimento INSEGURAS');
}

const keyBuffer = ENCRYPTION_KEY
    ? Buffer.from(ENCRYPTION_KEY, 'hex')
    : (process.env.NODE_ENV === 'development'
            ? Buffer.alloc(32, 'dev-UNSAFE-key')
            : (() => { throw new Error('ENCRYPTION_KEY não configurado'); })()
    );

const hashSecret = HASH_SECRET
    || (process.env.NODE_ENV === 'development'
            ? 'dev-UNSAFE-secret'
            : (() => { throw new Error('HASH_SECRET não configurado'); })()
    );

function encrypt(text) {
    if (!text) return null;
    if (typeof text !== 'string') {
        throw new TypeError('Texto deve ser string');
    }
    if (text.length > MAX_TEXT_LENGTH) {
        throw new Error('Texto muito grande para criptografar');
    }

    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
        logger.error('Falha ao criptografar:', { type: error.name });
        throw new Error('Erro de criptografia.');
    }
}

function decrypt(encryptedText) {
    if (!encryptedText) return null;

    try {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) return null;

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        logger.error('Falha ao descriptografar:', { type: error.name });
        return null;
    }
}

function hashData(text) {
    if (!text) return null;
    const hmac = crypto.createHmac('sha256', hashSecret);
    hmac.update(text);
    return hmac.digest('hex');
}

async function hashPassword(password) {
    if (!password) return null;
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        logger.error('Falha ao hash de senha:', { type: error.name });
        throw new Error('Erro ao processar senha.');
    }
}

async function verifyPassword(password, hashedPassword) {
    if (!password || !hashedPassword) return false;
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error('Falha ao verificar senha:', { type: error.name });
        return false;
    }
}

module.exports = {
    encrypt,
    decrypt,
    hashData,
    hashPassword,
    verifyPassword
};
