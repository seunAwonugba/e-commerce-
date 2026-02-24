import CustomErrorHandler from "./CustomErrorhandler";
import { StatusCodes } from "http-status-codes";

class UnprocessableEntity extends CustomErrorHandler {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}

export default UnprocessableEntity;
