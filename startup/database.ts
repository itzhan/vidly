import mongoose from "mongoose";
import c from "config";
import logger from "./logging";

async function connectDB() {
  const db: string = c.get("db");
  return mongoose.connect(db).then(() => logger.info(`Connecting ${db}`));
}

export default connectDB;
