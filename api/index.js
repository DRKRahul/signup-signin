import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import userRoutes from './server/routes/userRoutes';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

const port = process.env.PORT || 8000;

app.use('/api/v1/users', userRoutes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to this API.'
}));

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;