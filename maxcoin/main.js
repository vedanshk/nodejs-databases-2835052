const MongoBackend = require("./services/backend/MongoBackend");
const RedisBackend = require("./services/backend/RedisBackend");
const MYSQLBackend = require("./services/backend/MySQLBackend")

async function runMYSQL() {
  const mysqlBackend = new MYSQLBackend();
  return mysqlBackend.max();
}

async function runMongo() {
  const mongoBackend = new MongoBackend();
  return mongoBackend.max();
}

async function runRedis() {
  const redisBackend = new RedisBackend();
  return redisBackend.max();
}

runMYSQL()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));
