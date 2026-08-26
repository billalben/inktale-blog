import mongoose from "mongoose";

const clientOptions: mongoose.ConnectOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: "inktale",
};

export async function connectDB(connectionURI: string): Promise<void> {
  try {
    await mongoose.connect(connectionURI, clientOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(
      "Error connecting to MongoDB: ",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error(
      "Error disconnecting from MongoDB: ",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}
