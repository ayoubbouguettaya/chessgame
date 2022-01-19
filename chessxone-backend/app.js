require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const io = require('./config/socketIO-instance')

const sockets = require('./sockets')
const indexRouter = require('./api/routes');


/* Initialise mongoDB */

require('./config/mongodbConfig')();

/* Restful API with Express*/
const app = express();
const server = require('http').createServer(app);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(morgan('tiny'));

const corsOptions = {
  origin: process.env.CORS_ENDPOINT,
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use('/api', indexRouter);

/* Intialise Socket IO */

sockets(io);

server.listen(process.env.PORT || 5000, () => {
  console.log('listinning on port', 5000)
})
