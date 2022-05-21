require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
var router = express.Router();
const morgan = require('morgan');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

// CONNECT TO DB
const DB = require('./config/db');
DB.connect();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ROUTE IMPORT
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const groupOrder = require('./routes/groupOrder');
const addressRoute = require('./routes/address');
const orderRoute = require('./routes/order');

app.use('/api', router);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/posts', postRoute);
router.use('/products', productRoute);
router.use('/cart', cartRoute);
router.use('/group-order', groupOrder);
router.use('/address', addressRoute);
router.use('/order', orderRoute);

// HANDLE UNDEFINED ROUTE
app.all('*', (req, res, next) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// app.use(express.static('public'));
// IO handler
io.on('connect', (socket) => {
  socket.on('join', ({ name, room, userId }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
      userId,
    });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'EMH System',
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'EMH System',
      text: `${user.name} has joined!`,
    });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'EMH System',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
