import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
  constructor(email:string) {
    super(404, `${email}:  Invalid Credentials. Login failed.`);
  }
}

export default WrongCredentialsException;