import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message?: any,
  data?: any
) => {
  res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
};
