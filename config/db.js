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

    // *** ADD THIS TEMPORARY DEBUGGING LINE ***
    console.log("MONGODB_URI received in function:", process.env.MONGODB_URI);
    // *****************************************

    catched.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    })
  }
  catched.conn = await catched.promise;
  return catched.conn;
}

export default connectDB;