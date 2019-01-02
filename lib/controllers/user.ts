import { Request, Response } from "express";
import * as mongoose from "mongoose";
import { UserSchema } from "../models/user";

const User = mongoose.model("User", UserSchema);

export class UserController {
  public updateName(req: Request, res: Response) {
    const { _id, name } = req.body;

    User.findByIdAndUpdate(_id, { name }, { new: true }, (err, updatedName) => {
      if (err) {
        res.status(200).send({
          message: err,
          status: 500,
          success: false,
        });
      }

      res.status(200).send({
        message: "Name has been updated",
        status: 200,
        success: true,
        user: updatedName,
      });
    });
  }

  public updateUsername(req: Request, res: Response) {
    const { _id, username } = req.body;

    User.findByIdAndUpdate(_id, { username }, { new: true }, (err, updatedUsername) => {
      if (err) {
        res.status(200).send({
          message: err,
          status: 500,
          success: false,
        });
      }

      res.status(200).send({
        message: "Username has been updated",
        status: 200,
        success: true,
        user: updatedUsername,
      });
    });
  }
}
