import { Server } from "socket.io";

const io = new Server();
let admins: string[] = [];

io.on("connection", (socket) => {
  socket.on('create', (room) => {
    admins.push(socket.id);
    socket.join(room);
  });

  socket.on("join", (room) => {
    if (io.sockets.adapter.rooms.get(room)) {
      socket.join(room);
    } else {
      socket.emit("error", "room not exist");
    }
  });

  socket.on("name submit", (name) => {
    const room = Array.from(socket.rooms).filter(item => item != socket.id)[0];
    io.to(room).emit("name submit", name, socket.id);
  });

  socket.on("name submit result", (id, error) => {
    io.to(id).emit("name submit result", error);
  });

  socket.on("disconnecting", () => {
    const index = admins.indexOf(socket.id);
    const room = Array.from(socket.rooms).filter(item => item != socket.id)[0];
    if (index != -1) {
      admins.splice(index, 1);
      io.to(room).emit("fatal");
    } else {
      io.to(room).emit("disconnected", socket.id);
    }
  });
});

io.of("/").adapter.on("join-room", (room, id) => {
  io.to(id).emit("joined room", room);
});

io.listen(3000);