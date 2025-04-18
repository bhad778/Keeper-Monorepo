import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
let isConnected;

const connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }

  return mongoose.connect(process.env.VITE_DB || '').then(db => {
    isConnected = db.connections[0].readyState;
  });
};

export default connectToDatabase;
