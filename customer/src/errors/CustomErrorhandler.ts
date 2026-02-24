import { StatusCodes } from "http-status-codes";

class CustomErrorHandler extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode =
      StatusCodes.BAD_REQUEST || StatusCodes.UNPROCESSABLE_ENTITY;
  }
}

export default CustomErrorHandler;
