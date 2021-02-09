import { UserData } from './../schemas/users.schema';
import { ResponseUserDTO } from '../dtos/userDTO';
import HttpException from "./HttpException";

class RegistrationConfirmationException extends HttpException {
  constructor(user: ResponseUserDTO | UserData) {
    super(401, `User ${user.user_name} Has Not Completed Email Confirmation Process`);
  }
}

export default RegistrationConfirmationException;