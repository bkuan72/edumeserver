import { ResponseUserDTO } from '../dtos/ResponseUserDTO';
import HttpException from "./HttpException";

class NonAdminUserException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(501, `User ${user.data.user_name} Not An Admin User`);
  }
}

export default NonAdminUserException;