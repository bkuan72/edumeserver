import HttpException from "./HttpException";

class RegistrationKeyException extends HttpException {
  constructor(email:string, regConfirmKey: string) {
    super(204, `Invalid Registration Key ${regConfirmKey} for Email=${email}`);
  }
}

export default RegistrationKeyException;