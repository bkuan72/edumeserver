import { UserData } from './../schemas/users.schema';
import { ResponseUserDTO } from '../dtos/userDTO';
import HttpException from "./HttpException";

class NonAdminUserException extends HttpException {
  constructor(user: ResponseUserDTO| UserData) {
    super(401, `User ${user.user_name} Not An Admin User`);
  }
}

export default NonAdminUserException;