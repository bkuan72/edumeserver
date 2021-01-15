import { ResponseUserDTO } from '../dtos/userDTO';
import HttpException from "./HttpException";

class NonDevUserException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(401, `User ${user.data.user_name} Not An Developer User`);
  }
}

export default NonDevUserException;