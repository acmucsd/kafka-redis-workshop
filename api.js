const express = require('express');
const uuid = require('uuid');
const { getConsumer, getProducer } = require('./kafka');
const { getCostForOrder } = require('./services/moneyService');
const Customer = require('./models/customer');
const Driver = require('./models/driver');
const Order = require('./models/order');
const Redis = require('ioredis');

const redis = new Redis(6379);

const router = express.Router();

// Create a customer (user)
router.post('/customer', async (req, res, next) => {
  const { customer } = req.body;

  customer.id = uuid.v4();
  customer.balance = 100;

  try {
    const createdCustomer = await Customer.create(customer);
    res.status(200).json({ customer: createdCustomer });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});

// Place an order
router.post('/customer/order', async (req, res, next) => {
  const { fromLocation, toLocation, customerId, restaurant, orderDetails } = req.body;

  // 1) TODO: Check if the cost of the order is in the Redis cache
  // If not, calculate the cost and add it to the cache
  const totalCost = 0;

  const orderRequest = {
    id: uuid.v4(),
    fromLocation,
    toLocation,
    customerId: customerId,
    driverId: null,
    restaurant,
    cost: totalCost,
    orderDetails,
    orderStatus: 'Pending',
  };

  const producer = await getProducer();
  // 1) TODO: Publish the order to the 'orders' topic with the order data


  console.log("Sent message to orders message queue");

  res.status(201).json({ order: orderRequest });
});


// Create a driver
router.post('/driver', async (req, res, next) => {
  const { driver } = req.body;
  driver.id = uuid.v4();
  
  try {
    const createdDriver = await Driver.create(driver);
    res.status(200).json({ driver: createdDriver });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Driver accepts an order
router.post('/driver/order', async (req, res, next) => {

  
  const { driverId } = req.body;

  const consumer = await getConsumer();
  // TODO: subscribe to the 'orders' topic
  // complete logic for what happens with the order is consumed
});

module.exports = router;