import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Servidor
    PORT: process.env.PORT || 4000,
    HOST: process.env.HOST || '0.0.0.0',
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Base de datos (preparado para futuro)
    DATABASE_URL: process.env.DATABASE_URL || '',
    DATABASE_NAME: process.env.DATABASE_NAME || 'jpphub',
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_PORT: process.env.DATABASE_PORT || 5432,
    DATABASE_USER: process.env.DATABASE_USER || '',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',

    // Email (preparado para futuro)
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',

    // Seguridad
    JWT_SECRET: process.env.JWT_SECRET || 'tu_secret_jwt_aqui',
    API_KEY: process.env.API_KEY || '',

    // Desarrollo
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

export default config;
