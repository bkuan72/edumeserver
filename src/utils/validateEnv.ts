/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    cleanEnv, str, port, num
  } from 'envalid';
   
  function validateEnv() {
    cleanEnv(process.env, {
        DB_HOST: str(),
        DB_USER: str(),
        DB_PASSWORD: str(),
        DB_NAME: str(),
        PORT: port(),
        JWT_SECRET: str(),
        SITE_CODE: str(),
        DB_BCRYPT_SALT: num(),
        TOKEN_EXP_IN_MIN: num(),
        NODE_ENV: str(),
        MIN_LAG: num(),
        MIN_LAG_INTERVAL: num(),
        VALID_CORS_ORIGIN: str(),
        COOKIE_AUTH: str()
    });
  }

  export default validateEnv;