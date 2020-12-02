import HttpException from "./HttpException";

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(403, `Request with wrong Authentication Token`);
  }
}

export default WrongAuthenticationTokenException;