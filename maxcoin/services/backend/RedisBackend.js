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

    this.client = new Redis(7369);
    return this.client;

  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {

    const data = await this.coinAPI.fetch();
    const values = [];

    Object.entries(data.bpi).forEach((entries)=>{

      values.push(entries[1]);
      values.push(entries[0]);

    });

    return this.client.zadd('maxcoin:value' , values);

  }

  async getMax() {  

    return this.client.zrange('maxcoin:value' , -1 , -1 ,"WITHSCORES");

  }

  async max() {

    console.log(`Connection to Redis`);

    console.time("redis-connect");
    const client = this.connect();
    if (client) {
      console.log("Successfully connect to redis");
    } else {
      throw new Error("Connecting to redis failed");
    }

    console.timeEnd("redis-connect");
    console.log("Inserting into redis");
    console.time("redis-insert");

    const insertResult = await this.insert();

    console.timeEnd("redis-insert");

    console.log(`Inserted ${insertResult} documents into redis`);


    console.log("Query max");
    console.time("redis-find")
    const result = await this.getMax();
    console.timeEnd("redis-find")
    console.log(`Disconnecting  to redis`);

    console.time("redis-disconnect");
    await this.disconnect();
    console.timeEnd("redis-disconnect");

    return result;
  }

  }


module.exports = RedisBackend;