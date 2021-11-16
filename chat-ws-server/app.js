const { Server } = require('socket.io');

const io = new Server({
  /* options */
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  // Join Room
  socket.on('join', () => {
    socket.join(`room-${socket.handshake.auth.username}`);
    socket.emit('joined', true);
    let rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => room[0].includes(`room-`))
      .map((room) => room[0]);

    io.emit('roomList', rooms);
  });
  // Leave Room
  socket.on('unsubscribe', () => {
    socket.leave(`room-${socket.handshake.auth.username}`);
    socket.emit('unsubscribed', true);
    let rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => room[0].includes(`room-`))
      .map((room) => room[0]);

    io.emit('roomList', rooms);
  });
  // Send Message
  socket.on('send-message', (msg) => {
    io.to(`room-${socket.handshake.auth.username}`).emit('message', {
      id: socket.handshake.auth.username,
      msg,
    });
  });
  // Admin Utils
  socket.on('admin-connect', ()=>{
    let rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => room[0].includes(`room-`))
      .map((room) => room[0]);

    io.emit('roomList', rooms);
  })
  socket.on('admin-join', (room) => {
    socket.join(room);
    socket.emit('admin-joined', room);
  });
  socket.on('admin-unsubscribe', (room) => {
    socket.leave(room);
    socket.emit('unsubscribed', true);
    let rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => room[0].includes(`room-`))
      .map((room) => room[0]);

    io.emit('roomList', rooms);
  });
  socket.on('admin-send-message', (payload) => {
    io.to(payload.room).emit('message', {
      id: socket.handshake.auth.username,
      msg: payload.msg,
    });
  });
  // Disconnect
  socket.on('disconnect', () => {
    let rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => room[0].includes(`room-`))
      .map((room) => room[0]);

    io.emit('roomList', rooms);
  });
});

io.listen(4000);
