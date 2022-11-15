import express, { Express, json, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();

const CORS_ORIGIN = ["http://localhost:3000"];

const app: Express = express();
// här har vi vår vanliga express server
app.use(json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

const server = http.createServer(app);
// och här har vi vår http server som innehåller vår express server
// detta för att så vi kan både fånga request från klient som vanligt, och plus vi kan komunicera med fråntend socket.io 

const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, credentials: true },
});// socket io server som komunicerar med vår frontend socket.io

const port = process.env.PORT || 4000;

type Message = {
  id: string;
  text: string;
};

const messages: Message[] = [{id:'123',text:'ciao'},{id:'680',text:'casa'}];

io.on("connection", (socket) => {
  console.log("Client connected to server");
  socket.emit("messages", messages);
  // dessa meddelande sparas i const message: Message[] och renderas automatisk vid start av vår frontend appen
  // useEffect i frontend anropas socket.emit('messages', messages) som skickar all messages till frontend socket.io 
  socket.on("messagez", (message) => {
    messages.push(message);
    io.emit("message", message);
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
