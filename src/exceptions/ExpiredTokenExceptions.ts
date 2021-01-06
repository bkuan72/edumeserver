import { ResponseUserDTO } from "../dtos/userDTO";
import HttpException from "./HttpException";

class ExpiredTokenException extends HttpException {
    constructor(user: ResponseUserDTO) {
      super(440, `User ${user.data.user_name} Used Expired Authentication Token`);
    }
  }

export default ExpiredTokenException;