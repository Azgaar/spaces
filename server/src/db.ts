import * as mongo from 'mongodb';

function initialize(app:Express.Application, dbName:string, collectionName:string) {
  const MONGO_ID:string | undefined = process.env.MONGO_ID;
  const MONGO_PASS:string | undefined = process.env.MONGO_PASS;
  const MONGO_URL:string | undefined = `mongodb+srv://${MONGO_ID}:${MONGO_PASS}@cluster0.auhmw.mongodb.net/armoria_api?retryWrites=true&w=majority`;

  interface app {
    locals: string;
  }

  const client = mongo.MongoClient;
  client.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, function (err:Error, client) {
    if (err) return console.error(err);
    const collection = client.db(dbName).collection(collectionName);
    console.error("MongoDB is connected");
    return collection;
    //app.set("collection", client.db(dbName).collection(collectionName));
  });
}

module.exports = {initialize};