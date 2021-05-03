import config from '../config';
import mongoose, {Mongoose} from 'mongoose';
import logger from '../utils/logger';

const MONGO_URL = config.mongo.url;
const MONGO_OPTIONS = config.mongo.options;

class MongoConnecter {
  private mongoClient: Mongoose;

  constructor() {
    this.mongoClient = mongoose;
  }

  connect(): Promise<Mongoose | void> {
    mongoose.connection.on('connected', () => {
      logger.info('[MongoConnecter] MongoDB connected');
    });

    mongoose.connection.on('disconnected', () => {
      logger.error('[MongoConnecter] MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`[MongoConnecter] ${String(err)}`);
      if (err.name === 'MongoNetworkError') {
        setTimeout(() => mongoose.connect(MONGO_URL, MONGO_OPTIONS), 5000);
      }
    });

    return mongoose.connect(MONGO_URL, MONGO_OPTIONS);
  }

  close(): Promise<void> {
    return this.mongoClient.connection.close();
  }
}

export default new MongoConnecter();
