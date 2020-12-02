import HttpException from "./HttpException";

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, `Request is missing Authentication Token`);
  }
}

export default AuthenticationTokenMissingException;