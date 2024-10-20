import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import todoRoute from '../backend/routes/todo.route.js'
import userRoute from '../backend/routes/user.route.js'
//Without cors we can't access backend database in frontend. it is a middleware
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

dotenv.config();
const PORT = process.env.PORT || 4001;
const DB_URI = process.env.MONGODB_URI


//------Middleware--------
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods:"GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
}))



//--------- Database connection ---------
try {
    await mongoose.connect(DB_URI)
    console.log("Successfully connected to MongoDB...");
} catch (err) {
    console.log(err);
}


//--------Routes ------------
app.use("/todo", todoRoute);
app.use("/user", userRoute);


app.listen(PORT, () => {
    console.log(`Listening to the port number : ${PORT}`);
})