const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let isConnected;

const connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }

  return mongoose.connect(process.env.DB).then((db) => {
    isConnected = db.connections[0].readyState;
  });
};

export default connectToDatabase;
