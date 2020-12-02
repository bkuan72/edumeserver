import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(409, `Email ${email} Already Registered`);
  }
}

export default UserWithThatEmailAlreadyExistsException;