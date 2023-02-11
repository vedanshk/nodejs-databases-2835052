/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const CoinAPI = require('../CoinAPI');
const Redis = require("ioredis");
class RedisBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  async connect() {

    this.client = new Redis(7379);
    return this.client;

  }

  async disconnect() {
    return this.client.disconnect
  }

  async insert() {

  }

  async getMax() {

  }

  async max() {

  }
}

module.exports = RedisBackend;