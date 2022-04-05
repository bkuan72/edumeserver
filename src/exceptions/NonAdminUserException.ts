import { UserData } from './../schemas/users.schema';
import { ResponseUserDTO } from '../dtos/user.DTO';
import HttpException from "./HttpException";

class NonAdminUserException extends HttpException {
  constructor(user: ResponseUserDTO| UserData) {
    super(401, `User ${user.username} Not An Admin User`);
  }
}

export default NonAdminUserException;