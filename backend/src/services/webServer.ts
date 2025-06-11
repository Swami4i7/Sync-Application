import express, { Express, json, Request, Response, urlencoded } from "express";
import path from "path";
import { Server } from "http";
import cors from "cors";
import { port } from "../config/webServer";
import router from "../routes";

let httpServer: Server;

export const initialize = () => {
  return new Promise<void>((resolve, reject) => {
    const app: Express = express();

    app.use(json());
    app.use(cors());
    app.use(urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, "..", "public")));

    // *** Mount the all routes
    app.use(process.env.BASE_URL ?? "/api/sync", router);

    // app.get('/', (req: Request, res: Response) => {
    //   res.writeHead(200, { 'Content-Type': 'text/plain' });
    //   res.end('Welcome to Node Js Application');
    // });

    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    });

    app.use(function (req, res, next) {
      res.status(404);
      res.send("404: File Not Found");
    });
    // Listening the port for server
    httpServer = app
      .listen(port, () => {
        console.log(`Web server listening on ${port}`);
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export const close = () => {
  return new Promise<void>((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
