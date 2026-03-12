import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js DNS to use Google's public DNS for SRV lookups (bypasses loopback DNS issues)
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loomflow');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error}. Please ensure MongoDB is running locally or provide a valid MONGODB_URI in .env`);
    // Not exiting to allow the server to start even if DB is unavailable (for testing UI/Health)
  }
};
