import mongoose from "mongoose";
let catched = global.mongoose;

if (!catched) {
  catched = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (catched.conn) {
    return catched.conn;
  }
  if (!catched.promise) {
    const opts = {
      bufferCommands: false,
    };
    // CORRECTED LINE: Use process.env.MONGODB_URI directly
    // DO NOT append '/electrocart' here, as it's already in the environment variable
    catched.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    })
  }
  catched.conn = await catched.promise;
  return catched.conn;
}

export default connectDB;