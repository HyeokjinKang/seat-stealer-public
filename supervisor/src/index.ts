import { Server } from "socket.io";

const io = new Server();

io.on("connection", (socket) => {
  socket.on('create', (room) => {
    socket.join(room);
  });

  socket.on("join", (room) => {
    console.log(io.sockets.adapter.rooms.get(room));
    if (io.sockets.adapter.rooms.get(room)) {
      socket.join(room);
    } else {
      socket.emit("error", "room not exist");
    }
  });
});

io.of("/").adapter.on("join-room", (room, id) => {
  io.to(id).emit("joined room", room);
});

io.listen(3000);