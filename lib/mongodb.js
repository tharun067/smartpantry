import mongoose from "mongoose";
let isConnected = false;
export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected) {
        console.log("MongodB is Connected Successfully!");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "smartPantry",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("MongodB connected!");
    } catch (error) {
        console.log(error);
    }
}