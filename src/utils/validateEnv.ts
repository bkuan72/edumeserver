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
        DB_PORT: num(),
        PORT: port(),
        JWT_SECRET: str(),
        SITE_CODE: str(),
        DB_BCRYPT_SALT: num(),
        TOKEN_EXP_IN_MIN: num(),
        NODE_ENV: str(),
        CAMEL_CASE_DTO: str(),
        VALID_CORS_ORIGIN: str(),
        COOKIE_AUTH: str(),
        EMAIL_SERVICE: str(),
        EMAIL: str(),
        EMAIL_PASSWORD: str(),
        MAILER_THEME: str(),
        MAILER_PRODUCT_NAME: str(),
        MAILER_LINK_HOST: str(),
        MAILER_PRODUCT_REGISTRATION_LINK: str(),
        MAILER_PRODUCT_RESET_PWD_LINK: str(),
        PROPERTY_SERVICE: str(),
        PROPERTY_SERVICE_PORT: str(),
        USER_ACC_MOD_ROLE_SERVICE: str(),
        USER_ACC_MOD_ROLE_SERVICE_PORT: str(),
    });
  }

  export default validateEnv;