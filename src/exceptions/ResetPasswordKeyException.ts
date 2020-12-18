import HttpException from "./HttpException";

class ResetPasswordKeyException extends HttpException {
  constructor(email:string, resetPasswordKey: string) {
    super(204, `Invalid Reset Password Key ${resetPasswordKey} for Email=${email}`);
  }
}

export default ResetPasswordKeyException;