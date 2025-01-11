import mongoose from 'mongoose';

// TODO

// The database connection string (MONGODB_URI) environment variable is defined in the .env file.
mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;



