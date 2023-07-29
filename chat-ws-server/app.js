const { Server } = require('socket.io');

const io = new Server({
  /* options */
  cors: {
    origin: 'http://localhost:2345',
  },
});

io.on('connection', (socket) => {
  console.log(socket)
  console.log('user connected', socket.handshake.auth, socket.id)
  socket.on('message', (msg) => {
    console.log(msg, socket.id)
  })
  // Disconnect
  socket.on('disconnect', () => {
    let rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => room[0].includes(`room-`))
      .map((room) => room[0]);

    io.emit('roomList', rooms);
    console.log('disconnect')
  });
});

io.listen(4000);
