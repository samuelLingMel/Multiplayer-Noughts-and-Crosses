
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const port = process.env.Port || 3000
const XOsGame = require('./x&o-logic.js');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.get('/', (req, res) => res.send('hello'));

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock) => {

  if (waitingPlayer) {
    new XOsGame(waitingPlayer, sock);
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(port, () => {
  console.log(`RPS started on ${port}`);
});
