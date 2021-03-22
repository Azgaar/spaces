import {Collection} from "mongoose";
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

const connect = async () => {
  const uri = await mongod.getUri();

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };

  await mongoose.connect(uri, mongooseOptions);
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

const clearDatabase = () => {
  const collections = mongoose.connection.collections;
  return Promise.all(Object.values<Collection>(collections).map(collection => collection.deleteMany({})));
};

export default {connect, closeDatabase, clearDatabase};
