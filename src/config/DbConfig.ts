import Constants from 'expo-constants';
import { connectDB } from './MongoDBConfig';

const getConfigValue = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key];
  if (!value) {
    throw new Error(`Missing configuration for ${key}`);
  }
  return value as string;
};

const dbConfig = {
  mongoUri: getConfigValue('MONGODB_URI'),
  jwtSecret: getConfigValue('JWT_SECRET'),
};

// Initialize MongoDB connection
connectDB()
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

export { dbConfig };