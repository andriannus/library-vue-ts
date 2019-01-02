import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as _ from "lodash";
import { config } from "../config/index";
import { User } from "../models/user";

export class AuthController {
  public login(req: Request, res: Response) {
    const { email, password } = req.body;

    User.findOne({ email })
      .exec((err, user) => {
        if (err) {
          res.status(200).send({
            message: err,
            status: 500,
            success: false,
          });
        } else if (!user) {
          res.status(200).send({
            message: "User not found",
            status: 404,
            success: false,
          });
        } else {
          user.comparePassword(password, (fault, isMatch) => {
            if (fault) {
              res.status(200).send({
                message: fault,
                status: 500,
                success: false,
              });
            }

            if (!isMatch) {
              res.status(200).send({
                message: "Password does not match",
                status: 401,
                success: false,
              });
            } else {
              jwt.sign(
                { user },
                config.jwt.secretKey,
                { expiresIn: config.jwt.expiresIn },
                (fail, token) => {
                  if (fail) {
                    res.status(200).send({
                      message: fail,
                      status: 500,
                      success: false,
                    });
                  }

                  res.status(200).header("t-t", token).send({
                    message: "Login successful",
                    status: 200,
                    success: true,
                    token,
                    user,
                  });
                },
              );
            }
          });
        }
      });
  }

  public register(req: Request, res: Response) {
    const newUser = new User();

    _.forEach(req.body, (value, index) => {
      newUser[index] = value;
    });

    newUser.save((err, user) => {
      if (err) {
        res.status(200).send({
          message: err,
          status: 500,
          success: false,
        });
      }

      res.status(200).send({
        data: user,
        message: "Successful registration",
        status: 201,
        success: true,
      });
    });
  }

  public checkEmail(req: Request, res: Response) {
    const { email } = req.body;

    User.findOne({ email })
      .exec((err, success) => {
        if (err) {
          res.status(500).send({
            message: err,
            status: 500,
            success: false,
          });
        }

        if (!success) {
          res.status(200).send({
            message: "E-mail can be used",
            status: 200,
            success: true,
          });
        } else {
          res.status(200).send({
            message: "E-mail cannot be used",
            status: 500,
            success: false,
          });
        }
      });
  }

  public checkUsername(req: Request, res: Response) {
    const { username } = req.body;

    User.findOne({ username })
      .exec((err, success) => {
        if (err) {
          res.status(500).send({
            message: err,
            status: 500,
            success: false,
          });
        }

        if (!success) {
          res.status(200).send({
            message: "Username can be used",
            status: 200,
            success: true,
          });
        } else {
          res.status(200).send({
            message: "Username cannot be used",
            status: 500,
            success: false,
          });
        }
      });
  }

  public refreshToken(req: Request, res: Response) {
    const { _id } = req.body;

    User.findById(_id)
      .exec((err, user) => {
        if (err) {
          res.status(200).send({
            message: err,
            status: 500,
            success: false,
          });
        } else if (!user) {
          res.status(200).send({
            message: "User not found",
            status: 404,
            success: false,
          });
        } else {
          jwt.sign(
            { user },
            config.jwt.secretKey,
            { expiresIn: config.jwt.expiresIn },
            (fail, token) => {
              if (fail) {
                res.status(200).send({
                  message: fail,
                  status: 500,
                  success: false,
                });
              }

              res.status(200).header("t-t", token).send({
                message: "Login successful",
                status: 200,
                success: true,
                token,
                user,
              });
            },
          );
        }
      });
  }
}
