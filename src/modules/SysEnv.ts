import { isUndefined } from "./isUndefined";

class SystemEnvironment {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    PORT: number;
    JWT_SECRET: string;
    DB_BCRYPT_SALT: number;
    SITE_CODE: string;
    TOKEN_EXP_IN_MIN: number;
    NODE_ENV: string;
    MIN_LAG: number;
    MIN_LAG_INTERVAL: number;
    constructor () {
        this.DB_HOST = 'localhost';
        this.DB_USER = 'webservice';
        this.DB_PASSWORD = ''
        this.DB_NAME = 'testdb';
        this.PORT = 3000;
        this.JWT_SECRET = '';
        this.DB_BCRYPT_SALT = 10;
        this.SITE_CODE = 'TEST';
        this.TOKEN_EXP_IN_MIN = 60;
        this.NODE_ENV = 'development';
        this.MIN_LAG = 70;
        this.MIN_LAG_INTERVAL = 500;
        if (process.env.DB_HOST !== undefined) {
            this.DB_HOST = process.env.DB_HOST;
        }
        if (process.env.DB_USER !== undefined) {
            this.DB_USER = process.env.DB_USER;
        }
        if (process.env.DB_PASSWORD !== undefined) {
            this.DB_PASSWORD = process.env.DB_PASSWORD;
        }
        if (process.env.DB_NAME !== undefined) {
            this.DB_NAME = process.env.DB_NAME;
        }
        if (process.env.PORT !== undefined) {
            this.PORT = parseInt(process.env.PORT);
        }
        if (process.env.JWT_SECRET !== undefined) {
            this.JWT_SECRET = process.env.JWT_SECRET;
        }
        if (process.env.DB_BCRYPT_SALT !== undefined) {
            this.DB_BCRYPT_SALT = parseInt(process.env.DB_BCRYPT_SALT);
        }
        if (process.env.SITE_CODE !== undefined) {
            this.SITE_CODE = process.env.SITE_CODE;
        }
        if (process.env.TOKEN_EXP_IN_MIN !== undefined) {
            this.TOKEN_EXP_IN_MIN = parseInt(process.env.TOKEN_EXP_IN_MIN);
        }
        if (process.env.NODE_ENV !== undefined) {
            this.NODE_ENV = process.env.NODE_ENV;
        }
        if (process.env.MIN_LAG !== undefined) {
            this.MIN_LAG = parseInt(process.env.MIN_LAG);
        }
        if (process.env.MIN_LAG_INTERVAL !== undefined) {
            this.MIN_LAG_INTERVAL = parseInt(process.env.MIN_LAG_INTERVAL);
        }
    }
}

const SysEnv = new SystemEnvironment();

export default SysEnv;