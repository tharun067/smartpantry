import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Database is already connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'household_db',
        });
        isConnected = true;
        console.log("Mongodb connected");
    } catch (error) {
        console.log(error);
    }
}