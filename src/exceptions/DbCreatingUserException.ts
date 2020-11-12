import HttpException from "./HttpException";

class DbCreatingNewUserException extends HttpException {
  constructor(email:string) {
    super(404, `Database Error Encountered when creating user ${email}`);
  }
}

export default DbCreatingNewUserException;