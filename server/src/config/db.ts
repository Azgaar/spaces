import {ConnectionOptions} from 'mongoose';

export const getMongoURL = (): string => {
  const MONGO_ID: string | undefined = process.env.MONGO_ID;
  const MONGO_PASS: string | undefined = process.env.MONGO_PASS;
  const MONGO_DATABASE: string | undefined = process.env.MONGO_DATABASE;

  return `mongodb+srv://${MONGO_ID}:${MONGO_PASS}@cluster0.auhmw.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;
};

export const MONGO_OPTIONS: ConnectionOptions = {useNewUrlParser: true, useUnifiedTopology: true};
