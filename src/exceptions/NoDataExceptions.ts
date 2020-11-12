import HttpException from "./HttpException";

class NoDataException extends HttpException {
  constructor() {
    super(404, `No Result Found`);
  }
}

export default NoDataException;