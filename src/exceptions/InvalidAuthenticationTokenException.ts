import HttpException from "./HttpException";
interface JwtError {
  name: string;
  message: string;
  date?: string;
  expireAt?: number;
}

class InvalidAuthenticationTokenException extends HttpException {
  constructor(err: JwtError) {
    super(401, err.name + ' : ' + err.message);
  } 
}

export default InvalidAuthenticationTokenException;