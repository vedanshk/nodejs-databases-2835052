/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const CoinAPI = require("../CoinAPI");
const { MongoClient } = require("mongodb");
class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = "mongodb://localhost:37017/maxcoin";
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(this.mongoUrl);

    this.client = await mongoClient.connect();
    this.collection = this.client.db("maxcoin").collection("values");

    return this.client;
  }

  async disconnect() {
    if (this.client) {
      return this.client.close();
    }

    return false;
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];

    Object.entries(data.bpi).forEach((entry) => {
      documents.push({
        data: entry[0],
        value: entry[1],
      });
    });

    return this.collection.insertMany(documents);
  }

  async getMax() {
    return this.collection.findOne({}, { sort: { value: 1 } });
  }

  async max() {
    console.log(`Connection to MongoDB`);

    console.time("mongodb-connect");
    const client = await this.connect();
    if (client) {
      console.log("Successfully connect to MongoDB");
    } else {
      throw new Error("Connecting to Mongodb failed");
    }

    console.timeEnd("mongodb-connect");
    console.log("Inserting into Mongodb");
    console.time("mongodb-insert");

    const insertResult = await this.insert();

    console.timeEnd("mongodb-insert");

    console.log(`Inserted ${insertResult.result} documents into MongoDB`);


    console.log("Query max");
    console.time("mongodb-find")
    const doc = await this.getMax();
    console.timeEnd("mongodb-find")
    console.log(`Disconnecting  to MongoDB`);

    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");

    return {
      data:doc.data,
      value:doc.value,
    };
  }
}

module.exports = MongoBackend;
