const { Kafka } = require('kafkajs');

// set these environment variables so that kafka doesn't complain
// about a barebones setup
process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;
process.env.KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR = 1;

const kafka = new Kafka({
  clientId: 'acm_eats',
  brokers: ['localhost:9092'],
});
const producer = kafka.producer();

const getProducer = async () => {
  await producer.connect();
  return producer;
}

const getConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'acm_eats' });
  await consumer.connect();
  return consumer;
}

module.exports = {
  getProducer,
  getConsumer,
}