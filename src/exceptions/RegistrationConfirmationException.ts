import { ResponseUserDTO } from '../dtos/userDTO';
import HttpException from "./HttpException";

class RegistrationConfirmationException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(401, `User ${user.data.user_name} Has Not Completed Email Confirmation Process`);
  }
}

export default RegistrationConfirmationException;