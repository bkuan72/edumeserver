import { ResponseUserDTO } from '../dtos/userDTO';
import HttpException from "./HttpException";

class InvalidUserStatusException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(401, `User ${user.data.user_name} Not Authorized : ${user.data.status}`);
  }
}

export default InvalidUserStatusException;