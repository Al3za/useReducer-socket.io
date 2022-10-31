import express, { Express, json, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const server = http.createServer(app);
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

app.get("/chat", (req: Request, res: Response<Message[]>) => {
  res.send(messages);
});

server.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
