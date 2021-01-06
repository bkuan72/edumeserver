import { ResponseUserDTO } from '../dtos/userDTO';
import HttpException from "./HttpException";

class NonAdminUserException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(401, `User ${user.data.user_name} Not An Admin User`);
  }
}

export default NonAdminUserException;