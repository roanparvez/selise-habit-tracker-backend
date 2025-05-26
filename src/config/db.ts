import mongoose from 'mongoose';

const connectDB = async () => {
  const dbURI = process.env.MONGO_URI as string;

  await mongoose
    .connect(dbURI)
    .then((data) =>
      console.log(`Database connected to: ${data.connection.host}`)
    )
    .catch((err) => console.error(`Database connection error: ${err.message}`));
};

export default connectDB;
