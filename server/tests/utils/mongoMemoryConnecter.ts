import {Collection} from 'mongoose';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {DeleteWriteOpResultObject} from 'mongodb';

const mongod = new MongoMemoryServer();

const connect = async (): Promise<void> => {
  const uri = await mongod.getUri();

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };

  await mongoose.connect(uri, mongooseOptions);
};

const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

const clearDatabase = (): Promise<Array<DeleteWriteOpResultObject>> => {
  const collections = mongoose.connection.collections;
  return Promise.all(Object.values<Collection>(collections).map((collection) => collection.deleteMany({})));
};

export default {connect, closeDatabase, clearDatabase};
