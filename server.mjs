import "dotenv/config";
import {
  createRoom,
  getMessages,
  getRooms,
  storeMessage,
} from "./src/appwrite/appwrite_server.mjs";
import { Server } from "socket.io";
import { createServer } from "node:http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ hostname, dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔗 Client connected: ${socket.id}`);

    socket.on("join-room", ({ room, user }) => {
      console.log(`${user} joined room: ${room}`);
      socket.join(room);
      socket.to(room).emit("user_joined", `${user} has joined the room`);
    });

    socket.on("create-room", async ({ room, user }) => {
      try {
        await createRoom({ room, user });
        socket.join(room);
        console.log(`${user} room created: ${room}`);
        socket.to(room).emit("user_joined", `${user} joined room: ${room}`);
      } catch (error) {
        console.error("Error creating room:", error);
      }
    });

    socket.on("message", async (msgdata) => {
      console.log("Message received:", msgdata);

      const { room, message, user, timeStamp } = msgdata;
      try {
        await storeMessage({ room, message, user });
        console.log(`[msg]: ${user} sent message in ${room}`);

        // 🔥 Fix: Emit to all (including sender)
        io.to(room).emit("message", { user, message, room, timeStamp });
      } catch (error) {
        console.error("Error storing message:", error);
      }
    });

    socket.on("rooms", async () => {
      console.log(`Getting rooms for: ${socket.id}`);
      try {
        const roomData = await getRooms();
        socket.emit("roomList", roomData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    });

    socket.on("messages", async ({ room }) => {
      console.log(`Getting messages for: ${room}`);
      try {
        const roomData = await getMessages({ room });
        socket.emit("messageList", roomData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    });

    socket.on("debug-rooms", () => {
      console.log("Active rooms:", io.sockets.adapter.rooms);
      io.emit("debug-rooms", Array.from(io.sockets.adapter.rooms.keys()));
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`server is running on http://${hostname}:${port}`);
  });
});
