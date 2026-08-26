import session from "express-session";
import MongoStore from "connect-mongo";
import { env } from "../config/env.js";

const store = new MongoStore({
  mongoUrl: env.MONGO_CONNECTION_URI,
  collectionName: "sessions",
  dbName: "inktale",
});

export const sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    maxAge: env.SESSION_MAX_AGE,
  },
});
