import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(404, `Email ${email} Already Registered`);
  }
}

export default UserWithThatEmailAlreadyExistsException;