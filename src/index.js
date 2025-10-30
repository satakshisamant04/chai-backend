import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

// Load environment variables as early as possible
dotenv.config(); // will load from .env by default

// Start the app after DB connection
connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error while starting the server:', error);
        process.exit(1);
    });













/* import express from 'express';
const app = express();
(async ()=> {
    try{
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on("error", (err)=>{
        console.error("Error:", err)
        throw err
       })
       app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
       })
    }catch (error){
        console.error("Error:", error)
        throw err
    }
})()
    */