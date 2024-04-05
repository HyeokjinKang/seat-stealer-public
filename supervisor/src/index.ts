import { Server } from "socket.io";

const io = new Server();

io.on("connection", (socket) => {
  socket.on('create', function (room) {
    socket.join(room);
  });
});

io.of("/").adapter.on("join-room", (room, id) => {
  io.to(id).emit("joined room", room);
});

io.listen(3000);