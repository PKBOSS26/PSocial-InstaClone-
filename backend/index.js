
import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./utils/db.js";
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import messageRoute from './routes/messageRoute.js'

dotenv.config({});
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    return res.status(200).json({
        msg: "talking from be",
        success: true
    })
})

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin: "http://localhost:5173",
    Credential: true
}
app.use(cors(corsOptions));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`app is listening on ${PORT}`)
})