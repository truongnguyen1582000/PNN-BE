require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
var router = express.Router();
const morgan = require('morgan');

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

app.use('/api', router);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/posts', postRoute);
router.use('/products', productRoute);
router.use('/cart', cartRoute);
router.use('/group-order', groupOrder);
router.use('/address', addressRoute);

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
