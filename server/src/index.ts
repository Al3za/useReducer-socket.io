import express, { Express, json, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();

const CORS_ORIGIN = ["http://localhost:3000"];

const app: Express = express();
app.use(json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, credentials: true },
});

const port = process.env.PORT || 4000;

type Message = {
  id: string;
  text: string;
};

const messages: Message[] = [];
app.post("/chat", (req: Request<Message>, res: Response) => {
  const message: Message = req.body;
  console.log(message);
  messages.push(message);
  res.sendStatus(201);
});

io.on("connection", (socket) => {
  console.log("Client connected to server");
  socket.emit("messages", messages);
  // everytime we get a connection to the server we get the messages send back to us
  socket.on("message", (message) => {
    messages.push(message);
    io.emit("message", message);
  });
});

app.get("/chat", (req: Request, res: Response<Message[]>) => {
  res.send(messages);
});

server.listen(port, () => {
  // we listen to server, wich inside this server there is express server that take care af the client request
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
