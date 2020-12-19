import { ResponseUserDTO } from '../dtos/ResponseUserDTO';
import HttpException from "./HttpException";

class ResgistrationConfirmationException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(401, `User ${user.data.user_name} Has Not Completed Email Confirmation Process`);
  }
}

export default ResgistrationConfirmationException;