import "dotenv/config";


const DotenvComponent = {
    PORT: process.env.PORT,
    LOGGER_ENVIRONMENT: process.env.LOGGER_ENVIRONMENT,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    LOGGER_SERVICE_NAME: process.env.LOGGER_SERVICE_NAME,
    API_DATABASE_URL: process.env.API_DATABASE_URL,
    API_CRYPTO_KEY: process.env.API_CRYPTO_KEY,
    API_JWT_KEY: process.env.API_JWT_KEY,
    API_JWT_KEY_ACCOUNT_VERIFY: process.env.API_JWT_KEY_ACCOUNT_VERIFY,
    USER_AMD_PASSWORD: process.env.USER_AMD_PASSWORD,
    BASE_URL: process.env.BASE_URL,
    EMAIL: process.env.EMAIL,
    TWILIO_EMAIL_API_KEY: process.env.TWILIO_EMAIL_API_KEY,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY
};


export default DotenvComponent;