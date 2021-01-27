import HttpException from "./HttpException";

class UpdateDataFailedException extends HttpException {
  constructor(message: string,
    id: string) {
    super(400, `Update ${message} ${id} Data Failed!`);
  }
}

export default UpdateDataFailedException;