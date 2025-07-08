/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import mongoose from "mongoose"

// Add global type declaration
declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}



const MONGODB_URI =
  "mongodb+srv://neontek:5VIrRCBxhrhDYVHc@neontekblog.zweuxxp.mongodb.net/?retryWrites=true&w=majority&appName=NeontekBlog"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongooseConnection

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
