import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.connection.once('connected', () =>
      console.log('Database connected successfully')
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
