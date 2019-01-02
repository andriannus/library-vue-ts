import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { createServer, Server } from "http";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as socketIO from "socket.io";
import { config } from "./config/index";
import { authRouter } from "./routes/auth";
import { bookRouter } from "./routes/book";
import { userRouter } from "./routes/user";

export class App {
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private mongoUri: string = config.db.mongoUri;

  constructor() {
    this.createApp();
    this.config();
    this.mongoSetup();
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

  private mongoSetup(): void {
    mongoose.set("useFindAndModify", false);
    (mongoose as any).Promise = global.Promise;
    mongoose.connect(this.mongoUri, { useNewUrlParser: true }, (err) => {
      if (err) {
        console.log(`MongoDB: ${err}`);
      } else {
        console.log("MongoDB: Connected");
      }
    });
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
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/book", bookRouter);
    this.app.use("/api/v1/user", userRouter);
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
