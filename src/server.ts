import "dotenv/config";
import { createApp } from "./app.js";
import { env } from "./shared/config/env.js";
import { connectDB, disconnectDB } from "./shared/config/mongoose.js";

const app = createApp();

const server = app.listen(env.PORT, async () => {
  await connectDB(env.MONGO_CONNECTION_URI);
  console.log(`Server is running on http://localhost:${env.PORT}`);
});

server.on("close", async () => {
  await disconnectDB();
});
