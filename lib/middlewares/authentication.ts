import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config/index";

export function isAuthentication(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["t-t"] as string;

  if (!!token === true) {
    jwt.verify(token, config.jwt.secretKey, (err) => {
      if (err) {
        res.status(500).send({
          message: "Token expired",
          status: 500,
          success: false,
        });
      } else {
        next();
      }
    });
  } else {
    res.status(500).send({
      message: "Token not found",
      status: 404,
      success: false,
    });
  }
}
