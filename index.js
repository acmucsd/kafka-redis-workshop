const express = require('express')
const router = require('./api');
const Driver = require('./models/driver');
const Customer = require('./models/customer');
const Order = require('./models/order');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/', router);


const createTables = async () => {
  await Driver.sync();
  await Customer.sync();
  await Order.sync();
  console.log('Synced database tables')
}

createTables();

server.listen(3000, () => {
  console.log('Server started on port 3000');
});