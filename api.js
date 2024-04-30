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

  // attempt to use a cached calculation for the cost
  // based on the from and to locations

  // check the cache
  // if in the cache, totalCost = that value
  const cacheKey = `${fromLocation}-${toLocation}`;
  let totalCost = 0;
  await redis.get(cacheKey).then((result) => {
    if (result) {
      totalCost = result;
      console.log("Retrieved cost from cache");
    } else {
      // calculate the cost
      totalCost = getCostForOrder(fromLocation, toLocation, orderDetails);
      // add to cache
      redis.set(cacheKey, totalCost);
    }
  });
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

  // Cache the order request
  // client.set(orderRequest.id, JSON.stringify(orderRequest));

  // Publish the order to Kafka topic
  const producer = await getProducer();
  producer.send({
    topic: 'orders',
    messages: [
      {
        value: JSON.stringify(orderRequest),
        timestamp: Date.now(),
      }
    ]
  });

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

  const consumer = await getConsumer();
  const { driverId } = req.body;

  await consumer.subscribe({ topic: 'orders', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('Received message from orders message queue');
      const order = JSON.parse(message.value);
      console.log(order);
      console.log("DRIVERID: ", driverId);

      order.driverId = driverId;

      try {
        await Order.create(order);
        res.status(200).json({ order: order });
        consumer.pause([{ topic: 'orders' }]);
        consumer.disconnect();
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  })
});

module.exports = router;