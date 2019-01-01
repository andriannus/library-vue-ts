import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { createServer, Server } from "http";
import * as mongose from "mongoose";
import * as morgan from "morgan";
import * as socketIO from "socket.io";
import { config } from "./config/index";
import { bookRouter } from "./routes/book";

export class App {
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;

  constructor() {
    this.createApp();
    this.config();
    this.routes();
    this.createServer();
    this.sockets();
    this.listen();
  }

  public getApp(): express.Application {
    return this.app;
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: false,
    }));
  }

  private routes(): void {
    // this.app.use("/api/v1/auth", bookRouter);
    this.app.use("/api/v1/book", bookRouter);
    // this.app.use("/api/v1/user", bookRouter);
  }

  private sockets(): void {
    this.io = socketIO(this.server);
  }

  private listen(): void {
    this.server.listen(config.app.port, () => {
      console.log(`Running server on port ${config.app.port}`);
    });

    this.io.on("connect", (socket: any) => {
      console.log("Socket.io: Connected");

      socket.on("fetch-book", () => {
        this.io.emit("fetch-book");
      });
    });
  }
}
