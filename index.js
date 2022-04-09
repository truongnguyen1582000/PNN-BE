require('dotenv').config();
const express = require('express');
const cors = require('cors');
var router = express.Router();
const morgan = require('morgan');

// CONNECT TO DB
const DB = require('./config/db');
DB.connect();

const app = express();
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
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comment');
const supportRoute = require('./routes/support');
const commentHoiDapRoute = require('./routes/commentHoiDap');
const CommentCuuTroRoute = require('./routes/commentCuuTro');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const postsHoiDap = require('./routes/postsHoiDap');

app.use('/api', router);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/conversations', conversationRoute);
router.use('/messages', messageRoute);
router.use('/posts', postRoute);
router.use('/postsHoiDap', postsHoiDap);
router.use('/comment', commentRoute);
router.use('/support', supportRoute);
router.use('/products', productRoute);
router.use('/cart', cartRoute);
router.use('/commentHoiDap', commentHoiDapRoute);
router.use('/CommentCuuTro', CommentCuuTroRoute);

// HANDLE UNDEFINED ROUTE
app.all('*', (req, res, next) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// app.use(express.static('public'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
