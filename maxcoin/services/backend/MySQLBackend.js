/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const CoinAPI = require('../CoinAPI');
const mysql = require('mysql2/promise');
class MySQLBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null;
  }

  async connect() {

    this.connection = await mysql.createConnection({
      host:"localhost",
      port:3406,
      user:'root',
      password:"mypassword",
      database:"maxcoin"

    });

    return this.connection;

  }

  async disconnect() {
    return this.connection.end();
  }

  async insert() {  

    const data = await this.coinAPI.fetch();

    const sql = "INSERT INTO coinvalues (valuedate , coinvalue) VALUES ?";

    const values = [];

    Object.entries(data.bpi).forEach((entry)=>{
        values.push([entry[0] , entry[1]])

    });

    return this.connection.query(sql , [values]);
  }

  async getMax() {

    return this.connection.query("SELECT * FROM coinvalues  ORDER BY coinvalue DESC LIMIT 0,1");

  }

  async max() {

    console.log(`Connection to mysql`);

    console.time("mysql-connect");
    const client = this.connect();
    if (client) {
      console.log("Successfully connect to mysql");
    } else {
      throw new Error("Connecting to mysql failed");
    }

    console.timeEnd("mysql-connect");
    console.log("Inserting into mysql");
    console.time("mysql-insert");

    const insertResult = await this.insert();

    console.timeEnd("mysql-insert");

    console.log(`Inserted ${insertResult[0].affectedRows} documents into mysql`);


    console.log("Query max");
    console.time("mysql-find")
    const result = await this.getMax();

    const row = result[0][0];
    console.timeEnd("mysql-find")
    console.log(`Disconnecting  to mysql`);

    console.time("mysql-disconnect");
    await this.disconnect();
    console.timeEnd("mysql-disconnect");

    return row;
  }

  }

module.exports = MySQLBackend;