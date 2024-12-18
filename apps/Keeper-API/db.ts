import mongoose from 'mongoose';
import { db } from 'keeperEnvironment';

mongoose.Promise = global.Promise;
let isConnected;

const connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }

  return mongoose.connect(db).then(db => {
    isConnected = db.connections[0].readyState;
  });
};

export default connectToDatabase;
