import { ResponseUserDTO } from "../dtos/ResponseUserDTO";
import HttpException from "./HttpException";

class ExpiredTokenException extends HttpException {
    constructor(user: ResponseUserDTO) {
      super(501, `User ${user.data.user_name} Used Expired Authentication Token`);
    }
  }

export default ExpiredTokenException;