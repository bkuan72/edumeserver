import HttpException from "./HttpException";

class ServerTooBusyException extends HttpException {
  constructor() {
    super(404, `Server Too Busy!`);
  }
}

export default ServerTooBusyException;