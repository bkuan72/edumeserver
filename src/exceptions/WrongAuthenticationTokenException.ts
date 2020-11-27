import HttpException from "./HttpException";

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(501, `Request with wrong Authentication Token`);
  }
}

export default WrongAuthenticationTokenException;